// src/lib/api-utils.ts
// Data fetching functions for server components

import { getStats } from "@/lib/stats";
import { getRecommendations } from "@/lib/services/recommendations";
import { getWorkById, getPopularWorks } from "@/lib/services/works";
import { getUserProfile } from "@/lib/services/users";

export async function fetchStats() {
  try {
    return await getStats();
  } catch (error) {
    console.error("获取统计数据失败:", error);
    return { users: 0, works: 0, performances: 0, stars: 0 };
  }
}

export async function fetchRecommendations() {
  try {
    return await getRecommendations();
  } catch (error) {
    console.error("获取推荐内容失败:", error);
    return {
      hotWorks: [],
      latestWorks: [],
      hotPerformances: [],
      latestPerformances: [],
    };
  }
}

export async function fetchWorkById(id: string) {
  try {
    // 在服务端渲染时，我们不知道当前用户，所以传递 undefined
    // 这意味着 isOwner 和 isStarred 将为默认值
    return await getWorkById(id, undefined);
  } catch (error) {
    console.error("获取作品详情失败:", error);
    return null;
  }
}

export async function fetchUserProfile(id: string) {
  try {
    return await getUserProfile(id);
  } catch (error) {
    console.error("获取用户信息失败:", error);
    return null;
  }
}

export async function fetchPopularWorks(limit = 10) {
  try {
    return await getPopularWorks(limit);
  } catch (error) {
    console.error("获取热门作品失败:", error);
    return [];
  }
}
