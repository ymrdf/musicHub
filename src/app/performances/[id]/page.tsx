"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/components/layout/Providers";
import { useAudioPlayer } from "@/hooks/useAudioPlayer";
import { Performance } from "@/types";
import {
  PlayIcon,
  PauseIcon,
  HeartIcon,
  ChatBubbleLeftIcon,
  MusicalNoteIcon,
  MicrophoneIcon,
  UserCircleIcon,
  ArrowLeftIcon,
  PencilIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolidIcon } from "@heroicons/react/24/solid";
import Link from "next/link";

export default function PerformanceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user: currentUser } = useAuth();
  const { play, pause, isPlaying, currentPerformance } = useAudioPlayer();

  const [performance, setPerformance] = useState<Performance | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [likeLoading, setLikeLoading] = useState(false);

  const performanceId = params.id as string;

  useEffect(() => {
    if (performanceId) {
      fetchPerformanceDetail();
    }
  }, [performanceId]);

  const fetchPerformanceDetail = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/performances/${performanceId}`);
      if (response.ok) {
        const data = await response.json();
        setPerformance(data.data);
      } else {
        throw new Error("获取演奏详情失败");
      }
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePlay = () => {
    if (!performance) return;

    if (currentPerformance?.id === performance.id) {
      if (isPlaying) {
        pause();
      } else {
        play();
      }
    } else {
      play(performance);
    }
  };

  const handleLike = async () => {
    if (!currentUser || !performance) {
      router.push("/auth/login");
      return;
    }

    setLikeLoading(true);
    try {
      const method = performance.isLiked ? "DELETE" : "POST";
      const response = await fetch(`/api/performances/${performance.id}/like`, {
        method,
      });

      if (response.ok) {
        setPerformance((prev) =>
          prev
            ? {
                ...prev,
                isLiked: !prev.isLiked,
                likesCount: prev.isLiked
                  ? prev.likesCount - 1
                  : prev.likesCount + 1,
              }
            : null
        );
      }
    } catch (error) {
      console.error("点赞失败:", error);
    } finally {
      setLikeLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!performance || !confirm("确定要删除这个演奏吗？")) return;

    try {
      const response = await fetch(`/api/performances/${performance.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        router.push(`/works/${performance.workId}`);
      }
    } catch (error) {
      console.error("删除失败:", error);
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error || !performance) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow p-6 text-center">
          <h1 className="text-xl font-semibold text-gray-900 mb-4">
            {error || "演奏不存在"}
          </h1>
          <button onClick={() => router.back()} className="btn-primary">
            返回
          </button>
        </div>
      </div>
    );
  }

  const isCurrentPlaying =
    currentPerformance?.id === performance.id && isPlaying;
  const isOwner = currentUser?.id === performance.userId;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 头部导航 */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <button
              onClick={() => router.back()}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeftIcon className="h-5 w-5" />
              <span>返回</span>
            </button>

            {isOwner && (
              <div className="flex items-center space-x-3">
                <Link
                  href={`/performances/${performance.id}/edit`}
                  className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-gray-900"
                >
                  <PencilIcon className="h-4 w-4" />
                  <span>编辑</span>
                </Link>
                <button
                  onClick={handleDelete}
                  className="flex items-center space-x-2 px-3 py-2 text-red-600 hover:text-red-800"
                >
                  <TrashIcon className="h-4 w-4" />
                  <span>删除</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 演奏信息卡片 */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex items-start space-x-6">
            {/* 播放按钮 */}
            <button
              onClick={handlePlay}
              className="flex-shrink-0 w-20 h-20 bg-primary-100 hover:bg-primary-200 rounded-full flex items-center justify-center transition-colors"
            >
              {isCurrentPlaying ? (
                <PauseIcon className="h-10 w-10 text-primary-600" />
              ) : (
                <PlayIcon className="h-10 w-10 text-primary-600" />
              )}
            </button>

            {/* 演奏信息 */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-3 mb-3">
                <h1 className="text-3xl font-bold text-gray-900">
                  {performance.title}
                </h1>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-800">
                  {performance.type === "instrumental"
                    ? "器乐演奏"
                    : "声乐演唱"}
                </span>
              </div>

              <div className="flex items-center space-x-6 text-gray-600 mb-4">
                <div className="flex items-center space-x-2">
                  {performance.type === "instrumental" ? (
                    <MusicalNoteIcon className="h-5 w-5" />
                  ) : (
                    <MicrophoneIcon className="h-5 w-5" />
                  )}
                  <span>{performance.instrument || "未知乐器"}</span>
                </div>

                {performance.duration && (
                  <span>{formatDuration(performance.duration)}</span>
                )}

                {performance.audioFileSize && (
                  <span>{formatFileSize(performance.audioFileSize)}</span>
                )}

                {performance.fileFormat && (
                  <span className="uppercase">{performance.fileFormat}</span>
                )}
              </div>

              {performance.description && (
                <p className="text-gray-700 text-lg mb-4">
                  {performance.description}
                </p>
              )}

              {/* 演奏者信息 */}
              <div className="flex items-center space-x-3 mb-4">
                {performance.user?.avatarUrl ? (
                  <img
                    src={performance.user.avatarUrl}
                    alt={performance.user.username}
                    className="w-10 h-10 rounded-full"
                  />
                ) : (
                  <UserCircleIcon className="w-10 h-10 text-gray-400" />
                )}
                <div>
                  <p className="font-medium text-gray-900">
                    {performance.user?.username}
                  </p>
                  <p className="text-sm text-gray-500">
                    {new Date(performance.createdAt).toLocaleDateString(
                      "zh-CN",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      }
                    )}
                  </p>
                </div>
              </div>

              {/* 统计信息 */}
              <div className="flex items-center space-x-6 text-sm text-gray-500">
                <button
                  onClick={handleLike}
                  disabled={likeLoading}
                  className={`flex items-center space-x-2 hover:text-primary-600 transition-colors ${
                    performance.isLiked ? "text-primary-600" : ""
                  }`}
                >
                  {performance.isLiked ? (
                    <HeartSolidIcon className="h-5 w-5" />
                  ) : (
                    <HeartIcon className="h-5 w-5" />
                  )}
                  <span>{performance.likesCount}</span>
                </button>

                <div className="flex items-center space-x-2">
                  <ChatBubbleLeftIcon className="h-5 w-5" />
                  <span>{performance.commentsCount}</span>
                </div>

                <div className="flex items-center space-x-2">
                  <PlayIcon className="h-5 w-5" />
                  <span>{performance.playsCount}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 作品信息 */}
        {performance.work && (
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">原作品</h2>
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {performance.work.title}
                </h3>
                {performance.work.description && (
                  <p className="text-gray-600">
                    {performance.work.description}
                  </p>
                )}
              </div>
              <Link
                href={`/works/${performance.work.id}`}
                className="btn-primary"
              >
                查看作品
              </Link>
            </div>
          </div>
        )}

        {/* 评论区 */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            评论 ({performance.commentsCount})
          </h2>

          {/* TODO: 这里需要实现评论组件 */}
          <div className="text-center py-8 text-gray-500">
            评论功能开发中...
          </div>
        </div>
      </div>
    </div>
  );
}
