import { NextRequest, NextResponse } from "next/server";
import type { ApiResponse } from "@/types";
import { getUserFromRequest } from "@/lib/auth";
import { generateToken } from "@/lib/auth";
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

    // 检查用户是否已经验证
    if (user.isVerified) {
      return NextResponse.json<ApiResponse>({
        success: true,
        message: "邮箱已经验证过了",
      });
    }

    // 生成验证令牌
    const verificationToken = generateToken(user.id);

    // 在实际项目中，您需要：
    // 1. 发送包含验证链接的邮件
    // 2. 这里我们只是模拟返回成功

    console.log(`邮箱验证令牌 (用户 ${user.email}): ${verificationToken}`);

    return NextResponse.json<ApiResponse>({
      success: true,
      message: "验证邮件已重新发送到您的邮箱",
      // 仅在开发环境返回token，生产环境应删除
      ...(process.env.NODE_ENV === "development" && {
        data: { verificationToken },
      }),
    });
  } catch (error) {
    console.error("重发验证邮件失败:", error);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: "服务器内部错误",
      },
      { status: 500 }
    );
  }
}
