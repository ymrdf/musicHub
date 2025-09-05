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

    // 获取用户的粉丝
    const followers = await UserFollow.findAll({
      where: { followingId: user.id },
      include: [
        {
          model: User,
          as: "follower",
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
      where: { followingId: user.id },
    });

    // 格式化返回数据
    const users = followers.map((follow) => ({
      id: (follow as any).follower.id,
      username: (follow as any).follower.username,
      avatarUrl: (follow as any).follower.avatarUrl,
      bio: (follow as any).follower.bio,
      isVerified: (follow as any).follower.isVerified,
      followersCount: (follow as any).follower.followersCount,
      followingCount: (follow as any).follower.followingCount,
      worksCount: (follow as any).follower.worksCount,
      performancesCount: (follow as any).follower.performancesCount,
      createdAt: (follow as any).follower.createdAt,
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
    console.error("获取用户粉丝列表失败:", error);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: "服务器内部错误",
      },
      { status: 500 }
    );
  }
}

