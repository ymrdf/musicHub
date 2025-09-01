"use client";

import { useState } from "react";
import Link from "next/link";
import {
  MagnifyingGlassIcon,
  MusicalNoteIcon,
  UserIcon,
  PlayIcon,
  ArrowRightIcon,
} from "@heroicons/react/24/outline";

export default function SearchDemoPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      const params = new URLSearchParams();
      params.set("q", searchQuery);
      window.location.href = `/search?${params.toString()}`;
    }
  };

  const demoQueries = [
    { query: "钢琴", description: "搜索钢琴相关的作品和演奏" },
    { query: "流行", description: "搜索流行音乐作品" },
    { query: "小提琴", description: "搜索小提琴演奏" },
    { query: "原创", description: "搜索原创音乐作品" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-music-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* 标题 */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            搜索功能演示
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            体验MusicHub强大的搜索功能，快速找到你需要的音乐作品、创作者和演奏
          </p>
        </div>

        {/* 搜索框 */}
        <div className="max-w-2xl mx-auto mb-12">
          <form onSubmit={handleSearch} className="relative">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-6 w-6 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="搜索作品、用户、演奏..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-12 pr-4 py-4 text-lg border border-gray-300 rounded-xl shadow-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
              <button
                type="submit"
                className="absolute inset-y-0 right-0 px-6 bg-primary-600 text-white rounded-r-xl hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200"
              >
                搜索
              </button>
            </div>
          </form>
        </div>

        {/* 功能特性 */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-center w-12 h-12 bg-primary-100 rounded-lg mb-4">
              <MusicalNoteIcon className="h-6 w-6 text-primary-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              搜索作品
            </h3>
            <p className="text-gray-600">
              通过标题、描述搜索原创音乐作品，支持PDF乐谱和MIDI文件
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-center w-12 h-12 bg-music-100 rounded-lg mb-4">
              <UserIcon className="h-6 w-6 text-music-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              搜索用户
            </h3>
            <p className="text-gray-600">
              查找音乐创作者，查看他们的作品和演奏
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg mb-4">
              <PlayIcon className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              搜索演奏
            </h3>
            <p className="text-gray-600">
              发现优秀的演奏和演唱作品，体验不同的演绎风格
            </p>
          </div>
        </div>

        {/* 示例搜索 */}
        <div className="bg-white rounded-xl p-8 shadow-lg">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
            试试这些搜索
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {demoQueries.map((demo, index) => (
              <button
                key={index}
                onClick={() => {
                  setSearchQuery(demo.query);
                  const params = new URLSearchParams();
                  params.set("q", demo.query);
                  window.location.href = `/search?${params.toString()}`;
                }}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-primary-300 transition-colors duration-200"
              >
                <div className="text-left">
                  <div className="font-medium text-gray-900">{demo.query}</div>
                  <div className="text-sm text-gray-500">
                    {demo.description}
                  </div>
                </div>
                <ArrowRightIcon className="h-5 w-5 text-gray-400" />
              </button>
            ))}
          </div>
        </div>

        {/* 快速链接 */}
        <div className="mt-12 text-center">
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/search?q=钢琴&type=works"
              className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors duration-200"
            >
              <MusicalNoteIcon className="h-4 w-4 mr-2" />
              钢琴作品
            </Link>
            <Link
              href="/search?q=流行&type=performances"
              className="inline-flex items-center px-4 py-2 bg-music-600 text-white rounded-lg hover:bg-music-700 transition-colors duration-200"
            >
              <PlayIcon className="h-4 w-4 mr-2" />
              流行演奏
            </Link>
            <Link
              href="/search?q=原创&type=all"
              className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
            >
              <MagnifyingGlassIcon className="h-4 w-4 mr-2" />
              原创音乐
            </Link>
          </div>
        </div>

        {/* 返回首页 */}
        <div className="mt-12 text-center">
          <Link
            href="/"
            className="inline-flex items-center text-primary-600 hover:text-primary-700 transition-colors duration-200"
          >
            <ArrowRightIcon className="h-4 w-4 mr-2 rotate-180" />
            返回首页
          </Link>
        </div>
      </div>
    </div>
  );
}
