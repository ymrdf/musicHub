import { NextRequest, NextResponse } from "next/server";
import { Work, User, Performance, Category } from "@/lib/models";
import { testConnection } from "@/lib/database";
import type { ApiResponse } from "@/types";
import { Op } from "sequelize";

export async function GET(request: NextRequest) {
  try {
    // 测试数据库连接
    const isConnected = await testConnection();
    if (!isConnected) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: "数据库连接失败",
        },
        { status: 500 }
      );
    }

    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q") || "";
    const type = searchParams.get("type") || "all"; // all, works, users, performances
    const page = parseInt(searchParams.get("page") || "1");
    const limit = Math.min(parseInt(searchParams.get("limit") || "10"), 50);

    if (!query.trim()) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: "搜索关键词不能为空",
        },
        { status: 400 }
      );
    }

    const offset = (page - 1) * limit;
    const results: any = {};

    // 搜索作品
    if (type === "all" || type === "works") {
      const { count: worksCount, rows: works } = await Work.findAndCountAll({
        where: {
          [Op.and]: [
            { isPublic: true },
            {
              [Op.or]: [
                { title: { [Op.like]: `%${query}%` } },
                { description: { [Op.like]: `%${query}%` } },
              ],
            },
          ],
        },
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
        ],
        order: [
          ["starsCount", "DESC"],
          ["createdAt", "DESC"],
        ],
        limit,
        offset,
      });

      results.works = {
        items: works.map((work) => ({
          id: work.id,
          title: work.title,
          description: work.description,
          starsCount: work.starsCount,
          performancesCount: work.performancesCount,
          commentsCount: work.commentsCount,
          viewsCount: work.viewsCount,
          createdAt: work.createdAt,
          user: (work as any).user,
          genre: (work as any).genre,
          instrument: (work as any).instrument,
        })),
        total: worksCount,
        page,
        limit,
        totalPages: Math.ceil(worksCount / limit),
      };
    }

    // 搜索用户
    if (type === "all" || type === "users") {
      const { count: usersCount, rows: users } = await User.findAndCountAll({
        where: {
          [Op.and]: [
            { isActive: true },
            {
              [Op.or]: [
                { username: { [Op.like]: `%${query}%` } },
                { bio: { [Op.like]: `%${query}%` } },
              ],
            },
          ],
        },
        attributes: [
          "id",
          "username",
          "avatarUrl",
          "bio",
          "isVerified",
          "followersCount",
          "worksCount",
          "performancesCount",
          "createdAt",
        ],
        order: [
          ["followersCount", "DESC"],
          ["createdAt", "DESC"],
        ],
        limit,
        offset,
      });

      results.users = {
        items: users,
        total: usersCount,
        page,
        limit,
        totalPages: Math.ceil(usersCount / limit),
      };
    }

    // 搜索演奏
    if (type === "all" || type === "performances") {
      const { count: performancesCount, rows: performances } =
        await Performance.findAndCountAll({
          where: {
            [Op.and]: [
              { isPublic: true },
              {
                [Op.or]: [
                  { title: { [Op.like]: `%${query}%` } },
                  { description: { [Op.like]: `%${query}%` } },
                  { instrument: { [Op.like]: `%${query}%` } },
                ],
              },
            ],
          },
          include: [
            {
              model: User,
              as: "user",
              attributes: ["id", "username", "avatarUrl", "isVerified"],
            },
            {
              model: Work,
              as: "work",
              attributes: ["id", "title", "description"],
              include: [
                {
                  model: User,
                  as: "user",
                  attributes: ["id", "username", "avatarUrl"],
                },
              ],
            },
          ],
          order: [
            ["likesCount", "DESC"],
            ["createdAt", "DESC"],
          ],
          limit,
          offset,
        });

      results.performances = {
        items: performances.map((performance) => ({
          id: performance.id,
          title: performance.title,
          description: performance.description,
          audioFilePath: performance.audioFilePath,
          duration: performance.duration,
          type: performance.type,
          instrument: performance.instrument,
          likesCount: performance.likesCount,
          commentsCount: performance.commentsCount,
          playsCount: performance.playsCount,
          createdAt: performance.createdAt,
          user: (performance as any).user,
          work: (performance as any).work,
        })),
        total: performancesCount,
        page,
        limit,
        totalPages: Math.ceil(performancesCount / limit),
      };
    }

    // 如果是搜索所有类型，限制每种类型的结果数量
    if (type === "all") {
      const maxItemsPerType = 5;
      Object.keys(results).forEach((key) => {
        if (results[key].items.length > maxItemsPerType) {
          results[key].items = results[key].items.slice(0, maxItemsPerType);
        }
      });
    }

    return NextResponse.json<ApiResponse>({
      success: true,
      data: {
        query,
        type,
        results,
      },
    });
  } catch (error) {
    console.error("搜索失败:", error);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: "服务器内部错误",
      },
      { status: 500 }
    );
  }
}
