import { User, Work } from "@/lib/models";

export async function getUserProfile(id: string) {
  try {
    const userId = parseInt(id);
    if (isNaN(userId)) {
      return null;
    }

    // 获取用户信息
    const user = await User.findByPk(userId);
    if (!user) {
      return null;
    }

    // 获取用户的公开作品列表
    const works = await Work.findAll({
      where: { userId: user.id, isPublic: true },
      order: [["createdAt", "DESC"]],
      limit: 10,
    });

    // 返回用户信息（排除敏感数据）
    return {
      id: user.id,
      username: user.username,
      avatarUrl: user.avatarUrl,
      bio: user.bio,
      website: user.website,
      isVerified: user.isVerified,
      followersCount: user.followersCount,
      followingCount: user.followingCount,
      worksCount: user.worksCount,
      performancesCount: user.performancesCount,
      createdAt: user.createdAt.toISOString(),
      recentWorks: works.map((work) => ({
        id: work.id,
        title: work.title,
        description: work.description,
        starsCount: work.starsCount,
        performancesCount: work.performancesCount,
        createdAt: work.createdAt.toISOString(),
      })),
    };
  } catch (error) {
    console.error("获取用户信息失败:", error);
    throw error;
  }
}
