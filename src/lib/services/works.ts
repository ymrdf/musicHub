import { Work, User, Category } from "@/lib/models";
import sequelize from "@/lib/database";
import { QueryTypes } from "sequelize";
import type { User as UserType } from "@/types";

export async function getWorkById(id: string, currentUser?: UserType) {
  try {
    const workId = parseInt(id);
    if (isNaN(workId)) {
      return null;
    }

    // 查询作品详情
    const work = await Work.findByPk(workId, {
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "username", "avatarUrl", "isVerified", "bio"],
        },
        {
          model: Category,
          as: "genre",
          attributes: ["id", "name", "description"],
        },
        {
          model: Category,
          as: "instrument",
          attributes: ["id", "name", "description"],
        },
        {
          model: Category,
          as: "purpose",
          attributes: ["id", "name", "description"],
        },
      ],
    });

    if (!work) {
      return null;
    }

    // 检查访问权限
    if (!work.isPublic) {
      return null; // 只返回公开作品
    }

    // 增加浏览次数
    await work.increment("viewsCount");

    // 获取标签信息
    const tagsQuery = `
      SELECT t.id, t.name, t.color
      FROM tags t
      JOIN work_tags wt ON t.id = wt.tag_id
      WHERE wt.work_id = ?
    `;
    const tags = (await sequelize.query(tagsQuery, {
      replacements: [work.id],
      type: QueryTypes.SELECT,
    })) as Array<{ id: number; name: string; color: string }>;

    // 检查当前用户是否收藏了此作品
    let isStarred = false;
    if (currentUser) {
      const [star] = await sequelize.query(
        "SELECT id FROM work_stars WHERE work_id = ? AND user_id = ?",
        {
          replacements: [work.id, currentUser.id],
          type: QueryTypes.SELECT,
        }
      );
      isStarred = !!star;
    }

    return {
      id: work.id,
      title: work.title,
      description: work.description,
      pdfFilePath: work.pdfFilePath,
      midiFilePath: work.midiFilePath,
      pdfFileSize: work.pdfFileSize,
      midiFileSize: work.midiFileSize,
      starsCount: work.starsCount,
      performancesCount: work.performancesCount,
      commentsCount: work.commentsCount,
      viewsCount: work.viewsCount,
      isPublic: work.isPublic,
      license: work.license,
      allowCollaboration: work.allowCollaboration,
      createdAt: work.createdAt,
      updatedAt: work.updatedAt,
      user: (work as any).user,
      genre: (work as any).genre,
      instrument: (work as any).instrument,
      purpose: (work as any).purpose,
      tags,
      isStarred,
      isOwner: currentUser?.id === work.userId,
    };
  } catch (error) {
    console.error("获取作品详情失败:", error);
    throw error;
  }
}

export async function getPopularWorks(limit = 10) {
  try {
    const works = await Work.findAll({
      where: { isPublic: true },
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "username", "avatarUrl", "isVerified"],
        },
        {
          model: Category,
          as: "genre",
          attributes: ["id", "name"],
        },
        {
          model: Category,
          as: "instrument",
          attributes: ["id", "name"],
        },
        {
          model: Category,
          as: "purpose",
          attributes: ["id", "name"],
        },
      ],
      order: [
        ["starsCount", "DESC"],
        ["viewsCount", "DESC"],
      ],
      limit,
    });

    // 格式化数据
    return works.map((work) => ({
      id: work.id,
      title: work.title,
      description: work.description,
      pdfFilePath: work.pdfFilePath,
      midiFilePath: work.midiFilePath,
      starsCount: work.starsCount,
      performancesCount: work.performancesCount,
      commentsCount: work.commentsCount,
      viewsCount: work.viewsCount,
      license: work.license,
      createdAt: work.createdAt,
      updatedAt: work.updatedAt,
      user: (work as any).user,
      genre: (work as any).genre,
      instrument: (work as any).instrument,
      purpose: (work as any).purpose,
    }));
  } catch (error) {
    console.error("获取热门作品失败:", error);
    throw error;
  }
}
