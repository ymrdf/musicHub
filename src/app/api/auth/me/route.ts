import { NextRequest, NextResponse } from "next/server";
import type { ApiResponse } from "@/types";
import { getUserFromRequest } from "@/lib/auth";
import { testConnection } from "@/lib/database";

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

    // 获取当前用户
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: "未授权访问",
        },
        { status: 401 }
      );
    }

    // 返回用户信息（不包含密码）
    const userResponse = {
      id: user.id,
      username: user.username,
      email: user.email,
      avatarUrl: user.avatarUrl,
      bio: user.bio,
      website: user.website,
      isVerified: user.isVerified,
      followersCount: user.followersCount,
      followingCount: user.followingCount,
      worksCount: user.worksCount,
      performancesCount: user.performancesCount,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
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
