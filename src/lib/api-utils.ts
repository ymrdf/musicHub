// src/lib/api-utils.ts
// 用于服务器组件中的数据获取函数

export async function fetchStats() {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/stats`,
    {
      cache: "no-store", // 或使用revalidate选项
    }
  );
  const data = await response.json();
  return data.success
    ? data.data
    : { users: 0, works: 0, performances: 0, stars: 0 };
}

export async function fetchRecommendations() {
  const response = await fetch(
    `${
      process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
    }/api/home/recommendations`,
    {
      next: { revalidate: 3600 }, // 每小时重新验证一次
    }
  );
  const data = await response.json();
  return data.success
    ? data.data
    : {
        hotWorks: [],
        latestWorks: [],
        hotPerformances: [],
        latestPerformances: [],
      };
}

export async function fetchWorkById(id: string) {
  const response = await fetch(
    `${
      process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
    }/api/works/${id}`,
    {
      next: { revalidate: 3600 }, // 每小时重新验证一次
    }
  );

  if (!response.ok) {
    return null;
  }

  const data = await response.json();
  return data.success ? data.data : null;
}

export async function fetchUserProfile(id: string) {
  const response = await fetch(
    `${
      process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
    }/api/users/${id}`,
    {
      next: { revalidate: 3600 }, // 每小时重新验证一次
    }
  );

  if (!response.ok) {
    return null;
  }

  const data = await response.json();
  return data.success ? data.data : null;
}

export async function fetchPopularWorks(limit = 10) {
  const response = await fetch(
    `${
      process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
    }/api/works?sortBy=starsCount&sortOrder=desc&limit=${limit}`,
    {
      next: { revalidate: 86400 }, // 每天重新验证一次
    }
  );
  const data = await response.json();
  return data.success ? data.data.works : [];
}
