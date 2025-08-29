"use client";

import Link from "next/link";
import {
  MusicalNoteIcon,
  StarIcon,
  PlayIcon,
  UserGroupIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";

export default function HomePage() {
  const stats = [
    { name: "注册用户", value: "10,000+", icon: UserGroupIcon },
    { name: "原创作品", value: "2,500+", icon: MusicalNoteIcon },
    { name: "演奏作品", value: "8,000+", icon: PlayIcon },
    { name: "作品收藏", value: "50,000+", icon: StarIcon },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-music-600 py-20">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 font-music">
            欢迎来到 MusicHub
          </h1>
          <p className="text-xl md:text-2xl text-white opacity-90 mb-8 max-w-3xl mx-auto">
            连接全球音乐创作者的原创音乐分享平台
          </p>
          <p className="text-lg text-white opacity-80 mb-10 max-w-2xl mx-auto">
            在这里分享你的原创作品，发现优秀音乐，与志同道合的音乐人协作创作，让音乐的力量传播到世界每个角落。
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/auth/register"
              className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-primary-700 bg-white hover:bg-gray-50 transition-colors duration-200"
            >
              <SparklesIcon className="h-5 w-5 mr-2" />
              立即加入
            </Link>
            <Link
              href="/discover"
              className="inline-flex items-center px-8 py-3 border-2 border-white text-base font-medium rounded-md text-white hover:bg-white hover:text-primary-700 transition-colors duration-200"
            >
              <MusicalNoteIcon className="h-5 w-5 mr-2" />
              探索音乐
            </Link>
          </div>
        </div>
      </section>

      {/* 统计数据 */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.name} className="text-center">
                  <div className="flex justify-center mb-4">
                    <Icon className="h-8 w-8 text-primary-600" />
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-2">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-600">{stat.name}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 功能介绍 */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              为音乐创作者量身打造
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              MusicHub
              提供完整的音乐创作、分享和协作解决方案，让您的音乐才华得到最大的发挥。
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-primary-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <MusicalNoteIcon className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                原创作品分享
              </h3>
              <p className="text-gray-600">
                上传您的 PDF 乐谱和 MIDI 文件，让更多人欣赏您的创作
              </p>
            </div>

            <div className="text-center">
              <div className="bg-primary-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <PlayIcon className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                演奏演唱展示
              </h3>
              <p className="text-gray-600">
                录制并分享您的演奏和演唱，与其他音乐人交流切磋
              </p>
            </div>

            <div className="text-center">
              <div className="bg-primary-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <UserGroupIcon className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                协作创作
              </h3>
              <p className="text-gray-600">
                与世界各地的音乐人合作，共同创作出更优秀的作品
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-4">
            准备好开始您的音乐之旅了吗？
          </h2>
          <p className="text-xl text-white opacity-90 mb-8">
            加入 MusicHub，与全球音乐创作者一起，创造美妙的音乐世界。
          </p>
          <Link
            href="/auth/register"
            className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-primary-600 bg-white hover:bg-gray-50 transition-colors duration-200"
          >
            免费注册
          </Link>
        </div>
      </section>
    </div>
  );
}
