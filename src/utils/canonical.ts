/**
 * 生成Canonical URL的工具函数
 * 用于SEO优化，确保每个页面都有唯一的规范URL
 */

const SITE_URL = "https://musicemit.com";

/**
 * 生成完整的Canonical URL
 * @param path - 页面路径，例如 '/works/123'
 * @returns 完整的Canonical URL
 */
export function generateCanonicalUrl(path: string): string {
  // 确保路径以 / 开头
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  // 移除查询参数和hash
  const cleanPath = normalizedPath.split("?")[0].split("#")[0];

  // 移除尾部的斜杠（除了根路径）
  const finalPath =
    cleanPath === "/" ? cleanPath : cleanPath.replace(/\/$/, "");

  return `${SITE_URL}${finalPath}`;
}

/**
 * 为Next.js metadata生成canonical URL配置
 * @param path - 页面路径
 * @returns 包含canonical URL的metadata对象
 */
export function generateCanonicalMetadata(path: string) {
  return {
    alternates: {
      canonical: generateCanonicalUrl(path),
    },
  };
}

/**
 * 常用页面的Canonical URL生成器
 * 权重集中策略：
 * - 所有work相关页面权重集中到 /works
 * - 所有performance相关页面权重集中到 /performances
 * - 其他页面权重集中到主页 /
 */
export const canonicalUrls = {
  // 主要页面保持独立
  home: () => generateCanonicalUrl("/"),
  works: () => generateCanonicalUrl("/works"),
  performances: () => generateCanonicalUrl("/performances"),

  // 功能页面权重重定向到主页（权重集中策略）
  about: () => generateCanonicalUrl("/"),
  help: () => generateCanonicalUrl("/"),
  feedback: () => generateCanonicalUrl("/"),
  privacy: () => generateCanonicalUrl("/"),
  terms: () => generateCanonicalUrl("/"),
  discover: () => generateCanonicalUrl("/"),
  trending: () => generateCanonicalUrl("/"),
  search: () => generateCanonicalUrl("/"),

  // 认证页面权重重定向到主页
  login: () => generateCanonicalUrl("/"),
  register: () => generateCanonicalUrl("/"),
  forgotPassword: () => generateCanonicalUrl("/"),
  resetPassword: () => generateCanonicalUrl("/"),
  verifyEmail: () => generateCanonicalUrl("/"),

  // 所有work相关页面权重集中到 /works
  work: (id: string) => generateCanonicalUrl("/works"),
  workEdit: (id: string) => generateCanonicalUrl("/works"),
  workNew: () => generateCanonicalUrl("/works"),

  // 用户相关页面权重重定向到主页
  user: (id: string) => generateCanonicalUrl("/"),
  userFollowers: (id: string) => generateCanonicalUrl("/"),
  userFollowing: (id: string) => generateCanonicalUrl("/"),
  userStarredWorks: (id: string) => generateCanonicalUrl("/"),

  // 所有performance相关页面权重集中到 /performances
  performance: (id: string) => generateCanonicalUrl("/performances"),
  performanceEdit: (id: string) => generateCanonicalUrl("/performances"),
  performanceNew: () => generateCanonicalUrl("/performances"),

  // 设置页面权重重定向到主页
  settingsProfile: () => generateCanonicalUrl("/"),
};
