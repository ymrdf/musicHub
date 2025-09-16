"use client";

import { useState, useEffect } from "react";
import {
  UserGroupIcon,
  MusicalNoteIcon,
  PlayIcon,
  StarIcon,
} from "@heroicons/react/24/outline";

interface StatsDisplayProps {
  initialStats: {
    users: number;
    works: number;
    performances: number;
    stars: number;
  };
}

export default function StatsDisplay({ initialStats }: StatsDisplayProps) {
  const [stats, setStats] = useState(initialStats);
  const [loading, setLoading] = useState(false);

  // 实时更新统计数据
  useEffect(() => {
    const fetchUpdatedStats = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/stats", {
          cache: "no-store",
          headers: {
            "Cache-Control": "no-cache, no-store, must-revalidate",
            Pragma: "no-cache",
          },
        });
        const data = await response.json();
        if (data.success) {
          setStats(data.data);
        }
      } catch (error) {
        console.error("Failed to fetch latest stats:", error);
      } finally {
        setLoading(false);
      }
    };

    // 页面加载时立即更新一次数据
    fetchUpdatedStats();

    // 每30秒自动更新一次统计数据
    const interval = setInterval(fetchUpdatedStats, 60000);
    return () => clearInterval(interval);
  }, []);

  const statsData = [
    {
      name: "Registered Users",
      value: stats.users.toString(),
      icon: UserGroupIcon,
    },
    {
      name: "Original Works",
      value: stats.works.toString(),
      icon: MusicalNoteIcon,
    },
    {
      name: "Performances",
      value: stats.performances.toString(),
      icon: PlayIcon,
    },
    { name: "Stars", value: stats.stars.toString(), icon: StarIcon },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
      {statsData.map((stat) => {
        const Icon = stat.icon;
        return (
          <div key={stat.name} className="text-center">
            <div className="flex justify-center mb-4">
              <Icon className="h-8 w-8 text-primary-600" />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">
              {loading ? "..." : stat.value}
            </div>
            <div className="text-sm text-gray-600">{stat.name}</div>
          </div>
        );
      })}
    </div>
  );
}
