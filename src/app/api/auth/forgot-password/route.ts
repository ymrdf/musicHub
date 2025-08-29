import { NextRequest, NextResponse } from "next/server";
import type { ApiResponse } from "@/types";
import { User } from "@/lib/models";
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

    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: "请提供邮箱地址",
        },
        { status: 400 }
      );
    }

    // 验证邮箱格式
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: "请输入有效的邮箱地址",
        },
        { status: 400 }
      );
    }

    // 查找用户
    const user = await User.findOne({ where: { email } });
    if (!user) {
      // 为了安全，即使用户不存在也返回成功
      return NextResponse.json<ApiResponse>({
        success: true,
        message: "如果该邮箱已注册，您将收到密码重置链接",
      });
    }

    // 检查账户是否激活
    if (!user.isActive) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: "账户已被禁用，请联系管理员",
        },
        { status: 403 }
      );
    }

    // 生成重置令牌（有效期30分钟）
    const resetToken = generateToken(user.id);

    // 在实际项目中，您需要：
    // 1. 将重置令牌存储到数据库（带过期时间）
    // 2. 发送包含重置链接的邮件
    // 3. 这里我们只是模拟返回成功

    console.log(`密码重置令牌 (用户 ${user.email}): ${resetToken}`);

    return NextResponse.json<ApiResponse>({
      success: true,
      message: "密码重置链接已发送到您的邮箱",
      // 仅在开发环境返回token，生产环境应删除
      ...(process.env.NODE_ENV === "development" && {
        data: { resetToken },
      }),
    });
  } catch (error) {
    console.error("密码重置请求失败:", error);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: "服务器内部错误",
      },
      { status: 500 }
    );
  }
}
