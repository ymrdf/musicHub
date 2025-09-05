import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import {
  UserIcon,
  MusicalNoteIcon,
  PlayIcon,
  StarIcon,
  LinkIcon,
  CalendarIcon,
} from "@heroicons/react/24/outline";
import { fetchUserProfile } from "@/lib/api-utils";
import UserProfileActions from "@/components/client/UserProfileActions";

// 动态生成元数据
export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const profile = await fetchUserProfile(params.id);

  if (!profile) {
    return {
      title: "用户不存在 - MusicEmit",
      description: "您访问的用户不存在或已被删除",
    };
  }

  return {
    title: `${profile.username} - 用户主页 - MusicEmit`,
    description:
      profile.bio ||
      `${profile.username}的音乐创作主页，查看Ta的原创作品和演奏`,
    keywords: `${profile.username},音乐创作者,原创音乐,音乐人`,
    openGraph: {
      title: `${profile.username} - MusicEmit`,
      description:
        profile.bio ||
        `${profile.username}的音乐创作主页，查看Ta的原创作品和演奏`,
      type: "profile",
      url: `https://musicemit.com/users/${profile.id}`,
      images: [
        {
          url: profile.avatarUrl || "https://musicemit.com/default-avatar.jpg",
          width: 600,
          height: 600,
          alt: profile.username,
        },
      ],
    },
  };
}

export default async function UserProfilePage({
  params,
}: {
  params: { id: string };
}) {
  const profile = await fetchUserProfile(params.id);

  if (!profile) {
    notFound();
  }

  // 结构化数据
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.username,
    description: profile.bio,
    url: `https://musicemit.com/users/${profile.id}`,
    image: profile.avatarUrl,
    sameAs: profile.website ? [profile.website] : [],
    memberOf: {
      "@type": "Organization",
      name: "MusicEmit",
      url: "https://musicemit.com",
    },
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 结构化数据 */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* 用户信息头部 */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
            {/* 头像 */}
            <div className="flex-shrink-0">
              {profile.avatarUrl ? (
                <img
                  src={profile.avatarUrl}
                  alt={profile.username}
                  width={96}
                  height={96}
                  className="rounded-full"
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

            {/* 操作按钮 - 客户端组件 */}
            <div className="flex-shrink-0">
              <UserProfileActions
                userId={profile.id}
                initialIsFollowing={false} // 这个值需要在客户端组件中获取
                initialFollowersCount={profile.followersCount}
              />
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
                  {profile.recentWorks.map(
                    (work: {
                      id: number;
                      title: string;
                      description?: string;
                      starsCount: number;
                      performancesCount: number;
                      createdAt: string;
                    }) => (
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
                    )
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <MusicalNoteIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">该用户还没有发布任何作品</p>
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
                    <UserIcon className="h-4 w-4 mr-2" />
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
