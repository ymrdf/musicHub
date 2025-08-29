import { NextRequest, NextResponse } from "next/server";
import { User, Work } from "@/lib/models";
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

    // 获取用户信息
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

    // 获取用户的作品列表
    const works = await Work.findAll({
      where: { userId: user.id, isPublic: true },
      order: [["createdAt", "DESC"]],
      limit: 10,
    });

    // 返回用户信息（不包含敏感信息）
    const userResponse = {
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
      createdAt: user.createdAt,
      recentWorks: works.map((work) => ({
        id: work.id,
        title: work.title,
        description: work.description,
        starsCount: work.starsCount,
        performancesCount: work.performancesCount,
        createdAt: work.createdAt,
      })),
    };

    return NextResponse.json<ApiResponse>({
      success: true,
      data: userResponse,
    });
  } catch (error) {
    console.error("获取用户信息失败:", error);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: "服务器内部错误",
      },
      { status: 500 }
    );
  }
}
