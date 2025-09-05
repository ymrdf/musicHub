"use client";

import { useRouter } from "next/navigation";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import RecommendationCard from "./RecommendationCard";

interface RecommendationItem {
  id: number;
  type: "work" | "performance";
  title: string;
  description?: string;
  user: {
    id: number;
    username: string;
    email: string;
    passwordHash: string;
    avatarUrl?: string;
    bio?: string;
    website?: string;
    isVerified: boolean;
    isActive: boolean;
    followersCount: number;
    followingCount: number;
    worksCount: number;
    performancesCount: number;
    createdAt: Date;
    updatedAt: Date;
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
  work?: {
    id: number;
    title: string;
  };
  starsCount?: number;
  performancesCount?: number;
  commentsCount?: number;
  viewsCount?: number;
  pdfFilePath?: string;
  midiFilePath?: string;
  isStarred?: boolean;
  likesCount?: number;
  playsCount?: number;
  audioFilePath?: string;
  isLiked?: boolean;
  createdAt: string;
}

interface RecommendationSectionProps {
  title: string;
  items: RecommendationItem[];
  viewAllLink: string;
  loading?: boolean;
}

export default function RecommendationSection({
  title,
  items,
  viewAllLink,
  loading = false,
}: RecommendationSectionProps) {
  const router = useRouter();

  const handleViewAll = () => {
    router.push(viewAllLink);
  };

  if (loading) {
    return (
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
            <button className="flex items-center text-primary-600 hover:text-primary-700 font-medium">
              View All
              <ArrowRightIcon className="h-4 w-4 ml-1" />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-md p-4 animate-pulse"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                    <div>
                      <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-24"></div>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 rounded"></div>
                  <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                </div>
                <div className="flex space-x-2 mt-3">
                  <div className="h-6 bg-gray-200 rounded-full w-16"></div>
                  <div className="h-6 bg-gray-200 rounded-full w-20"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (items.length === 0) {
    return null;
  }

  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
          <button
            onClick={handleViewAll}
            className="flex items-center text-primary-600 hover:text-primary-700 font-medium transition-colors"
          >
            View All
            <ArrowRightIcon className="h-4 w-4 ml-1" />
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <RecommendationCard key={`${item.type}-${item.id}`} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}
