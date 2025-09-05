

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/components/layout/Providers";
import {
  StarIcon,
  PlayIcon,
  EyeIcon,
  ChatBubbleLeftIcon,
  ArrowLeftIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import axios from "axios";
import { toast } from "react-hot-toast";

interface StarredWork {
  id: number;
  title: string;
  description?: string;
  starsCount: number;
  performancesCount: number;
  commentsCount: number;
  viewsCount: number;
  createdAt: string;
  starredAt: string;
  user: {
    id: number;
    username: string;
    avatarUrl?: string;
  };
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export default function UserStarredWorksPage() {
  const params = useParams();
  const router = useRouter();
  const { user: currentUser } = useAuth();
  const [works, setWorks] = useState<StarredWork[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const userId = params.id as string;

  useEffect(() => {
    if (userId) {
      fetchStarredWorks();
    }
  }, [userId, currentPage]);

  const fetchStarredWorks = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `/api/users/${userId}/starred-works?page=${currentPage}&limit=20`
      );
      if (response.data.success) {
        setWorks(response.data.data.works);
        setPagination(response.data.data.pagination);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error || "获取收藏作品失败");
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">加载中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 页面头部 */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.back()}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <ArrowLeftIcon className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">收藏的作品</h1>
              <p className="text-gray-600">
                共收藏了 {pagination?.total || 0} 个作品
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 作品列表 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {works.length > 0 ? (
          <div className="space-y-6">
            {works.map((work) => (
              <div
                key={work.id}
                className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        <Link
                          href={`/works/${work.id}`}
                          className="hover:text-primary-600 transition-colors"
                        >
                          {work.title}
                        </Link>
                      </h3>
                      <span className="text-xs text-gray-500">
                        收藏于 {new Date(work.starredAt).toLocaleDateString()}
                      </span>
                    </div>

                    {work.description && (
                      <p className="text-gray-600 mb-3 line-clamp-2">
                        {work.description}
                      </p>
                    )}

                    <div className="flex items-center space-x-6 text-sm text-gray-500 mb-3">
                      <div className="flex items-center">
                        <StarIcon className="h-4 w-4 mr-1" />
                        {work.starsCount}
                      </div>
                      <div className="flex items-center">
                        <PlayIcon className="h-4 w-4 mr-1" />
                        {work.performancesCount}
                      </div>
                      <div className="flex items-center">
                        <ChatBubbleLeftIcon className="h-4 w-4 mr-1" />
                        {work.commentsCount}
                      </div>
                      <div className="flex items-center">
                        <EyeIcon className="h-4 w-4 mr-1" />
                        {work.viewsCount}
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-500">创作者：</span>
                      <Link
                        href={`/users/${work.user.id}`}
                        className="flex items-center space-x-2 text-sm text-primary-600 hover:text-primary-700"
                      >
                        {work.user.avatarUrl ? (
                          <img
                            className="h-6 w-6 rounded-full"
                            src={work.user.avatarUrl}
                            alt={work.user.username}
                          />
                        ) : (
                          <div className="h-6 w-6 rounded-full bg-primary-100 flex items-center justify-center">
                            <span className="text-xs text-primary-600">
                              {work.user.username.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        )}
                        <span>{work.user.username}</span>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <StarIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              还没有收藏任何作品
            </h3>
            <p className="text-gray-600 mb-4">
              去发现页面找到喜欢的作品并收藏吧
            </p>
            <Link
              href="/discover"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
            >
              去发现
            </Link>
          </div>
        )}

        {/* 分页 */}
        {pagination && pagination.totalPages > 1 && (
          <div className="mt-8 flex justify-center">
            <nav className="flex items-center space-x-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                上一页
              </button>

              {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                .filter(
                  (page) =>
                    page === 1 ||
                    page === pagination.totalPages ||
                    Math.abs(page - currentPage) <= 2
                )
                .map((page, index, array) => (
                  <div key={page} className="flex items-center">
                    {index > 0 && array[index - 1] !== page - 1 && (
                      <span className="px-2 text-gray-500">...</span>
                    )}
                    <button
                      onClick={() => handlePageChange(page)}
                      className={`px-3 py-2 text-sm font-medium rounded-md ${
                        page === currentPage
                          ? "text-white bg-primary-600"
                          : "text-gray-500 bg-white border border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      {page}
                    </button>
                  </div>
                ))}

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === pagination.totalPages}
                className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                下一页
              </button>
            </nav>
          </div>
        )}
      </div>
    </div>
  );
}

