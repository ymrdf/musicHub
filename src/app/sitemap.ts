import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  // 获取所有作品
  let works: any[] = [];
  try {
    const worksResponse = await fetch(
      `${baseUrl}/api/works?limit=100&sortBy=updatedAt&sortOrder=desc`
    );
    const worksData = await worksResponse.json();
    works = worksData.success ? worksData.data.works : [];
  } catch (error) {
    console.error("获取作品数据失败:", error);
  }

  // 获取所有用户
  let users: any[] = [];
  try {
    const usersResponse = await fetch(`${baseUrl}/api/users?limit=100`);
    const usersData = await usersResponse.json();
    users = usersData.success ? usersData.data : [];
  } catch (error) {
    console.error("获取用户数据失败:", error);
  }

  // 静态页面
  const staticPages = [
    "",
    "/discover",
    "/trending",
    "/search",
    "/help",
    "/privacy",
    "/terms",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1 : 0.8,
  }));

  // 作品页面
  const workPages = works.map((work) => ({
    url: `${baseUrl}/works/${work.id}`,
    lastModified: new Date(work.updatedAt || work.createdAt),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  // 用户页面
  const userPages = users.map((user) => ({
    url: `${baseUrl}/users/${user.id}`,
    lastModified: new Date(user.updatedAt || user.createdAt),
    changeFrequency: "monthly" as const,
    priority: 0.5,
  }));

  return [...staticPages, ...workPages, ...userPages];
}
