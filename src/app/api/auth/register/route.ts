import { NextRequest, NextResponse } from "next/server";
import type { ApiResponse } from "@/types";
import { registerSchema } from "@/utils/validation";
import { User } from "@/lib/models";
import { hashPassword, generateToken } from "@/lib/auth";
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
    const { error, value } = registerSchema.validate(body);
    if (error) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: error.details[0].message,
        },
        { status: 400 }
      );
    }

    const { username, email, password } = value;

    // 检查用户名是否已存在
    const existingUserByUsername = await User.findOne({ where: { username } });
    if (existingUserByUsername) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: "用户名已存在",
        },
        { status: 409 }
      );
    }

    // 检查邮箱是否已存在
    const existingUserByEmail = await User.findOne({ where: { email } });
    if (existingUserByEmail) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: "邮箱已被注册",
        },
        { status: 409 }
      );
    }

    // 加密密码
    const passwordHash = await hashPassword(password);

    // 创建用户
    const user = await User.create({
      username,
      email,
      passwordHash,
      avatarUrl: `https://api.dicebear.com/7.x/avatars/svg?seed=${encodeURIComponent(
        username
      )}`,
      isVerified: false,
      isActive: true,
      followersCount: 0,
      followingCount: 0,
      worksCount: 0,
      performancesCount: 0,
    });

    // 生成 JWT token
    const token = generateToken(user.id);

    // 生成邮箱验证令牌
    const verificationToken = generateToken(user.id);

    // 在实际项目中，您需要发送包含验证链接的邮件
    console.log(`邮箱验证令牌 (用户 ${user.email}): ${verificationToken}`);
    console.log(
      `验证链接: ${
        process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
      }/auth/verify-email?token=${verificationToken}`
    );

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

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        data: {
          user: userResponse,
          token,
        },
        message: "注册成功！请查收邮件验证您的账户",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("注册失败:", error);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: "服务器内部错误",
      },
      { status: 500 }
    );
  }
}
