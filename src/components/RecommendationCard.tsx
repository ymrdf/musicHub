"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/layout/Providers";
import { useAudioPlayer } from "@/hooks/useAudioPlayer";
import {
  StarIcon,
  HeartIcon,
  PlayIcon,
  MusicalNoteIcon,
  UserIcon,
  EyeIcon,
  ChatBubbleLeftIcon,
} from "@heroicons/react/24/outline";
import {
  StarIcon as StarIconSolid,
  HeartIcon as HeartIconSolid,
} from "@heroicons/react/24/solid";
import { toast } from "react-hot-toast";

interface User {
  id: number;
  username: string;
  avatarUrl?: string;
  isVerified: boolean;
}

interface Category {
  id: number;
  name: string;
}

interface Work {
  id: number;
  title: string;
}

interface RecommendationItem {
  id: number;
  type: "work" | "performance";
  title: string;
  description?: string;
  user: User;
  genre?: Category;
  instrument?: Category;
  purpose?: Category;
  work?: Work;
  // Work related
  starsCount?: number;
  performancesCount?: number;
  commentsCount?: number;
  viewsCount?: number;
  pdfFilePath?: string;
  midiFilePath?: string;
  isStarred?: boolean;
  // Performance related
  likesCount?: number;
  playsCount?: number;
  audioFilePath?: string;
  isLiked?: boolean;
  createdAt: string;
}

interface RecommendationCardProps {
  item: RecommendationItem;
  showActions?: boolean;
}

export default function RecommendationCard({
  item,
  showActions = true,
}: RecommendationCardProps) {
  const router = useRouter();
  const { user: currentUser } = useAuth();
  const { play, pause, isPlaying, currentPerformance } = useAudioPlayer();
  const [isStarred, setIsStarred] = useState(item.isStarred || false);
  const [isLiked, setIsLiked] = useState(item.isLiked || false);
  const [starsCount, setStarsCount] = useState(item.starsCount || 0);
  const [likesCount, setLikesCount] = useState(item.likesCount || 0);

  const isWork = item.type === "work";
  const isPerformance = item.type === "performance";

  const handleStar = async () => {
    if (!currentUser) {
      toast.error("Please login first");
      return;
    }

    try {
      const response = await fetch(`/api/works/${item.id}/star`, {
        method: isStarred ? "DELETE" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        setIsStarred(!isStarred);
        setStarsCount(isStarred ? starsCount - 1 : starsCount + 1);
        toast.success(isStarred ? "Unstarred" : "Starred successfully");
      } else {
        toast.error("Operation failed");
      }
    } catch (error) {
      toast.error("Network error");
    }
  };

  const handleLike = async () => {
    if (!currentUser) {
      toast.error("Please login first");
      return;
    }

    try {
      const response = await fetch(`/api/performances/${item.id}/like`, {
        method: isLiked ? "DELETE" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        setIsLiked(!isLiked);
        setLikesCount(isLiked ? likesCount - 1 : likesCount + 1);
        toast.success(isLiked ? "Unliked" : "Liked successfully");
      } else {
        toast.error("Operation failed");
      }
    } catch (error) {
      toast.error("Network error");
    }
  };

  const handlePlay = () => {
    if (isPerformance && item.audioFilePath) {
      play({
        id: item.id,
        workId: item.work?.id || 0,
        userId: item.user.id,
        title: item.title,
        audioFilePath: item.audioFilePath,
        type: "instrumental",
        likesCount: item.likesCount || 0,
        commentsCount: item.commentsCount || 0,
        playsCount: item.playsCount || 0,
        isPublic: true,
        createdAt: new Date(item.createdAt),
        updatedAt: new Date(item.createdAt),
        user: item.user,
      } as any);
    }
  };

  const handleCardClick = () => {
    if (isWork) {
      router.push(`/works/${item.id}`);
    } else if (isPerformance) {
      router.push(`/performances/${item.id}`);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 24 * 7) return `${Math.floor(diffInHours / 24)}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
      <div className="p-4">
        {/* Header info */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
              {isWork ? (
                <MusicalNoteIcon className="h-4 w-4 text-primary-600" />
              ) : (
                <PlayIcon className="h-4 w-4 text-primary-600" />
              )}
            </div>
            <div>
              <h3
                className="font-semibold text-gray-900 hover:text-primary-600 cursor-pointer line-clamp-1"
                onClick={handleCardClick}
              >
                {item.title}
              </h3>
              {isPerformance && item.work && (
                <p className="text-sm text-gray-500">基于：{item.work.title}</p>
              )}
            </div>
          </div>
          {showActions && (
            <div className="flex items-center space-x-2">
              {isWork && (
                <button
                  onClick={handleStar}
                  className="flex items-center space-x-1 text-gray-500 hover:text-yellow-500 transition-colors"
                >
                  {isStarred ? (
                    <StarIconSolid className="h-4 w-4 text-yellow-500" />
                  ) : (
                    <StarIcon className="h-4 w-4" />
                  )}
                  <span className="text-xs">{starsCount}</span>
                </button>
              )}
              {isPerformance && (
                <button
                  onClick={handleLike}
                  className="flex items-center space-x-1 text-gray-500 hover:text-red-500 transition-colors"
                >
                  {isLiked ? (
                    <HeartIconSolid className="h-4 w-4 text-red-500" />
                  ) : (
                    <HeartIcon className="h-4 w-4" />
                  )}
                  <span className="text-xs">{likesCount}</span>
                </button>
              )}
            </div>
          )}
        </div>

        {/* 描述 */}
        {item.description && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {item.description}
          </p>
        )}

        {/* 分类标签 */}
        <div className="flex flex-wrap gap-1 mb-3">
          {item.genre && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              {item.genre.name}
            </span>
          )}
          {item.instrument && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
              {item.instrument.name}
            </span>
          )}
          {item.purpose && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
              {item.purpose.name}
            </span>
          )}
        </div>

        {/* 统计信息 */}
        <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
          <div className="flex items-center space-x-4">
            {isWork && (
              <>
                <span className="flex items-center space-x-1">
                  <StarIcon className="h-3 w-3" />
                  <span>{starsCount}</span>
                </span>
                <span className="flex items-center space-x-1">
                  <PlayIcon className="h-3 w-3" />
                  <span>{item.performancesCount}</span>
                </span>
                <span className="flex items-center space-x-1">
                  <EyeIcon className="h-3 w-3" />
                  <span>{item.viewsCount}</span>
                </span>
              </>
            )}
            {isPerformance && (
              <>
                <span className="flex items-center space-x-1">
                  <HeartIcon className="h-3 w-3" />
                  <span>{likesCount}</span>
                </span>
                <span className="flex items-center space-x-1">
                  <PlayIcon className="h-3 w-3" />
                  <span>{item.playsCount}</span>
                </span>
                <span className="flex items-center space-x-1">
                  <ChatBubbleLeftIcon className="h-3 w-3" />
                  <span>{item.commentsCount}</span>
                </span>
              </>
            )}
          </div>
          <span>{formatDate(item.createdAt)}</span>
        </div>

        {/* 用户信息 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center">
              {item.user.avatarUrl ? (
                <img
                  src={item.user.avatarUrl}
                  alt={item.user.username}
                  className="w-6 h-6 rounded-full object-cover"
                />
              ) : (
                <UserIcon className="h-3 w-3 text-gray-500" />
              )}
            </div>
            <span className="text-sm text-gray-700 font-medium">
              {item.user.username}
            </span>
            {item.user.isVerified && (
              <span className="text-xs bg-blue-100 text-blue-800 px-1 rounded">
                认证
              </span>
            )}
          </div>

          {/* 播放按钮（仅演奏） */}
          {isPerformance && item.audioFilePath && (
            <button
              onClick={handlePlay}
              className="flex items-center justify-center w-8 h-8 bg-primary-600 text-white rounded-full hover:bg-primary-700 transition-colors"
            >
              <PlayIcon className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
