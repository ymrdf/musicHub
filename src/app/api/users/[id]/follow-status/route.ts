import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/auth";
import { testConnection } from "@/lib/database";
import type { ApiResponse } from "@/types";
import sequelize from "@/lib/database";
import { QueryTypes } from "sequelize";

// 检查关注状态
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

    // 验证用户身份
    const currentUser = await getUserFromRequest(request);
    if (!currentUser) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: "请先登录",
        },
        { status: 401 }
      );
    }

    const targetUserId = parseInt(params.id);
    if (isNaN(targetUserId)) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: "无效的用户ID",
        },
        { status: 400 }
      );
    }

    // 检查是否已经关注
    const [existingFollow] = await sequelize.query(
      "SELECT * FROM user_follows WHERE follower_id = ? AND following_id = ?",
      {
        replacements: [currentUser.id, targetUserId],
        type: QueryTypes.SELECT,
      }
    );

    return NextResponse.json<ApiResponse>({
      success: true,
      data: {
        isFollowing: !!existingFollow,
      },
    });
  } catch (error) {
    console.error("检查关注状态失败:", error);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: "服务器内部错误",
      },
      { status: 500 }
    );
  }
}
