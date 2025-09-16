"use client";

import { useState, useEffect } from "react";
import RecommendationSection from "@/components/RecommendationSection";

interface RecommendationItem {
  id: number;
  type: "work" | "performance";
  title: string;
  description?: string;
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

interface Recommendations {
  hotWorks: RecommendationItem[];
  latestWorks: RecommendationItem[];
  hotPerformances: RecommendationItem[];
  latestPerformances: RecommendationItem[];
}

interface DynamicRecommendationsProps {
  initialRecommendations: Recommendations;
}

export default function DynamicRecommendations({
  initialRecommendations,
}: DynamicRecommendationsProps) {
  const [recommendations, setRecommendations] = useState(
    initialRecommendations
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUpdatedRecommendations = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/home/recommendations", {
          cache: "no-store",
          headers: {
            "Cache-Control": "no-cache, no-store, must-revalidate",
            Pragma: "no-cache",
          },
        });
        const data = await response.json();
        if (data.success) {
          setRecommendations(data.data);
        }
      } catch (error) {
        console.error("Failed to fetch latest recommendations:", error);
      } finally {
        setLoading(false);
      }
    };

    // 页面加载时立即更新一次数据
    fetchUpdatedRecommendations();

    // 每60秒自动更新一次推荐数据
    const interval = setInterval(fetchUpdatedRecommendations, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <RecommendationSection
        title="🔥 Hot Creations"
        items={recommendations.hotWorks}
        viewAllLink="/trending?type=work"
        loading={loading}
      />

      <RecommendationSection
        title="🎵 Hot Performances"
        items={recommendations.hotPerformances}
        viewAllLink="/discover?sortBy=likesCount&sortOrder=desc"
        loading={loading}
      />

      <RecommendationSection
        title="✨ Latest Creations"
        items={recommendations.latestWorks}
        viewAllLink="/works?sortBy=createdAt&sortOrder=desc"
        loading={loading}
      />

      <RecommendationSection
        title="🎤 Latest Performances"
        items={recommendations.latestPerformances}
        viewAllLink="/discover?sortBy=createdAt&sortOrder=desc"
        loading={loading}
      />
    </>
  );
}
