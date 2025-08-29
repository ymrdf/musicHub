import { NextRequest, NextResponse } from "next/server";
import type { ApiResponse } from "@/types";
import { User } from "@/lib/models";
import { verifyToken } from "@/lib/auth";
import { testConnection } from "@/lib/database";

export async function POST(request: NextRequest) {
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

    const body = await request.json();
    const { token } = body;

    if (!token) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: "验证令牌不能为空",
        },
        { status: 400 }
      );
    }

    // 验证令牌
    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: "验证链接无效或已过期",
        },
        { status: 400 }
      );
    }

    // 查找用户
    const user = await User.findByPk(decoded.userId);
    if (!user) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: "用户不存在",
        },
        { status: 404 }
      );
    }

    // 检查用户是否已经验证
    if (user.isVerified) {
      return NextResponse.json<ApiResponse>({
        success: true,
        message: "邮箱已经验证过了",
      });
    }

    // 更新用户验证状态
    await user.update({ isVerified: true });

    return NextResponse.json<ApiResponse>({
      success: true,
      message: "邮箱验证成功！",
    });
  } catch (error) {
    console.error("邮箱验证失败:", error);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: "服务器内部错误",
      },
      { status: 500 }
    );
  }
}
