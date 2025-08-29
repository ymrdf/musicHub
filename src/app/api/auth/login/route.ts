import { NextRequest, NextResponse } from "next/server";
import type { ApiResponse } from "@/types";
import { loginSchema } from "@/utils/validation";
import { User } from "@/lib/models";
import { comparePassword, generateToken } from "@/lib/auth";
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

    // 验证请求数据
    const { error, value } = loginSchema.validate(body);
    if (error) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: error.details[0].message,
        },
        { status: 400 }
      );
    }

    const { email, password } = value;

    // 查找用户
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: "邮箱或密码错误",
        },
        { status: 401 }
      );
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

    // 验证密码
    const isPasswordValid = await comparePassword(password, user.passwordHash);
    if (!isPasswordValid) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: "邮箱或密码错误",
        },
        { status: 401 }
      );
    }

    // 生成 JWT token
    const token = generateToken(user.id);

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
    };

    return NextResponse.json<ApiResponse>({
      success: true,
      data: {
        user: userResponse,
        token,
      },
      message: "登录成功",
    });
  } catch (error) {
    console.error("登录失败:", error);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: "服务器内部错误",
      },
      { status: 500 }
    );
  }
}
