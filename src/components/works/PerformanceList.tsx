"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/layout/Providers";
import { useAudioPlayer } from "@/hooks/useAudioPlayer";
import { Performance } from "@/types";
import Link from "next/link";
import {
  PlayIcon,
  PauseIcon,
  HeartIcon,
  ChatBubbleLeftIcon,
  MusicalNoteIcon,
  MicrophoneIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolidIcon } from "@heroicons/react/24/solid";

interface PerformanceListProps {
  workId: number;
  initialPerformances?: Performance[];
}

export default function PerformanceList({
  workId,
  initialPerformances = [],
}: PerformanceListProps) {
  const router = useRouter();
  const { user: currentUser } = useAuth();
  const { play, pause, isPlaying, currentPerformance } = useAudioPlayer();

  const [performances, setPerformances] =
    useState<Performance[]>(initialPerformances);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // If no initial data, fetch performance list
  useEffect(() => {
    if (initialPerformances.length === 0) {
      fetchPerformances();
    }
  }, [workId]);

  const fetchPerformances = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/performances?workId=${workId}`);
      if (response.ok) {
        const data = await response.json();
        setPerformances(data.data.performances);
      } else {
        throw new Error("Failed to fetch performance list");
      }
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePlay = (performance: Performance) => {
    if (currentPerformance?.id === performance.id) {
      // If clicking on currently playing performance, pause/play
      if (isPlaying) {
        pause();
      } else {
        play();
      }
    } else {
      // Play new performance
      play(performance);
    }
  };

  const handleLike = async (performance: Performance) => {
    if (!currentUser) {
      router.push("/auth/login");
      return;
    }

    try {
      const method = performance.isLiked ? "DELETE" : "POST";
      const response = await fetch(`/api/performances/${performance.id}/like`, {
        method,
      });

      if (response.ok) {
        // Update local state
        setPerformances((prev) =>
          prev.map((p) =>
            p.id === performance.id
              ? {
                  ...p,
                  isLiked: !p.isLiked,
                  likesCount: p.isLiked ? p.likesCount - 1 : p.likesCount + 1,
                }
              : p
          )
        );
      }
    } catch (error) {
      console.error("Like failed:", error);
    }
  };

  const formatDuration = (seconds?: number): string => {
    if (!seconds) return "0:00";
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const formatFileSize = (bytes?: number): string => {
    if (!bytes) return "0 B";
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="h-20 bg-gray-200 rounded-lg"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600 mb-4">{error}</p>
        <button onClick={fetchPerformances} className="btn-primary">
          Retry
        </button>
      </div>
    );
  }

  if (performances.length === 0) {
    return (
      <div className="text-center py-12">
        <MusicalNoteIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No one has performed this work yet
        </h3>
        <p className="text-gray-500 mb-4">
          Be the first to share a performance!
        </p>
        {currentUser && (
          <button
            onClick={() => router.push(`/performances/new?workId=${workId}`)}
            className="btn-primary"
          >
            Upload My Performance
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {performances.map((performance) => {
        const isCurrentPlaying =
          currentPerformance?.id === performance.id && isPlaying;

        return (
          <div
            key={performance.id}
            className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start space-x-4">
              {/* Play button */}
              <button
                onClick={() => handlePlay(performance)}
                className="flex-shrink-0 w-12 h-12 bg-primary-100 hover:bg-primary-200 rounded-full flex items-center justify-center transition-colors"
              >
                {isCurrentPlaying ? (
                  <PauseIcon className="h-6 w-6 text-primary-600" />
                ) : (
                  <PlayIcon className="h-6 w-6 text-primary-600" />
                )}
              </button>

              {/* Performance info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-2">
                  <Link
                    href={`/performances/${performance.id}`}
                    className="hover:text-primary-600 transition-colors"
                  >
                    <h3 className="text-lg font-medium text-gray-900 truncate">
                      {performance.title}
                    </h3>
                  </Link>
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    {performance.type === "instrumental"
                      ? "Instrumental"
                      : "Vocal"}
                  </span>
                </div>

                <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                  <div className="flex items-center space-x-1">
                    {performance.type === "instrumental" ? (
                      <MusicalNoteIcon className="h-4 w-4" />
                    ) : (
                      <MicrophoneIcon className="h-4 w-4" />
                    )}
                    <span>
                      {performance.instrument || "Unknown instrument"}
                    </span>
                  </div>

                  {performance.duration && (
                    <span>{formatDuration(performance.duration)}</span>
                  )}

                  {performance.audioFileSize && (
                    <span>{formatFileSize(performance.audioFileSize)}</span>
                  )}
                </div>

                {performance.description && (
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {performance.description}
                  </p>
                )}

                {/* Performer info */}
                <div className="flex items-center space-x-2 mb-3">
                  {performance.user?.avatarUrl ? (
                    <img
                      src={performance.user.avatarUrl}
                      alt={performance.user.username}
                      className="w-6 h-6 rounded-full"
                    />
                  ) : (
                    <UserCircleIcon className="w-6 h-6 text-gray-400" />
                  )}
                  <span className="text-sm text-gray-600">
                    {performance.user?.username}
                  </span>
                  <span className="text-xs text-gray-400">
                    {new Date(performance.createdAt).toLocaleDateString()}
                  </span>
                </div>

                {/* Statistics */}
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <button
                    onClick={() => handleLike(performance)}
                    className={`flex items-center space-x-1 hover:text-primary-600 transition-colors ${
                      performance.isLiked ? "text-primary-600" : ""
                    }`}
                  >
                    {performance.isLiked ? (
                      <HeartSolidIcon className="h-4 w-4" />
                    ) : (
                      <HeartIcon className="h-4 w-4" />
                    )}
                    <span>{performance.likesCount}</span>
                  </button>

                  <div className="flex items-center space-x-1">
                    <ChatBubbleLeftIcon className="h-4 w-4" />
                    <span>{performance.commentsCount}</span>
                  </div>

                  <div className="flex items-center space-x-1">
                    <PlayIcon className="h-4 w-4" />
                    <span>{performance.playsCount}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
