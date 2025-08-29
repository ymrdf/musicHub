"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/layout/Providers";
import { Performance } from "@/types";
import {
  PlayIcon,
  PauseIcon,
  HeartIcon,
  ChatBubbleLeftIcon,
  MusicalNoteIcon,
  MicrophoneIcon,
  UserCircleIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolidIcon } from "@heroicons/react/24/solid";
import Link from "next/link";

export default function PerformancesPage() {
  const router = useRouter();
  const { user: currentUser } = useAuth();

  const [performances, setPerformances] = useState<Performance[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 筛选状态
  const [filters, setFilters] = useState({
    type: "",
    workId: "",
    userId: "",
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchPerformances();
  }, [filters]);

  const fetchPerformances = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (filters.type) params.append("type", filters.type);
      if (filters.workId) params.append("workId", filters.workId);
      if (filters.userId) params.append("userId", filters.userId);

      const response = await fetch(`/api/performances?${params.toString()}`);
      if (response.ok) {
        const data = await response.json();
        setPerformances(data.data.performances);
      } else {
        throw new Error("获取演奏列表失败");
      }
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    // 这里可以实现搜索功能
    fetchPerformances();
  };

  const clearFilters = () => {
    setFilters({
      type: "",
      workId: "",
      userId: "",
    });
    setSearchQuery("");
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 页面标题 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">演奏列表</h1>
          <p className="text-gray-600 mt-2">发现优秀的演奏和演唱作品</p>
        </div>

        {/* 搜索和筛选 */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* 搜索框 */}
            <div className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  placeholder="搜索演奏标题、描述或演奏者..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
            </div>

            {/* 筛选按钮 */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              <FunnelIcon className="h-5 w-5" />
              <span>筛选</span>
            </button>

            {/* 搜索按钮 */}
            <button
              onClick={handleSearch}
              className="px-6 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
            >
              搜索
            </button>
          </div>

          {/* 筛选选项 */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    演奏类型
                  </label>
                  <select
                    value={filters.type}
                    onChange={(e) =>
                      setFilters((prev) => ({ ...prev, type: e.target.value }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="">全部类型</option>
                    <option value="instrumental">器乐演奏</option>
                    <option value="vocal">声乐演唱</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    作品ID
                  </label>
                  <input
                    type="text"
                    placeholder="输入作品ID"
                    value={filters.workId}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        workId: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    演奏者ID
                  </label>
                  <input
                    type="text"
                    placeholder="输入演奏者ID"
                    value={filters.userId}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        userId: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>

              <div className="mt-4 flex justify-end">
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  清除筛选
                </button>
              </div>
            </div>
          )}
        </div>

        {/* 演奏列表 */}
        {error ? (
          <div className="text-center py-8">
            <p className="text-red-600 mb-4">{error}</p>
            <button onClick={fetchPerformances} className="btn-primary">
              重试
            </button>
          </div>
        ) : performances.length === 0 ? (
          <div className="text-center py-12">
            <MusicalNoteIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              没有找到演奏
            </h3>
            <p className="text-gray-500 mb-4">尝试调整筛选条件或搜索关键词</p>
          </div>
        ) : (
          <div className="space-y-4">
            {performances.map((performance) => (
              <div
                key={performance.id}
                className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start space-x-6">
                  {/* 播放按钮 */}
                  <div className="flex-shrink-0 w-16 h-16 bg-primary-100 hover:bg-primary-200 rounded-full flex items-center justify-center transition-colors cursor-pointer">
                    <PlayIcon className="h-8 w-8 text-primary-600" />
                  </div>

                  {/* 演奏信息 */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-3 mb-3">
                      <Link
                        href={`/performances/${performance.id}`}
                        className="hover:text-primary-600 transition-colors"
                      >
                        <h3 className="text-xl font-semibold text-gray-900">
                          {performance.title}
                        </h3>
                      </Link>
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                        {performance.type === "instrumental" ? "器乐" : "声乐"}
                      </span>
                    </div>

                    <div className="flex items-center space-x-6 text-sm text-gray-500 mb-3">
                      <div className="flex items-center space-x-2">
                        {performance.type === "instrumental" ? (
                          <MusicalNoteIcon className="h-4 w-4" />
                        ) : (
                          <MicrophoneIcon className="h-4 w-4" />
                        )}
                        <span>{performance.instrument || "未知乐器"}</span>
                      </div>

                      {performance.duration && (
                        <span>{formatDuration(performance.duration)}</span>
                      )}

                      {performance.audioFileSize && (
                        <span>{formatFileSize(performance.audioFileSize)}</span>
                      )}
                    </div>

                    {performance.description && (
                      <p className="text-gray-600 mb-4 line-clamp-2">
                        {performance.description}
                      </p>
                    )}

                    {/* 演奏者信息 */}
                    <div className="flex items-center space-x-3 mb-4">
                      {performance.user?.avatarUrl ? (
                        <img
                          src={performance.user.avatarUrl}
                          alt={performance.user.username}
                          className="w-8 h-8 rounded-full"
                        />
                      ) : (
                        <UserCircleIcon className="w-8 h-8 text-gray-400" />
                      )}
                      <span className="text-sm text-gray-600">
                        {performance.user?.username}
                      </span>
                      <span className="text-xs text-gray-400">
                        {new Date(performance.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    {/* 统计信息 */}
                    <div className="flex items-center space-x-6 text-sm text-gray-500">
                      <div className="flex items-center space-x-2">
                        <HeartIcon className="h-4 w-4" />
                        <span>{performance.likesCount}</span>
                      </div>

                      <div className="flex items-center space-x-2">
                        <ChatBubbleLeftIcon className="h-4 w-4" />
                        <span>{performance.commentsCount}</span>
                      </div>

                      <div className="flex items-center space-x-2">
                        <PlayIcon className="h-4 w-4" />
                        <span>{performance.playsCount}</span>
                      </div>
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
