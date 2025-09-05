

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/components/layout/Providers";
import {
  UserIcon,
  MusicalNoteIcon,
  PlayIcon,
  UserPlusIcon,
  UserMinusIcon,
  ArrowLeftIcon,
  CalendarIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import axios from "axios";
import { toast } from "react-hot-toast";

interface FollowingUser {
  id: number;
  username: string;
  avatarUrl?: string;
  bio?: string;
  isVerified: boolean;
  followersCount: number;
  followingCount: number;
  worksCount: number;
  performancesCount: number;
  createdAt: string;
  followedAt: string;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export default function UserFollowingPage() {
  const params = useParams();
  const router = useRouter();
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<FollowingUser[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [followLoading, setFollowLoading] = useState<number | null>(null);

  const userId = params.id as string;

  useEffect(() => {
    if (userId) {
      fetchFollowing();
    }
  }, [userId, currentPage]);

  const fetchFollowing = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `/api/users/${userId}/following?page=${currentPage}&limit=20`
      );
      if (response.data.success) {
        setUsers(response.data.data.users);
        setPagination(response.data.data.pagination);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error || "获取关注列表失败");
    } finally {
      setLoading(false);
    }
  };

  const handleFollow = async (targetUserId: number, isFollowing: boolean) => {
    if (!currentUser) {
      toast.error("请先登录");
      return;
    }

    try {
      setFollowLoading(targetUserId);

      if (isFollowing) {
        // 取消关注
        const response = await axios.delete(
          `/api/users/${targetUserId}/follow`
        );
        if (response.data.success) {
          setUsers((prev) =>
            prev.map((user) =>
              user.id === targetUserId
                ? { ...user, followersCount: response.data.data.followersCount }
                : user
            )
          );
          toast.success("取消关注成功");
        }
      } else {
        // 关注
        const response = await axios.post(`/api/users/${targetUserId}/follow`);
        if (response.data.success) {
          setUsers((prev) =>
            prev.map((user) =>
              user.id === targetUserId
                ? { ...user, followersCount: response.data.data.followersCount }
                : user
            )
          );
          toast.success("关注成功");
        }
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error || "操作失败");
    } finally {
      setFollowLoading(null);
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
              <h1 className="text-2xl font-bold text-gray-900">关注的人</h1>
              <p className="text-gray-600">
                共关注了 {pagination?.total || 0} 个用户
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 用户列表 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {users.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {users.map((user) => (
              <div
                key={user.id}
                className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start space-x-4">
                  {/* 头像 */}
                  <div className="flex-shrink-0">
                    {user.avatarUrl ? (
                      <img
                        className="h-16 w-16 rounded-full"
                        src={user.avatarUrl}
                        alt={user.username}
                      />
                    ) : (
                      <div className="h-16 w-16 rounded-full bg-primary-100 flex items-center justify-center">
                        <UserIcon className="h-8 w-8 text-primary-600" />
                      </div>
                    )}
                  </div>

                  {/* 用户信息 */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="text-lg font-semibold text-gray-900 truncate">
                        <Link
                          href={`/users/${user.id}`}
                          className="hover:text-primary-600 transition-colors"
                        >
                          {user.username}
                        </Link>
                      </h3>
                      {user.isVerified && (
                        <span className="text-primary-500" title="已验证用户">
                          ✓
                        </span>
                      )}
                    </div>

                    {user.bio && (
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                        {user.bio}
                      </p>
                    )}

                    <div className="flex items-center space-x-4 text-xs text-gray-500 mb-3">
                      <div className="flex items-center">
                        <MusicalNoteIcon className="h-3 w-3 mr-1" />
                        {user.worksCount}
                      </div>
                      <div className="flex items-center">
                        <PlayIcon className="h-3 w-3 mr-1" />
                        {user.performancesCount}
                      </div>
                      <div className="flex items-center">
                        <CalendarIcon className="h-3 w-3 mr-1" />
                        {new Date(user.followedAt).toLocaleDateString()}
                      </div>
                    </div>

                    {/* 关注按钮 */}
                    {currentUser && currentUser.id !== user.id && (
                      <button
                        onClick={() => handleFollow(user.id, false)}
                        disabled={followLoading === user.id}
                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
                      >
                        {followLoading === user.id ? (
                          <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-current mr-1"></div>
                        ) : (
                          <UserPlusIcon className="h-3 w-3 mr-1" />
                        )}
                        关注
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <UserIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              还没有关注任何人
            </h3>
            <p className="text-gray-600 mb-4">
              去发现页面找到感兴趣的用户并关注吧
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

