"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "./Providers";
import { SearchSuggestions } from "../SearchSuggestions";
import {
  Bars3Icon,
  XMarkIcon,
  MagnifyingGlassIcon,
  UserIcon,
  MusicalNoteIcon,
  HomeIcon,
  FireIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";

export function Header() {
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  const navigation = [
    { name: "首页", href: "/", icon: HomeIcon, current: false },
    {
      name: "发现音乐",
      href: "/discover",
      icon: MusicalNoteIcon,
      current: false,
    },
    {
      name: "演奏列表",
      href: "/performances",
      icon: MusicalNoteIcon,
      current: false,
    },
    { name: "热榜", href: "/trending", icon: FireIcon, current: false },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // 跳转到搜索页面
      const params = new URLSearchParams();
      params.set("q", searchQuery);
      window.location.href = `/search?${params.toString()}`;
    }
  };

  const handleSuggestionSelect = (suggestion: any) => {
    setShowSuggestions(false);
    setSearchQuery("");
    window.location.href = suggestion.url;
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <MusicalNoteIcon className="h-8 w-8 text-primary-600" />
              <span className="text-xl font-bold text-gray-900 font-music">
                MusicEmit
              </span>
            </Link>
          </div>

          {/* 导航菜单 - 桌面版 */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className="flex items-center space-x-1 text-gray-600 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* 搜索框 */}
          <div className="hidden md:flex flex-1 max-w-lg mx-8">
            <form onSubmit={handleSearch} className="w-full">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="搜索作品、用户..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setShowSuggestions(true)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                />
                <SearchSuggestions
                  query={searchQuery}
                  isVisible={showSuggestions}
                  onSelect={handleSuggestionSelect}
                  onClose={() => setShowSuggestions(false)}
                />
              </div>
            </form>
          </div>

          {/* 用户菜单 */}
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                {/* 创建按钮 */}
                <Link
                  href="/works/new"
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200"
                >
                  <PlusIcon className="h-4 w-4 mr-1" />
                  创建
                </Link>

                {/* 用户头像和菜单 */}
                <Link href={`/users/${user.id}`} className="relative">
                  <div className="flex items-center space-x-2 text-sm rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 hover:bg-gray-50 p-2 transition-colors duration-200">
                    {user.avatarUrl ? (
                      <img
                        className="h-8 w-8 rounded-full"
                        src={user.avatarUrl}
                        alt={user.username}
                      />
                    ) : (
                      <div className="h-8 w-8 rounded-full bg-primary-600 flex items-center justify-center">
                        <UserIcon className="h-5 w-5 text-white" />
                      </div>
                    )}
                    <span className="hidden md:block text-gray-700 font-medium">
                      {user.username}
                    </span>
                  </div>
                </Link>

                <button
                  onClick={logout}
                  className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                >
                  退出
                </button>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  href="/auth/login"
                  className="text-gray-600 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                >
                  登录
                </Link>
                <Link
                  href="/auth/register"
                  className="bg-primary-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200"
                >
                  注册
                </Link>
              </div>
            )}

            {/* 移动端菜单按钮 */}
            <button
              type="button"
              className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <span className="sr-only">打开主菜单</span>
              {isMobileMenuOpen ? (
                <XMarkIcon className="block h-6 w-6" />
              ) : (
                <Bars3Icon className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* 移动端菜单 */}
      {isMobileMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-gray-200">
            {/* 移动端搜索 */}
            <div className="px-3 py-2">
              <form onSubmit={handleSearch}>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="搜索作品、用户..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 text-sm"
                  />
                </div>
              </form>
            </div>

            {/* 移动端导航 */}
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className="flex items-center space-x-2 text-gray-600 hover:text-primary-600 hover:bg-gray-50 block px-3 py-2 rounded-md text-base font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
}
