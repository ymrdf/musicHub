import { MetadataRoute } from "next";
import sequelize, { QueryTypes } from "@/lib/database";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  // 获取所有作品
  let works: any[] = [];
  try {
    const result = await sequelize.query(
      `SELECT id, created_at, updated_at FROM works 
       WHERE is_public = true 
       ORDER BY updated_at DESC 
       LIMIT 100`,
      { type: QueryTypes.SELECT }
    );
    works = result || [];
  } catch (error) {
    console.error("获取作品数据失败:", error);
  }

  // 获取所有用户
  let users: any[] = [];
  try {
    const result = await sequelize.query(
      `SELECT id, created_at, updated_at FROM users 
       WHERE is_active = true 
       ORDER BY updated_at DESC 
       LIMIT 100`,
      { type: QueryTypes.SELECT }
    );
    users = result || [];
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
    "/about",
    "/privacy",
    "/terms",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1 : 0.8,
  }));

  // 作品页面
  const workPages = (works || []).map((work) => ({
    url: `${baseUrl}/works/${work.id}`,
    lastModified: new Date(work.updated_at || work.created_at),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  // 用户页面
  const userPages = (users || []).map((user) => ({
    url: `${baseUrl}/users/${user.id}`,
    lastModified: new Date(user.updated_at || user.created_at),
    changeFrequency: "monthly" as const,
    priority: 0.5,
  }));

  return [...staticPages, ...workPages, ...userPages];
}
