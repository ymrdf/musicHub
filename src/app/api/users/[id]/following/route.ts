import { NextRequest, NextResponse } from "next/server";
import { User, UserFollow } from "@/lib/models";
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

    // 获取用户关注的人
    const following = await UserFollow.findAll({
      where: { followerId: user.id },
      include: [
        {
          model: User,
          as: "following",
          attributes: [
            "id",
            "username",
            "avatarUrl",
            "bio",
            "isVerified",
            "followersCount",
            "followingCount",
            "worksCount",
            "performancesCount",
            "createdAt",
          ],
        },
      ],
      order: [["createdAt", "DESC"]],
      limit,
      offset,
    });

    // 获取总数
    const totalCount = await UserFollow.count({
      where: { followerId: user.id },
    });

    // 格式化返回数据
    const users = following.map((follow) => ({
      id: (follow as any).following.id,
      username: (follow as any).following.username,
      avatarUrl: (follow as any).following.avatarUrl,
      bio: (follow as any).following.bio,
      isVerified: (follow as any).following.isVerified,
      followersCount: (follow as any).following.followersCount,
      followingCount: (follow as any).following.followingCount,
      worksCount: (follow as any).following.worksCount,
      performancesCount: (follow as any).following.performancesCount,
      createdAt: (follow as any).following.createdAt,
      followedAt: follow.createdAt,
    }));

    return NextResponse.json<ApiResponse>({
      success: true,
      data: {
        users,
        pagination: {
          page,
          limit,
          total: totalCount,
          totalPages: Math.ceil(totalCount / limit),
        },
      },
    });
  } catch (error) {
    console.error("获取用户关注列表失败:", error);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: "服务器内部错误",
      },
      { status: 500 }
    );
  }
}

