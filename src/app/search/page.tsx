"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  MagnifyingGlassIcon,
  MusicalNoteIcon,
  UserIcon,
  PlayIcon,
  StarIcon,
  EyeIcon,
  HeartIcon,
  CalendarIcon,
} from "@heroicons/react/24/outline";
import type { ApiResponse } from "@/types";

interface SearchResult {
  query: string;
  type: string;
  results: {
    works?: {
      items: any[];
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
    users?: {
      items: any[];
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
    performances?: {
      items: any[];
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  };
}

export default function SearchPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [searchType, setSearchType] = useState(
    searchParams.get("type") || "all"
  );
  const [results, setResults] = useState<SearchResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const searchTypes = [
    { value: "all", label: "All", icon: MagnifyingGlassIcon },
    { value: "works", label: "Works", icon: MusicalNoteIcon },
    { value: "users", label: "Users", icon: UserIcon },
    { value: "performances", label: "Performances", icon: PlayIcon },
  ];

  const performSearch = async (query: string, type: string) => {
    if (!query.trim()) return;

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `/api/search?q=${encodeURIComponent(query)}&type=${type}`
      );
      const data: ApiResponse<SearchResult> = await response.json();

      if (data.success && data.data) {
        setResults(data.data);
      } else {
        setError(data.error || "Search failed");
      }
    } catch (err) {
      setError("Search request failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const query = searchParams.get("q");
    const type = searchParams.get("type") || "all";

    if (query) {
      setSearchQuery(query);
      setSearchType(type);
      performSearch(query, type);
    }
  }, [searchParams]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      const params = new URLSearchParams();
      params.set("q", searchQuery);
      if (searchType !== "all") {
        params.set("type", searchType);
      }
      router.push(`/search?${params.toString()}`);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US");
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Form */}
        <div className="mb-8">
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Search Input */}
              <div className="flex-1">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search works, users, performances..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
                  />
                </div>
              </div>

              {/* Search Type Selection */}
              <div className="flex gap-2">
                {searchTypes.map((type) => {
                  const Icon = type.icon;
                  return (
                    <button
                      key={type.value}
                      type="button"
                      onClick={() => setSearchType(type.value)}
                      className={`flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium transition-colors duration-200 ${
                        searchType === type.value
                          ? "bg-primary-600 text-white"
                          : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span className="hidden sm:inline">{type.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Search Button */}
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                {loading ? "Searching..." : "Search"}
              </button>
            </div>
          </form>
        </div>

        {/* Error Message */}
        {error && (
          <div className="max-w-2xl mx-auto mb-8">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800">{error}</p>
            </div>
          </div>
        )}

        {/* Search Results */}
        {results && (
          <div className="space-y-8">
            {/* Works Search Results */}
            {results.results.works &&
              results.results.works.items.length > 0 && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    Works ({results.results.works.total})
                  </h2>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {results.results.works.items.map((work) => (
                      <Link
                        key={work.id}
                        href={`/works/${work.id}`}
                        className="block bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200"
                      >
                        <div className="p-6">
                          <h3 className="text-lg font-medium text-gray-900 mb-2 line-clamp-2">
                            {work.title}
                          </h3>
                          {work.description && (
                            <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                              {work.description}
                            </p>
                          )}
                          <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                            <div className="flex items-center gap-1">
                              <StarIcon className="h-4 w-4" />
                              <span>{work.starsCount}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <PlayIcon className="h-4 w-4" />
                              <span>{work.performancesCount}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <EyeIcon className="h-4 w-4" />
                              <span>{work.viewsCount}</span>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              {work.user.avatarUrl ? (
                                <img
                                  src={work.user.avatarUrl}
                                  alt={work.user.username}
                                  className="h-6 w-6 rounded-full"
                                />
                              ) : (
                                <div className="h-6 w-6 rounded-full bg-primary-600 flex items-center justify-center">
                                  <UserIcon className="h-3 w-3 text-white" />
                                </div>
                              )}
                              <span className="text-sm text-gray-700">
                                {work.user.username}
                              </span>
                            </div>
                            <div className="flex items-center gap-1 text-xs text-gray-500">
                              <CalendarIcon className="h-3 w-3" />
                              <span>{formatDate(work.createdAt)}</span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

            {/* Users Search Results */}
            {results.results.users &&
              results.results.users.items.length > 0 && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    Users ({results.results.users.total})
                  </h2>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {results.results.users.items.map((user) => (
                      <Link
                        key={user.id}
                        href={`/users/${user.id}`}
                        className="block bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200"
                      >
                        <div className="p-6">
                          <div className="flex items-center gap-4 mb-4">
                            {user.avatarUrl ? (
                              <img
                                src={user.avatarUrl}
                                alt={user.username}
                                className="h-12 w-12 rounded-full"
                              />
                            ) : (
                              <div className="h-12 w-12 rounded-full bg-primary-600 flex items-center justify-center">
                                <UserIcon className="h-6 w-6 text-white" />
                              </div>
                            )}
                            <div>
                              <h3 className="text-lg font-medium text-gray-900">
                                {user.username}
                              </h3>
                              {user.isVerified && (
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                  Verified
                                </span>
                              )}
                            </div>
                          </div>
                          {user.bio && (
                            <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                              {user.bio}
                            </p>
                          )}
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <div className="flex items-center gap-1">
                              <UserIcon className="h-4 w-4" />
                              <span>{user.followersCount} followers</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <MusicalNoteIcon className="h-4 w-4" />
                              <span>{user.worksCount} works</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <PlayIcon className="h-4 w-4" />
                              <span>{user.performancesCount} performances</span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

            {/* Performances Search Results */}
            {results.results.performances &&
              results.results.performances.items.length > 0 && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    Performances ({results.results.performances.total})
                  </h2>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {results.results.performances.items.map((performance) => (
                      <Link
                        key={performance.id}
                        href={`/performances/${performance.id}`}
                        className="block bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200"
                      >
                        <div className="p-6">
                          <h3 className="text-lg font-medium text-gray-900 mb-2 line-clamp-2">
                            {performance.title}
                          </h3>
                          {performance.description && (
                            <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                              {performance.description}
                            </p>
                          )}
                          <div className="mb-4">
                            <p className="text-sm text-gray-500 mb-2">
                              Original Work: {performance.work.title}
                            </p>
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                              <span className="px-2 py-1 bg-gray-100 rounded">
                                {performance.type === "vocal"
                                  ? "Vocal"
                                  : "Instrumental"}
                              </span>
                              {performance.instrument && (
                                <span className="px-2 py-1 bg-gray-100 rounded">
                                  {performance.instrument}
                                </span>
                              )}
                              {performance.duration && (
                                <span className="px-2 py-1 bg-gray-100 rounded">
                                  {formatDuration(performance.duration)}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                            <div className="flex items-center gap-1">
                              <HeartIcon className="h-4 w-4" />
                              <span>{performance.likesCount}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <PlayIcon className="h-4 w-4" />
                              <span>{performance.playsCount}</span>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              {performance.user.avatarUrl ? (
                                <img
                                  src={performance.user.avatarUrl}
                                  alt={performance.user.username}
                                  className="h-6 w-6 rounded-full"
                                />
                              ) : (
                                <div className="h-6 w-6 rounded-full bg-primary-600 flex items-center justify-center">
                                  <UserIcon className="h-3 w-3 text-white" />
                                </div>
                              )}
                              <span className="text-sm text-gray-700">
                                {performance.user.username}
                              </span>
                            </div>
                            <div className="flex items-center gap-1 text-xs text-gray-500">
                              <CalendarIcon className="h-3 w-3" />
                              <span>{formatDate(performance.createdAt)}</span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

            {/* No Search Results */}
            {Object.keys(results.results).length === 0 && !loading && (
              <div className="text-center py-12">
                <MagnifyingGlassIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No results found
                </h3>
                <p className="text-gray-600">
                  Try using different keywords or search types
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
