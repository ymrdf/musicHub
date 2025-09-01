"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  MagnifyingGlassIcon,
  MusicalNoteIcon,
  UserIcon,
  PlayIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";
import type { ApiResponse } from "@/types";

interface SearchSuggestion {
  id: number;
  type: "work" | "user" | "performance";
  title: string;
  subtitle?: string;
  url: string;
  icon: any;
}

interface SearchSuggestionsProps {
  query: string;
  isVisible: boolean;
  onSelect: (suggestion: SearchSuggestion) => void;
  onClose: () => void;
}

export function SearchSuggestions({
  query,
  isVisible,
  onSelect,
  onClose,
}: SearchSuggestionsProps) {
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  // 获取最近搜索
  useEffect(() => {
    const recent = localStorage.getItem("recentSearches");
    if (recent) {
      setRecentSearches(JSON.parse(recent));
    }
  }, []);

  // 搜索建议
  useEffect(() => {
    if (!query.trim() || !isVisible) {
      setSuggestions([]);
      return;
    }

    const searchSuggestions = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `/api/search?q=${encodeURIComponent(query)}&type=all&limit=5`
        );
        const data: ApiResponse<any> = await response.json();

        if (data.success) {
          const newSuggestions: SearchSuggestion[] = [];

          // 添加作品建议
          if (data.data.results.works?.items) {
            data.data.results.works.items.forEach((work: any) => {
              newSuggestions.push({
                id: work.id,
                type: "work",
                title: work.title,
                subtitle: `by ${work.user.username}`,
                url: `/works/${work.id}`,
                icon: MusicalNoteIcon,
              });
            });
          }

          // 添加用户建议
          if (data.data.results.users?.items) {
            data.data.results.users.items.forEach((user: any) => {
              newSuggestions.push({
                id: user.id,
                type: "user",
                title: user.username,
                subtitle: user.bio ? user.bio.substring(0, 50) + "..." : "",
                url: `/users/${user.id}`,
                icon: UserIcon,
              });
            });
          }

          // 添加演奏建议
          if (data.data.results.performances?.items) {
            data.data.results.performances.items.forEach((performance: any) => {
              newSuggestions.push({
                id: performance.id,
                type: "performance",
                title: performance.title,
                subtitle: `by ${performance.user.username}`,
                url: `/performances/${performance.id}`,
                icon: PlayIcon,
              });
            });
          }

          setSuggestions(newSuggestions.slice(0, 8)); // 限制最多8个建议
        }
      } catch (error) {
        console.error("获取搜索建议失败:", error);
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(searchSuggestions, 300);
    return () => clearTimeout(debounceTimer);
  }, [query, isVisible]);

  // 点击外部关闭
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isVisible) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isVisible, onClose]);

  // 保存搜索历史
  const saveSearchHistory = (searchTerm: string) => {
    const recent = JSON.parse(localStorage.getItem("recentSearches") || "[]");
    const newRecent = [
      searchTerm,
      ...recent.filter((s: string) => s !== searchTerm),
    ].slice(0, 5);
    localStorage.setItem("recentSearches", JSON.stringify(newRecent));
    setRecentSearches(newRecent);
  };

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    saveSearchHistory(query);
    onSelect(suggestion);
  };

  const handleRecentSearchClick = (searchTerm: string) => {
    saveSearchHistory(searchTerm);
    onSelect({
      id: 0,
      type: "work",
      title: searchTerm,
      url: `/search?q=${encodeURIComponent(searchTerm)}`,
      icon: MagnifyingGlassIcon,
    });
  };

  if (!isVisible) return null;

  return (
    <div
      ref={containerRef}
      className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto"
    >
      {loading && (
        <div className="p-4 text-center text-gray-500">
          <div className="loading-spinner mx-auto mb-2"></div>
          搜索中...
        </div>
      )}

      {!loading && suggestions.length > 0 && (
        <div className="py-2">
          <div className="px-4 py-2 text-xs font-medium text-gray-500 uppercase tracking-wide">
            搜索结果
          </div>
          {suggestions.map((suggestion) => {
            const Icon = suggestion.icon;
            return (
              <Link
                key={`${suggestion.type}-${suggestion.id}`}
                href={suggestion.url}
                onClick={() => handleSuggestionClick(suggestion)}
                className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors duration-150"
              >
                <Icon className="h-5 w-5 text-gray-400" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-900 truncate">
                    {suggestion.title}
                  </div>
                  {suggestion.subtitle && (
                    <div className="text-xs text-gray-500 truncate">
                      {suggestion.subtitle}
                    </div>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      )}

      {!loading && suggestions.length === 0 && query.trim() && (
        <div className="p-4 text-center text-gray-500">
          <MagnifyingGlassIcon className="h-8 w-8 mx-auto mb-2 text-gray-300" />
          <p>未找到相关结果</p>
          <p className="text-sm">尝试使用不同的关键词</p>
        </div>
      )}

      {!loading && recentSearches.length > 0 && (
        <div className="border-t border-gray-100 py-2">
          <div className="px-4 py-2 text-xs font-medium text-gray-500 uppercase tracking-wide">
            最近搜索
          </div>
          {recentSearches.map((searchTerm, index) => (
            <button
              key={index}
              onClick={() => handleRecentSearchClick(searchTerm)}
              className="flex items-center gap-3 px-4 py-3 w-full text-left hover:bg-gray-50 transition-colors duration-150"
            >
              <ClockIcon className="h-5 w-5 text-gray-400" />
              <span className="text-sm text-gray-700">{searchTerm}</span>
            </button>
          ))}
        </div>
      )}

      {!loading && query.trim() && (
        <div className="border-t border-gray-100 py-2">
          <Link
            href={`/search?q=${encodeURIComponent(query)}`}
            onClick={() => saveSearchHistory(query)}
            className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors duration-150"
          >
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            <span className="text-sm text-gray-700">
              搜索 "{query}" 的所有结果
            </span>
          </Link>
        </div>
      )}
    </div>
  );
}
