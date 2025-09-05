"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  MusicalNoteIcon,
  UserCircleIcon,
  StarIcon,
  PlayIcon,
  EyeIcon,
  ChatBubbleLeftIcon,
  DocumentArrowDownIcon,
  CalendarIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  AdjustmentsHorizontalIcon,
} from "@heroicons/react/24/outline";
import { StarIcon as StarSolidIcon } from "@heroicons/react/24/solid";
import { useAuth } from "@/components/layout/Providers";
import axios from "axios";
import { toast } from "react-hot-toast";

interface Work {
  id: number;
  title: string;
  description?: string;
  pdfFilePath?: string;
  midiFilePath?: string;
  starsCount: number;
  performancesCount: number;
  commentsCount: number;
  viewsCount: number;
  createdAt: string;
  user: {
    id: number;
    username: string;
    avatarUrl?: string;
    isVerified: boolean;
  };
  genre?: {
    id: number;
    name: string;
  };
  instrument?: {
    id: number;
    name: string;
  };
  purpose?: {
    id: number;
    name: string;
  };
  isStarred?: boolean;
}

interface Category {
  id: number;
  name: string;
}

export default function WorksPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user: currentUser } = useAuth();

  const [works, setWorks] = useState<Work[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Initialize filter state from URL parameters
  const [filters, setFilters] = useState({
    search: searchParams.get("search") || "",
    genreId: searchParams.get("genreId") || "",
    instrumentId: searchParams.get("instrumentId") || "",
    sortBy: searchParams.get("sortBy") || "createdAt",
    sortOrder: searchParams.get("sortOrder") || "desc",
  });

  const [categories, setCategories] = useState<{
    genres: Category[];
    instruments: Category[];
    purposes: Category[];
  }>({
    genres: [],
    instruments: [],
    purposes: [],
  });

  useEffect(() => {
    fetchCategories();
    fetchWorks();
  }, [filters, currentPage]);

  const fetchCategories = async () => {
    try {
      const response = await axios.get("/api/categories");
      if (response.data.success) {
        setCategories(response.data.data);
      } else {
        console.error("Failed to fetch categories: API returned error");
        // Ensure categories maintain initial state
        setCategories({
          genres: [],
          instruments: [],
          purposes: [],
        });
      }
    } catch (error) {
      console.error("Failed to fetch categories:", error);
      // 确保 categories 保持初始状态
      setCategories({
        genres: [],
        instruments: [],
        purposes: [],
      });
    }
  };

  const fetchWorks = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      params.append("page", currentPage.toString());
      params.append("limit", "20");

      if (filters.search) params.append("search", filters.search);
      if (filters.genreId) params.append("genreId", filters.genreId);
      if (filters.instrumentId)
        params.append("instrumentId", filters.instrumentId);
      params.append("sortBy", filters.sortBy);
      params.append("sortOrder", filters.sortOrder);

      const response = await axios.get(`/api/works?${params.toString()}`);

      if (response.data.success) {
        setWorks(response.data.data.items);
        setTotal(response.data.data.total);
        setTotalPages(response.data.data.totalPages);
      }
    } catch (error: any) {
      setError(error.response?.data?.error || "Failed to fetch works");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchWorks();
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const handleStar = async (work: Work) => {
    if (!currentUser) {
      toast.error("Please login to star works");
      return;
    }

    try {
      if (work.isStarred) {
        const response = await axios.delete(`/api/works/${work.id}/star`);
        if (response.data.success) {
          setWorks((prev) =>
            prev.map((w) =>
              w.id === work.id
                ? {
                    ...w,
                    isStarred: false,
                    starsCount: response.data.data.starsCount,
                  }
                : w
            )
          );
          toast.success("Unstarred successfully");
        }
      } else {
        const response = await axios.post(`/api/works/${work.id}/star`);
        if (response.data.success) {
          setWorks((prev) =>
            prev.map((w) =>
              w.id === work.id
                ? {
                    ...w,
                    isStarred: true,
                    starsCount: response.data.data.starsCount,
                  }
                : w
            )
          );
          toast.success("Starred successfully");
        }
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Operation failed");
    }
  };

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(new Date(dateString));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-2">
            <MusicalNoteIcon className="h-8 w-8 text-primary-600" />
            <h1 className="text-3xl font-bold text-gray-900">Original Works</h1>
          </div>
          <p className="text-gray-600">
            Discover and explore original music compositions from talented
            creators
          </p>
        </div>

        {/* Search and filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <form onSubmit={handleSearch} className="mb-6">
            <div className="flex gap-4">
              <div className="flex-1">
                <div className="relative">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search works..."
                    value={filters.search}
                    onChange={(e) =>
                      handleFilterChange("search", e.target.value)
                    }
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="px-6 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Search
              </button>
            </div>
          </form>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Genre
              </label>
              <select
                value={filters.genreId}
                onChange={(e) => handleFilterChange("genreId", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="">All Genres</option>
                {categories.genres?.map((genre) => (
                  <option key={genre.id} value={genre.id}>
                    {genre.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Instrument
              </label>
              <select
                value={filters.instrumentId}
                onChange={(e) =>
                  handleFilterChange("instrumentId", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="">All Instruments</option>
                {categories.instruments?.map((instrument) => (
                  <option key={instrument.id} value={instrument.id}>
                    {instrument.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sort By
              </label>
              <div className="flex gap-2">
                <select
                  value={filters.sortBy}
                  onChange={(e) => handleFilterChange("sortBy", e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="createdAt">Date Created</option>
                  <option value="starsCount">Stars</option>
                  <option value="performancesCount">Performances</option>
                  <option value="viewsCount">Views</option>
                  <option value="title">Title</option>
                </select>
                <select
                  value={filters.sortOrder}
                  onChange={(e) =>
                    handleFilterChange("sortOrder", e.target.value)
                  }
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="desc">Desc</option>
                  <option value="asc">Asc</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={fetchWorks}
              className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Retry
            </button>
          </div>
        ) : works.length === 0 ? (
          <div className="text-center py-12">
            <MusicalNoteIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No Works Found
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Try adjusting your search criteria or filters
            </p>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <p className="text-sm text-gray-600">
                Showing {works.length} of {total} works
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {works.map((work) => (
                <div
                  key={work.id}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200"
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <Link
                          href={`/users/${work.user.id}`}
                          className="flex items-center space-x-2 hover:opacity-80 transition-opacity duration-200"
                        >
                          {work.user.avatarUrl ? (
                            <img
                              className="h-8 w-8 rounded-full"
                              src={work.user.avatarUrl}
                              alt={work.user.username}
                            />
                          ) : (
                            <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center">
                              <UserCircleIcon className="h-5 w-5 text-gray-600" />
                            </div>
                          )}
                          <span className="text-sm font-medium text-gray-900">
                            {work.user.username}
                          </span>
                          {work.user.isVerified && (
                            <span className="text-blue-500 text-xs">✓</span>
                          )}
                        </Link>
                      </div>

                      <button
                        onClick={() => handleStar(work)}
                        disabled={!currentUser}
                        className={`inline-flex items-center px-3 py-1.5 border border-transparent rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 ${
                          work.isStarred
                            ? "text-white bg-yellow-500 hover:bg-yellow-600"
                            : "text-primary-700 bg-primary-100 hover:bg-primary-200"
                        } ${
                          !currentUser ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                      >
                        {work.isStarred ? (
                          <StarSolidIcon className="h-4 w-4 mr-1" />
                        ) : (
                          <StarIcon className="h-4 w-4 mr-1" />
                        )}
                        {work.isStarred ? "Starred" : "Star"}
                      </button>
                    </div>

                    <Link href={`/works/${work.id}`}>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2 hover:text-primary-600 transition-colors duration-200">
                        {work.title}
                      </h3>
                    </Link>

                    {work.description && (
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {work.description}
                      </p>
                    )}

                    <div className="flex flex-wrap gap-2 mb-4">
                      {work.genre && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {work.genre.name}
                        </span>
                      )}
                      {work.instrument && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          {work.instrument.name}
                        </span>
                      )}
                      {work.purpose && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                          {work.purpose.name}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1">
                          <StarIcon className="h-4 w-4" />
                          <span>{work.starsCount}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <PlayIcon className="h-4 w-4" />
                          <span>{work.performancesCount}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <EyeIcon className="h-4 w-4" />
                          <span>{work.viewsCount}</span>
                        </div>
                        {work.commentsCount > 0 && (
                          <div className="flex items-center space-x-1">
                            <ChatBubbleLeftIcon className="h-4 w-4" />
                            <span>{work.commentsCount}</span>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center space-x-1">
                        <CalendarIcon className="h-4 w-4" />
                        <span>{formatDate(work.createdAt)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                      <Link
                        href={`/works/${work.id}`}
                        className="text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors duration-200"
                      >
                        View Details
                      </Link>

                      <div className="flex items-center space-x-2">
                        {work.pdfFilePath && (
                          <a
                            href={work.pdfFilePath}
                            download
                            className="inline-flex items-center px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200"
                          >
                            <DocumentArrowDownIcon className="h-4 w-4 mr-1" />
                            PDF
                          </a>
                        )}
                        {work.midiFilePath && (
                          <a
                            href={work.midiFilePath}
                            download
                            className="inline-flex items-center px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200"
                          >
                            <MusicalNoteIcon className="h-4 w-4 mr-1" />
                            MIDI
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 flex justify-center">
                <nav className="flex items-center space-x-2">
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={currentPage === 1}
                    className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>

                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const page = i + 1;
                    return (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-3 py-2 text-sm font-medium rounded-md ${
                          currentPage === page
                            ? "text-white bg-primary-600"
                            : "text-gray-500 bg-white border border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}

                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                    className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </nav>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
