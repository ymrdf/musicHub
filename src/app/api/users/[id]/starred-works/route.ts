import { NextRequest, NextResponse } from "next/server";
import { User, Work, WorkStar } from "@/lib/models";
import { testConnection } from "@/lib/database";
import type { ApiResponse } from "@/types";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const userId = parseInt(params.id);
    if (isNaN(userId)) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: "无效的用户ID",
        },
        { status: 400 }
      );
    }

    // 检查用户是否存在
    const user = await User.findByPk(userId);
    if (!user) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: "用户不存在",
        },
        { status: 404 }
      );
    }

    // 获取查询参数
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const offset = (page - 1) * limit;

    // 获取用户star的作品
    const starredWorks = await WorkStar.findAll({
      where: { userId: user.id },
      include: [
        {
          model: Work,
          as: "work",
          where: { isPublic: true },
          include: [
            {
              model: User,
              as: "user",
              attributes: ["id", "username", "avatarUrl"],
            },
          ],
        },
      ],
      order: [["createdAt", "DESC"]],
      limit,
      offset,
    });

    // 获取总数
    const totalCount = await WorkStar.count({
      where: { userId: user.id },
      include: [
        {
          model: Work,
          as: "work",
          where: { isPublic: true },
        },
      ],
    });

    // 格式化返回数据
    const works = starredWorks.map((star) => ({
      id: star.work.id,
      title: star.work.title,
      description: star.work.description,
      starsCount: star.work.starsCount,
      performancesCount: star.work.performancesCount,
      commentsCount: star.work.commentsCount,
      viewsCount: star.work.viewsCount,
      createdAt: star.work.createdAt,
      starredAt: star.createdAt,
      user: {
        id: star.work.user.id,
        username: star.work.user.username,
        avatarUrl: star.work.user.avatarUrl,
      },
    }));

    return NextResponse.json<ApiResponse>({
      success: true,
      data: {
        works,
        pagination: {
          page,
          limit,
          total: totalCount,
          totalPages: Math.ceil(totalCount / limit),
        },
      },
    });
  } catch (error) {
    console.error("获取用户star作品失败:", error);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: "服务器内部错误",
      },
      { status: 500 }
    );
  }
}

