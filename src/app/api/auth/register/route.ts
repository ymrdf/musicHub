import { NextRequest, NextResponse } from "next/server";
import type { ApiResponse } from "@/types";
import { registerSchema } from "@/utils/validation";
import { User } from "@/lib/models";
import { hashPassword, generateToken } from "@/lib/auth";
import { testConnection } from "@/lib/database";

export async function POST(request: NextRequest) {
  try {
    // Test database connection
    const isConnected = await testConnection();
    if (!isConnected) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: "Database connection failed",
        },
        { status: 500 }
      );
    }

    const body = await request.json();

    // Validate request data
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

    // Check if username already exists
    const existingUserByUsername = await User.findOne({ where: { username } });
    if (existingUserByUsername) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: "Username already exists",
        },
        { status: 409 }
      );
    }

    // Check if email already exists
    const existingUserByEmail = await User.findOne({ where: { email } });
    if (existingUserByEmail) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: "Email already registered",
        },
        { status: 409 }
      );
    }

    // Hash password
    const passwordHash = await hashPassword(password);

    // Create user
    const user = await User.create({
      username,
      email,
      passwordHash,
      avatarUrl: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
        username
      )}`,
      isVerified: false,
      isActive: true,
      followersCount: 0,
      followingCount: 0,
      worksCount: 0,
      performancesCount: 0,
    });

    // Generate JWT token
    const token = generateToken(user.id);

    // Generate email verification token
    const verificationToken = generateToken(user.id);

    // In a real project, you need to send an email with verification link
    console.log(
      `Email verification token (user ${user.email}): ${verificationToken}`
    );
    console.log(
      `Verification link: ${
        process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
      }/auth/verify-email?token=${verificationToken}`
    );

    // Return user information (excluding password)
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
        message:
          "Registration successful! Please check your email to verify your account",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration failed:", error);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 }
    );
  }
}
