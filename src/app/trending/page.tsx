"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/layout/Providers";
import { Work, Performance } from "@/types";
import {
  StarIcon,
  PlayIcon,
  MusicalNoteIcon,
  MicrophoneIcon,
  UserCircleIcon,
  FireIcon,
  ClockIcon,
  EyeIcon,
  ChatBubbleLeftIcon,
  DocumentArrowDownIcon,
  HeartIcon,
  PauseIcon,
} from "@heroicons/react/24/outline";
import {
  StarIcon as StarSolidIcon,
  HeartIcon as HeartSolidIcon,
} from "@heroicons/react/24/solid";
import Link from "next/link";
import { useAudioPlayer } from "@/hooks/useAudioPlayer";
import axios from "axios";
import { toast } from "react-hot-toast";

interface TrendingItem {
  id: number;
  type: "work" | "performance";
  title: string;
  description?: string;
  user: {
    id: number;
    username: string;
    avatarUrl?: string;
    isVerified: boolean;
  };
  genre?: {
    id: number;
    name: string;
  };
  instrument?: {
    id: number;
    name: string;
  };
  purpose?: {
    id: number;
    name: string;
  };
  tags?: Array<{
    id: number;
    name: string;
    color: string;
  }>;
  starsCount?: number;
  performancesCount?: number;
  commentsCount?: number;
  viewsCount?: number;
  likesCount?: number;
  playsCount?: number;
  audioFilePath?: string;
  pdfFilePath?: string;
  midiFilePath?: string;
  createdAt: Date;
  isStarred?: boolean;
  isLiked?: boolean;
}

export default function TrendingPage() {
  const router = useRouter();
  const { user: currentUser } = useAuth();
  const { play, pause, isPlaying, currentPerformance } = useAudioPlayer();

  const [items, setItems] = useState<TrendingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 筛选状态
  const [filters, setFilters] = useState({
    type: "all", // "all" | "work" | "performance"
    timePeriod: "all", // "daily" | "weekly" | "monthly" | "all"
  });

  useEffect(() => {
    fetchTrendingItems();
  }, [filters]);

  const fetchTrendingItems = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (filters.type !== "all") params.append("type", filters.type);
      params.append("timePeriod", filters.timePeriod);

      const response = await axios.get(`/api/trending?${params.toString()}`);

      if (response.data.success) {
        // 格式化数据
        const formattedItems: TrendingItem[] = response.data.data.items.map(
          (item: any) => ({
            id: item.id,
            type: item.type,
            title: item.title,
            description: item.description,
            user: item.user,
            genre: item.genre,
            instrument: item.instrument,
            purpose: item.purpose,
            tags: item.tags,
            starsCount: item.starsCount,
            performancesCount: item.performancesCount,
            commentsCount: item.commentsCount,
            viewsCount: item.viewsCount,
            likesCount: item.likesCount,
            playsCount: item.playsCount,
            audioFilePath: item.audioFilePath,
            pdfFilePath: item.pdfFilePath,
            midiFilePath: item.midiFilePath,
            createdAt: new Date(item.createdAt),
            isStarred: item.isStarred,
            isLiked: item.isLiked,
          })
        );

        setItems(formattedItems);
      }
    } catch (error: any) {
      setError(error.response?.data?.error || "获取热门内容失败");
    } finally {
      setLoading(false);
    }
  };

  const handleStar = async (item: TrendingItem) => {
    if (item.type !== "work" || !currentUser) return;

    try {
      if (item.isStarred) {
        // 取消收藏
        const response = await axios.delete(`/api/works/${item.id}/star`);
        if (response.data.success) {
          setItems((prev) =>
            prev.map((i) =>
              i.id === item.id && i.type === "work"
                ? {
                    ...i,
                    isStarred: false,
                    starsCount: response.data.data.starsCount,
                  }
                : i
            )
          );
          toast.success("取消收藏成功");
        }
      } else {
        // 收藏
        const response = await axios.post(`/api/works/${item.id}/star`);
        if (response.data.success) {
          setItems((prev) =>
            prev.map((i) =>
              i.id === item.id && i.type === "work"
                ? {
                    ...i,
                    isStarred: true,
                    starsCount: response.data.data.starsCount,
                  }
                : i
            )
          );
          toast.success("收藏成功");
        }
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error || "操作失败");
    }
  };

  const handleLike = async (item: TrendingItem) => {
    if (item.type !== "performance" || !currentUser) return;

    try {
      const response = await axios[item.isLiked ? "delete" : "post"](
        `/api/performances/${item.id}/like`
      );

      if (response.data.success) {
        setItems((prev) =>
          prev.map((i) =>
            i.id === item.id && i.type === "performance"
              ? {
                  ...i,
                  isLiked: !i.isLiked,
                  likesCount: (i.likesCount || 0) + (i.isLiked ? -1 : 1),
                }
              : i
          )
        );
      }
    } catch (error: any) {
      toast.error("操作失败");
    }
  };

  const handlePlay = (item: TrendingItem) => {
    if (item.type !== "performance" || !item.audioFilePath) return;

    // 转换为 Performance 格式
    const performance: Performance = {
      id: item.id,
      workId: 0,
      userId: item.user.id,
      title: item.title,
      description: item.description,
      audioFilePath: item.audioFilePath,
      type: "instrumental",
      likesCount: item.likesCount || 0,
      commentsCount: item.commentsCount || 0,
      playsCount: item.playsCount || 0,
      isPublic: true,
      createdAt: item.createdAt,
      updatedAt: item.createdAt,
      user: {
        id: item.user.id,
        username: item.user.username,
        email: "",
        passwordHash: "",
        avatarUrl: item.user.avatarUrl,
        bio: "",
        website: "",
        isVerified: item.user.isVerified,
        isActive: true,
        followersCount: 0,
        followingCount: 0,
        worksCount: 0,
        performancesCount: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      isLiked: item.isLiked,
    };

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

  const getItemUrl = (item: TrendingItem) => {
    if (item.type === "work") {
      return `/works/${item.id}`;
    } else {
      return `/performances/${item.id}`;
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("zh-CN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date);
  };

  const getRankBadge = (index: number) => {
    if (index === 0) return "🥇";
    if (index === 1) return "🥈";
    if (index === 2) return "🥉";
    return `#${index + 1}`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 页面标题 */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-2">
            <FireIcon className="h-8 w-8 text-orange-500" />
            <h1 className="text-3xl font-bold text-gray-900">热门榜单</h1>
          </div>
          <p className="text-gray-600">
            发现最受欢迎的音乐作品和演奏，按热度排序
          </p>
        </div>

        {/* 筛选器 */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-wrap gap-4 items-center">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                内容类型
              </label>
              <select
                value={filters.type}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, type: e.target.value }))
                }
                className="block px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              >
                <option value="all">全部内容</option>
                <option value="work">原创作品</option>
                <option value="performance">演奏演绎</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                时间周期
              </label>
              <select
                value={filters.timePeriod}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    timePeriod: e.target.value,
                  }))
                }
                className="block px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              >
                <option value="all">全部时间</option>
                <option value="daily">今日</option>
                <option value="weekly">本周</option>
                <option value="monthly">本月</option>
              </select>
            </div>
          </div>
        </div>

        {/* 内容列表 */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={fetchTrendingItems}
              className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              重试
            </button>
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-12">
            <FireIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              暂无热门内容
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              当前时间段内没有热门内容
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {items.map((item, index) => (
              <div
                key={`${item.type}-${item.id}`}
                className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    {/* 排名和类型 */}
                    <div className="flex items-center space-x-4">
                      <div className="text-2xl font-bold text-orange-500">
                        {getRankBadge(index)}
                      </div>
                      <div className="flex items-center space-x-2">
                        {item.type === "work" ? (
                          <MusicalNoteIcon className="h-5 w-5 text-blue-600" />
                        ) : (
                          <MicrophoneIcon className="h-5 w-5 text-green-600" />
                        )}
                        <span className="text-xs font-medium text-gray-500 uppercase">
                          {item.type === "work" ? "原创作品" : "演奏演绎"}
                        </span>
                      </div>
                    </div>

                    {/* 操作按钮 */}
                    <div className="flex items-center space-x-2">
                      {item.type === "work" && (
                        <button
                          onClick={() => handleStar(item)}
                          disabled={!currentUser}
                          className={`inline-flex items-center px-3 py-1.5 border border-transparent rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 ${
                            item.isStarred
                              ? "text-white bg-yellow-500 hover:bg-yellow-600"
                              : "text-primary-700 bg-primary-100 hover:bg-primary-200"
                          } ${
                            !currentUser ? "opacity-50 cursor-not-allowed" : ""
                          }`}
                        >
                          {item.isStarred ? (
                            <StarSolidIcon className="h-4 w-4 mr-1" />
                          ) : (
                            <StarIcon className="h-4 w-4 mr-1" />
                          )}
                          {item.isStarred ? "已收藏" : "收藏"}
                        </button>
                      )}

                      {item.type === "performance" && (
                        <button
                          onClick={() => handleLike(item)}
                          disabled={!currentUser}
                          className={`p-2 rounded-full hover:bg-gray-100 transition-colors duration-200 ${
                            !currentUser ? "opacity-50 cursor-not-allowed" : ""
                          }`}
                        >
                          {item.isLiked ? (
                            <HeartSolidIcon className="h-5 w-5 text-red-500" />
                          ) : (
                            <HeartIcon className="h-5 w-5 text-gray-400" />
                          )}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* 标题和描述 */}
                  <Link href={getItemUrl(item)}>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2 hover:text-primary-600 transition-colors duration-200">
                      {item.title}
                    </h3>
                  </Link>

                  {item.description && (
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {item.description}
                    </p>
                  )}

                  {/* 分类标签 */}
                  <div className="flex flex-wrap gap-2 mb-4">
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

                  {/* 用户信息 */}
                  <div className="flex items-center space-x-3 mb-4">
                    <Link
                      href={`/users/${item.user.id}`}
                      className="flex items-center space-x-2 hover:opacity-80 transition-opacity duration-200"
                    >
                      {item.user.avatarUrl ? (
                        <img
                          className="h-8 w-8 rounded-full"
                          src={item.user.avatarUrl}
                          alt={item.user.username}
                        />
                      ) : (
                        <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center">
                          <UserCircleIcon className="h-5 w-5 text-gray-600" />
                        </div>
                      )}
                      <span className="text-sm font-medium text-gray-900">
                        {item.user.username}
                      </span>
                      {item.user.isVerified && (
                        <span className="text-blue-500 text-xs">✓</span>
                      )}
                    </Link>
                  </div>

                  {/* 统计信息 */}
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center space-x-4">
                      {item.type === "work" && (
                        <>
                          <div className="flex items-center space-x-1">
                            <StarIcon className="h-4 w-4" />
                            <span>{item.starsCount || 0}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <PlayIcon className="h-4 w-4" />
                            <span>{item.performancesCount || 0}</span>
                          </div>
                        </>
                      )}
                      {item.type === "performance" && (
                        <>
                          <div className="flex items-center space-x-1">
                            <HeartIcon className="h-4 w-4" />
                            <span>{item.likesCount || 0}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <PlayIcon className="h-4 w-4" />
                            <span>{item.playsCount || 0}</span>
                          </div>
                        </>
                      )}
                      <div className="flex items-center space-x-1">
                        <EyeIcon className="h-4 w-4" />
                        <span>{item.viewsCount || 0}</span>
                      </div>
                      {item.commentsCount !== undefined &&
                        item.commentsCount > 0 && (
                          <div className="flex items-center space-x-1">
                            <ChatBubbleLeftIcon className="h-4 w-4" />
                            <span>{item.commentsCount}</span>
                          </div>
                        )}
                    </div>
                    <div className="flex items-center space-x-1">
                      <ClockIcon className="h-4 w-4" />
                      <span>{formatDate(item.createdAt)}</span>
                    </div>
                  </div>
                </div>

                {/* 操作按钮 */}
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <Link
                      href={getItemUrl(item)}
                      className="text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors duration-200"
                    >
                      查看详情
                    </Link>

                    <div className="flex items-center space-x-2">
                      {item.type === "work" && item.pdfFilePath && (
                        <a
                          href={item.pdfFilePath}
                          download
                          className="inline-flex items-center px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200"
                        >
                          <DocumentArrowDownIcon className="h-4 w-4 mr-1" />
                          下载乐谱
                        </a>
                      )}

                      {item.type === "performance" && item.audioFilePath && (
                        <button
                          onClick={() => handlePlay(item)}
                          className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200"
                        >
                          {currentPerformance?.id === item.id && isPlaying ? (
                            <PauseIcon className="h-4 w-4 mr-1" />
                          ) : (
                            <PlayIcon className="h-4 w-4 mr-1" />
                          )}
                          {currentPerformance?.id === item.id && isPlaying
                            ? "暂停"
                            : "播放"}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
