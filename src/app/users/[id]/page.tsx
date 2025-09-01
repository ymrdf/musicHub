"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useAuth } from "@/components/layout/Providers";
import {
  UserIcon,
  MusicalNoteIcon,
  PlayIcon,
  StarIcon,
  HeartIcon,
  UserPlusIcon,
  UserMinusIcon,
  LinkIcon,
  CalendarIcon,
} from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolidIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import axios from "axios";
import { toast } from "react-hot-toast";

interface UserProfile {
  id: number;
  username: string;
  avatarUrl?: string;
  bio?: string;
  website?: string;
  isVerified: boolean;
  followersCount: number;
  followingCount: number;
  worksCount: number;
  performancesCount: number;
  createdAt: string;
  recentWorks: Array<{
    id: number;
    title: string;
    description?: string;
    starsCount: number;
    performancesCount: number;
    createdAt: string;
  }>;
}

export default function UserProfilePage() {
  const params = useParams();
  const { user: currentUser } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [followLoading, setFollowLoading] = useState(false);

  const userId = params.id as string;

  useEffect(() => {
    if (userId) {
      fetchUserProfile();
    }
  }, [userId]);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/users/${userId}`);
      if (response.data.success) {
        setProfile(response.data.data);

        // 检查是否已关注（这里需要实现检查关注状态的 API）
        if (currentUser && currentUser.id !== parseInt(userId)) {
          // TODO: 调用检查关注状态的 API
          setIsFollowing(false);
        }
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error || "获取用户信息失败");
    } finally {
      setLoading(false);
    }
  };

  const handleFollow = async () => {
    if (!currentUser) {
      toast.error("请先登录");
      return;
    }

    try {
      setFollowLoading(true);

      if (isFollowing) {
        // 取消关注
        const response = await axios.delete(`/api/users/${userId}/follow`);
        if (response.data.success) {
          setIsFollowing(false);
          setProfile((prev) =>
            prev
              ? {
                  ...prev,
                  followersCount: response.data.data.followersCount,
                }
              : null
          );
          toast.success("取消关注成功");
        }
      } else {
        // 关注
        const response = await axios.post(`/api/users/${userId}/follow`);
        if (response.data.success) {
          setIsFollowing(true);
          setProfile((prev) =>
            prev
              ? {
                  ...prev,
                  followersCount: response.data.data.followersCount,
                }
              : null
          );
          toast.success("关注成功");
        }
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error || "操作失败");
    } finally {
      setFollowLoading(false);
    }
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

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <UserIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">用户不存在</h2>
          <p className="text-gray-600">您访问的用户不存在或已被删除</p>
          <Link
            href="/"
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
          >
            返回首页
          </Link>
        </div>
      </div>
    );
  }

  const isOwnProfile = currentUser?.id === profile.id;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 用户信息头部 */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
            {/* 头像 */}
            <div className="flex-shrink-0">
              {profile.avatarUrl ? (
                <img
                  className="h-24 w-24 rounded-full"
                  src={profile.avatarUrl}
                  alt={profile.username}
                />
              ) : (
                <div className="h-24 w-24 rounded-full bg-primary-100 flex items-center justify-center">
                  <UserIcon className="h-12 w-12 text-primary-600" />
                </div>
              )}
            </div>

            {/* 用户信息 */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-2">
                <h1 className="text-2xl font-bold text-gray-900 truncate">
                  {profile.username}
                </h1>
                {profile.isVerified && (
                  <span className="text-primary-500" title="已验证用户">
                    ✓
                  </span>
                )}
              </div>

              {profile.bio && (
                <p className="text-gray-600 mb-3">{profile.bio}</p>
              )}

              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                {profile.website && (
                  <a
                    href={profile.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center hover:text-primary-600"
                  >
                    <LinkIcon className="h-4 w-4 mr-1" />
                    网站
                  </a>
                )}
                <div className="flex items-center">
                  <CalendarIcon className="h-4 w-4 mr-1" />
                  加入于 {new Date(profile.createdAt).toLocaleDateString()}
                </div>
              </div>

              {/* 统计数据 */}
              <div className="flex space-x-6 mt-4">
                <div className="text-center">
                  <div className="text-xl font-bold text-gray-900">
                    {profile.worksCount}
                  </div>
                  <div className="text-sm text-gray-600">作品</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-gray-900">
                    {profile.performancesCount}
                  </div>
                  <div className="text-sm text-gray-600">演奏</div>
                </div>
                <Link
                  href={`/users/${profile.id}/followers`}
                  className="text-center hover:opacity-80 transition-opacity cursor-pointer"
                >
                  <div className="text-xl font-bold text-gray-900">
                    {profile.followersCount}
                  </div>
                  <div className="text-sm text-gray-600">粉丝</div>
                </Link>
                <Link
                  href={`/users/${profile.id}/following`}
                  className="text-center hover:opacity-80 transition-opacity cursor-pointer"
                >
                  <div className="text-xl font-bold text-gray-900">
                    {profile.followingCount}
                  </div>
                  <div className="text-sm text-gray-600">关注</div>
                </Link>
              </div>
            </div>

            {/* 操作按钮 */}
            <div className="flex-shrink-0">
              {isOwnProfile ? (
                <Link
                  href="/settings/profile"
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  编辑资料
                </Link>
              ) : currentUser ? (
                <button
                  onClick={handleFollow}
                  disabled={followLoading}
                  className={`inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 ${
                    isFollowing
                      ? "text-gray-700 bg-gray-200 hover:bg-gray-300"
                      : "text-white bg-primary-600 hover:bg-primary-700"
                  }`}
                >
                  {followLoading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                  ) : isFollowing ? (
                    <UserMinusIcon className="h-4 w-4 mr-2" />
                  ) : (
                    <UserPlusIcon className="h-4 w-4 mr-2" />
                  )}
                  {isFollowing ? "取消关注" : "关注"}
                </button>
              ) : (
                <Link
                  href="/auth/login"
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  <UserPlusIcon className="h-4 w-4 mr-2" />
                  关注
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 用户内容 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 主要内容 */}
          <div className="lg:col-span-2">
            {/* 最近作品 */}
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                  <MusicalNoteIcon className="h-5 w-5 mr-2" />
                  最近作品
                </h2>
                {profile.worksCount > 0 && (
                  <Link
                    href={`/users/${profile.id}/works`}
                    className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                  >
                    查看全部 ({profile.worksCount})
                  </Link>
                )}
              </div>

              {profile.recentWorks.length > 0 ? (
                <div className="space-y-4">
                  {profile.recentWorks.map((work) => (
                    <div
                      key={work.id}
                      className="border border-gray-200 rounded-lg p-4 hover:border-primary-300 transition-colors duration-200"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900 mb-1">
                            <Link
                              href={`/works/${work.id}`}
                              className="hover:text-primary-600"
                            >
                              {work.title}
                            </Link>
                          </h3>
                          {work.description && (
                            <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                              {work.description}
                            </p>
                          )}
                          <div className="flex items-center space-x-4 text-xs text-gray-500">
                            <div className="flex items-center">
                              <StarIcon className="h-3 w-3 mr-1" />
                              {work.starsCount}
                            </div>
                            <div className="flex items-center">
                              <PlayIcon className="h-3 w-3 mr-1" />
                              {work.performancesCount}
                            </div>
                            <span>
                              {new Date(work.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <MusicalNoteIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">
                    {isOwnProfile
                      ? "您还没有发布任何作品"
                      : "该用户还没有发布任何作品"}
                  </p>
                  {isOwnProfile && (
                    <Link
                      href="/works/new"
                      className="mt-2 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
                    >
                      创建第一个作品
                    </Link>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* 侧边栏 */}
          <div className="lg:col-span-1">
            {/* 成就/徽章区域 */}
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">成就</h3>
              <div className="space-y-3">
                {profile.isVerified && (
                  <div className="flex items-center space-x-2">
                    <span className="text-primary-500">✓</span>
                    <span className="text-sm text-gray-700">已验证用户</span>
                  </div>
                )}
                {profile.worksCount >= 10 && (
                  <div className="flex items-center space-x-2">
                    <span className="text-yellow-500">🏆</span>
                    <span className="text-sm text-gray-700">作品达人</span>
                  </div>
                )}
                {profile.followersCount >= 100 && (
                  <div className="flex items-center space-x-2">
                    <span className="text-pink-500">💫</span>
                    <span className="text-sm text-gray-700">人气用户</span>
                  </div>
                )}
              </div>
            </div>

            {/* 快速链接 */}
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                快速链接
              </h3>
              <div className="space-y-3">
                <Link
                  href={`/users/${profile.id}/starred-works`}
                  className="flex items-center justify-between text-sm text-gray-600 hover:text-primary-600 transition-colors"
                >
                  <span className="flex items-center">
                    <StarIcon className="h-4 w-4 mr-2" />
                    收藏的作品
                  </span>
                  <span className="text-gray-400">→</span>
                </Link>
                <Link
                  href={`/users/${profile.id}/following`}
                  className="flex items-center justify-between text-sm text-gray-600 hover:text-primary-600 transition-colors"
                >
                  <span className="flex items-center">
                    <UserPlusIcon className="h-4 w-4 mr-2" />
                    关注的人
                  </span>
                  <span className="text-gray-400">→</span>
                </Link>
                <Link
                  href={`/users/${profile.id}/followers`}
                  className="flex items-center justify-between text-sm text-gray-600 hover:text-primary-600 transition-colors"
                >
                  <span className="flex items-center">
                    <UserIcon className="h-4 w-4 mr-2" />
                    我的粉丝
                  </span>
                  <span className="text-gray-400">→</span>
                </Link>
              </div>
            </div>

            {/* 活动统计 */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                活动统计
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">总作品数</span>
                  <span className="font-medium">{profile.worksCount}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">总演奏数</span>
                  <span className="font-medium">
                    {profile.performancesCount}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">粉丝数</span>
                  <span className="font-medium">{profile.followersCount}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">关注数</span>
                  <span className="font-medium">{profile.followingCount}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
