import { NextRequest, NextResponse } from "next/server";
import type { ApiResponse } from "@/types";
import { User } from "@/lib/models";
import { hashPassword, verifyToken } from "@/lib/auth";
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
    const { token, password, confirmPassword } = body;

    if (!token || !password || !confirmPassword) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: "请填写所有必填字段",
        },
        { status: 400 }
      );
    }

    // 验证密码匹配
    if (password !== confirmPassword) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: "两次密码输入不一致",
        },
        { status: 400 }
      );
    }

    // 验证密码强度
    if (password.length < 8) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: "密码至少需要8个字符",
        },
        { status: 400 }
      );
    }

    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: "密码必须包含大小写字母和数字",
        },
        { status: 400 }
      );
    }

    // 验证重置令牌
    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: "重置链接无效或已过期",
        },
        { status: 400 }
      );
    }

    // 查找用户
    const user = await User.findByPk(decoded.userId);
    if (!user || !user.isActive) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: "用户不存在或账户已被禁用",
        },
        { status: 404 }
      );
    }

    // 更新密码
    const passwordHash = await hashPassword(password);
    await user.update({ passwordHash });

    return NextResponse.json<ApiResponse>({
      success: true,
      message: "密码重置成功，请使用新密码登录",
    });
  } catch (error) {
    console.error("密码重置失败:", error);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: "服务器内部错误",
      },
      { status: 500 }
    );
  }
}
