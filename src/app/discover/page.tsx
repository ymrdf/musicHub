"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/layout/Providers";
import { Work, Performance, Category, Tag } from "@/types";
import {
  PlayIcon,
  PauseIcon,
  HeartIcon,
  StarIcon,
  MusicalNoteIcon,
  MicrophoneIcon,
  UserCircleIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  FireIcon,
  ClockIcon,
  EyeIcon,
  ChatBubbleLeftIcon,
  DocumentArrowDownIcon,
} from "@heroicons/react/24/outline";
import {
  HeartIcon as HeartSolidIcon,
  StarIcon as StarSolidIcon,
} from "@heroicons/react/24/solid";
import Link from "next/link";
import { useAudioPlayer } from "@/hooks/useAudioPlayer";

interface DiscoverItem {
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
  genre?: Category;
  instrument?: Category;
  purpose?: Category;
  tags?: Tag[];
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

export default function DiscoverPage() {
  const router = useRouter();
  const { user: currentUser } = useAuth();
  const { play, pause, isPlaying, currentPerformance } = useAudioPlayer();

  const [items, setItems] = useState<DiscoverItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 筛选和搜索状态
  const [filters, setFilters] = useState({
    genreId: "",
    instrumentId: "",
    purposeId: "",
    sortBy: "createdAt", // "createdAt" | "likesCount" | "playsCount"
    sortOrder: "desc" as "asc" | "desc",
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  // 分类数据
  const [categories, setCategories] = useState<{
    genre: Category[];
    instrument: Category[];
    purpose: Category[];
  }>({
    genre: [],
    instrument: [],
    purpose: [],
  });

  // 热门标签
  const [popularTags, setPopularTags] = useState<Tag[]>([]);

  useEffect(() => {
    fetchCategories();
    fetchPopularTags();
  }, []);

  useEffect(() => {
    fetchItems();
  }, [filters, searchQuery]);

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/categories");
      if (response.ok) {
        const data = await response.json();
        setCategories(data.data);
      }
    } catch (error) {
      console.error("获取分类失败:", error);
    }
  };

  const fetchPopularTags = async () => {
    try {
      const response = await fetch("/api/tags?limit=20");
      if (response.ok) {
        const data = await response.json();
        setPopularTags(data.data);
      }
    } catch (error) {
      console.error("获取热门标签失败:", error);
    }
  };

  const fetchItems = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();

      // 添加筛选参数
      if (filters.genreId) params.append("genreId", filters.genreId);
      if (filters.instrumentId)
        params.append("instrumentId", filters.instrumentId);
      if (filters.purposeId) params.append("purposeId", filters.purposeId);
      if (filters.sortBy) params.append("sortBy", filters.sortBy);
      if (filters.sortOrder) params.append("sortOrder", filters.sortOrder);
      if (searchQuery) params.append("search", encodeURIComponent(searchQuery));

      // 获取作品数据
      let worksData = { data: { items: [] } };
      try {
        const worksResponse = await fetch(`/api/works?${params.toString()}`);
        if (worksResponse.ok) {
          worksData = await worksResponse.json();
        } else {
          console.warn(
            "Works API failed:",
            worksResponse.status,
            worksResponse.statusText
          );
        }
      } catch (error) {
        console.error("Error fetching works:", error);
      }

      // 获取演奏数据
      let performancesData = { data: { items: [] } };
      try {
        const performancesResponse = await fetch(
          `/api/performances?${params.toString()}`
        );
        if (performancesResponse.ok) {
          performancesData = await performancesResponse.json();
        } else {
          console.warn(
            "Performances API failed:",
            performancesResponse.status,
            performancesResponse.statusText
          );
        }
      } catch (error) {
        console.error("Error fetching performances:", error);
      }

      // 调试信息
      console.log("Works API response:", worksData);
      console.log("Performances API response:", performancesData);

      // 格式化作品数据
      const works: DiscoverItem[] = (worksData.data?.items || [])
        .map((work: any) => {
          if (!work || !work.id) {
            console.warn("Invalid work data:", work);
            return null;
          }
          return {
            id: work.id,
            type: "work" as const,
            title: work.title || "",
            description: work.description || "",
            user: work.user || {
              id: 0,
              username: "Unknown",
              isVerified: false,
            },
            genre: work.genre,
            instrument: work.instrument,
            purpose: work.purpose,
            tags: work.tags || [],
            starsCount: work.starsCount || 0,
            performancesCount: work.performancesCount || 0,
            commentsCount: work.commentsCount || 0,
            viewsCount: work.viewsCount || 0,
            pdfFilePath: work.pdfFilePath,
            midiFilePath: work.midiFilePath,
            createdAt: new Date(work.createdAt || Date.now()),
            isStarred: work.isStarred || false,
          };
        })
        .filter(Boolean) as DiscoverItem[];

      // 格式化演奏数据
      const performances: DiscoverItem[] = (performancesData.data?.items || [])
        .map((performance: any) => {
          if (!performance || !performance.id) {
            console.warn("Invalid performance data:", performance);
            return null;
          }
          return {
            id: performance.id,
            type: "performance" as const,
            title: performance.title || "",
            description: performance.description || "",
            user: performance.user || {
              id: 0,
              username: "Unknown",
              isVerified: false,
            },
            genre: performance.work?.genre,
            instrument: performance.work?.instrument,
            purpose: performance.work?.purpose,
            likesCount: performance.likesCount || 0,
            commentsCount: performance.commentsCount || 0,
            playsCount: performance.playsCount || 0,
            audioFilePath: performance.audioFilePath,
            createdAt: new Date(performance.createdAt || Date.now()),
            isLiked: performance.isLiked || false,
          };
        })
        .filter(Boolean) as DiscoverItem[];

      // 合并数据
      const allItems = [...works, ...performances];

      // 排序
      allItems.sort((a, b) => {
        const aValue = getSortValue(a, filters.sortBy);
        const bValue = getSortValue(b, filters.sortBy);

        if (filters.sortOrder === "asc") {
          return aValue - bValue;
        } else {
          return bValue - aValue;
        }
      });

      setItems(allItems);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const getSortValue = (item: DiscoverItem, sortBy: string): number => {
    switch (sortBy) {
      case "likesCount":
        return item.likesCount || 0;
      case "playsCount":
        return item.playsCount || 0;
      case "starsCount":
        return item.starsCount || 0;
      case "createdAt":
      default:
        return item.createdAt.getTime();
    }
  };

  const handlePlay = (item: DiscoverItem) => {
    if (item.audioFilePath) {
      // 转换为 Performance 格式
      const performance: Performance = {
        id: item.id,
        workId: 0, // 这里需要从原数据获取
        userId: item.user.id,
        title: item.title,
        description: item.description,
        audioFilePath: item.audioFilePath!,
        type: "instrumental", // 这里需要从原数据获取
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
    }
  };

  const handleStar = async (item: DiscoverItem) => {
    if (item.type !== "work" || !currentUser) return;

    try {
      if (item.isStarred) {
        // 取消收藏
        const response = await fetch(`/api/works/${item.id}/star`, {
          method: "DELETE",
        });

        if (response.ok) {
          const data = await response.json();
          setItems((prev) =>
            prev.map((i) =>
              i.id === item.id && i.type === "work"
                ? {
                    ...i,
                    isStarred: false,
                    starsCount: data.data.starsCount,
                  }
                : i
            )
          );
        }
      } else {
        // 收藏
        const response = await fetch(`/api/works/${item.id}/star`, {
          method: "POST",
        });

        if (response.ok) {
          const data = await response.json();
          setItems((prev) =>
            prev.map((i) =>
              i.id === item.id && i.type === "work"
                ? {
                    ...i,
                    isStarred: true,
                    starsCount: data.data.starsCount,
                  }
                : i
            )
          );
        }
      }
    } catch (error) {
      console.error("收藏操作失败:", error);
    }
  };

  const handleLike = async (item: DiscoverItem) => {
    if (item.type !== "performance") return;

    try {
      const response = await fetch(`/api/performances/${item.id}/like`, {
        method: item.isLiked ? "DELETE" : "POST",
      });

      if (response.ok) {
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
    } catch (error) {
      console.error("点赞操作失败:", error);
    }
  };

  const clearFilters = () => {
    setFilters({
      genreId: "",
      instrumentId: "",
      purposeId: "",
      sortBy: "createdAt",
      sortOrder: "desc",
    });
    setSearchQuery("");
  };

  const getItemUrl = (item: DiscoverItem) => {
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 页面标题 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">发现音乐</h1>
          <p className="text-gray-600">
            发现优秀的演奏演绎，直接播放音乐，与音乐创作者互动交流
          </p>
        </div>

        {/* 搜索和筛选 */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          {/* 搜索框 */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="搜索作品、演奏、创作者..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                />
              </div>
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <FunnelIcon className="h-4 w-4 mr-2" />
              筛选
            </button>
          </div>

          {/* 筛选面板 */}
          {showFilters && (
            <div className="border-t border-gray-200 pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                {/* 流派筛选 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    流派
                  </label>
                  <select
                    value={filters.genreId}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        genreId: e.target.value,
                      }))
                    }
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  >
                    <option value="">全部流派</option>
                    {categories.genre.map((genre) => (
                      <option key={genre.id} value={genre.id}>
                        {genre.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 乐器筛选 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    乐器
                  </label>
                  <select
                    value={filters.instrumentId}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        instrumentId: e.target.value,
                      }))
                    }
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  >
                    <option value="">全部乐器</option>
                    {categories.instrument.map((instrument) => (
                      <option key={instrument.id} value={instrument.id}>
                        {instrument.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 用途筛选 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    用途
                  </label>
                  <select
                    value={filters.purposeId}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        purposeId: e.target.value,
                      }))
                    }
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  >
                    <option value="">全部用途</option>
                    {categories.purpose.map((purpose) => (
                      <option key={purpose.id} value={purpose.id}>
                        {purpose.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* 排序 */}
              <div className="flex flex-col sm:flex-row gap-4 items-end">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    排序方式
                  </label>
                  <div className="flex gap-2">
                    <select
                      value={filters.sortBy}
                      onChange={(e) =>
                        setFilters((prev) => ({
                          ...prev,
                          sortBy: e.target.value,
                        }))
                      }
                      className="block px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    >
                      <option value="createdAt">最新</option>
                      <option value="starsCount">收藏数</option>
                      <option value="likesCount">点赞数</option>
                      <option value="playsCount">播放数</option>
                    </select>
                    <select
                      value={filters.sortOrder}
                      onChange={(e) =>
                        setFilters((prev) => ({
                          ...prev,
                          sortOrder: e.target.value as "asc" | "desc",
                        }))
                      }
                      className="block px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    >
                      <option value="desc">降序</option>
                      <option value="asc">升序</option>
                    </select>
                  </div>
                </div>

                <button
                  onClick={clearFilters}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  清除筛选
                </button>
              </div>
            </div>
          )}

          {/* 热门标签 */}
          {popularTags.length > 0 && (
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-sm font-medium text-gray-700 mb-3">
                热门标签
              </h3>
              <div className="flex flex-wrap gap-2">
                {popularTags.slice(0, 10).map((tag) => (
                  <button
                    key={tag.id}
                    onClick={() => setSearchQuery(tag.name)}
                    className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 hover:bg-gray-200 transition-colors duration-200"
                  >
                    {tag.name}
                    <span className="ml-1 text-gray-500">
                      ({tag.usageCount})
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
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
              onClick={fetchItems}
              className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              重试
            </button>
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-12">
            <MusicalNoteIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">暂无内容</h3>
            <p className="mt-1 text-sm text-gray-500">
              没有找到符合条件的内容，试试调整筛选条件
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => (
              <div
                key={`${item.type}-${item.id}`}
                className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200"
              >
                {/* 内容头部 */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      {item.type === "work" ? (
                        <MusicalNoteIcon className="h-5 w-5 text-blue-600" />
                      ) : (
                        <MicrophoneIcon className="h-5 w-5 text-green-600" />
                      )}
                      <span className="text-xs font-medium text-gray-500 uppercase">
                        {item.type === "work" ? "原创作品" : "演奏"}
                      </span>
                    </div>

                    <div className="flex items-center space-x-2">
                      {item.type === "work" ? (
                        <button
                          onClick={() => handleStar(item)}
                          disabled={!currentUser}
                          className={`inline-flex items-center px-2 py-1 border border-transparent rounded-md text-xs font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 ${
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
                      ) : (
                        <button
                          onClick={() => handleLike(item)}
                          className="p-1 rounded-full hover:bg-gray-100 transition-colors duration-200"
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

                  <Link href={getItemUrl(item)}>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 hover:text-primary-600 transition-colors duration-200 line-clamp-2">
                      {item.title}
                    </h3>
                  </Link>

                  {item.description && (
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
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
                      {item.type === "work" ? (
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
                      ) : (
                        <>
                          {item.likesCount !== undefined && (
                            <div className="flex items-center space-x-1">
                              <HeartIcon className="h-4 w-4" />
                              <span>{item.likesCount}</span>
                            </div>
                          )}
                          {item.playsCount !== undefined && (
                            <div className="flex items-center space-x-1">
                              <PlayIcon className="h-4 w-4" />
                              <span>{item.playsCount}</span>
                            </div>
                          )}
                        </>
                      )}
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
