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

  // 可以添加实时更新功能
  useEffect(() => {
    const fetchUpdatedStats = async () => {
      try {
        const response = await fetch("/api/stats");
        const data = await response.json();
        if (data.success) {
          setStats(data.data);
        }
      } catch (error) {
        console.error("获取最新统计数据失败:", error);
      }
    };

    // 可以添加定时刷新或其他触发条件
    // const interval = setInterval(fetchUpdatedStats, 60000); // 每分钟更新一次
    // return () => clearInterval(interval);
  }, []);

  const statsData = [
    { name: "注册用户", value: stats.users.toString(), icon: UserGroupIcon },
    { name: "原创作品", value: stats.works.toString(), icon: MusicalNoteIcon },
    { name: "演奏作品", value: stats.performances.toString(), icon: PlayIcon },
    { name: "作品收藏", value: stats.stars.toString(), icon: StarIcon },
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
