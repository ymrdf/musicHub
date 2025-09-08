import { NextRequest, NextResponse } from "next/server";
import type { ApiResponse } from "@/types";
import { loginSchema } from "@/utils/validation";
import { User } from "@/lib/models";
import { comparePassword, generateToken } from "@/lib/auth";
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

    // Find user
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: "Invalid email or password",
        },
        { status: 401 }
      );
    }

    // Check if account is active
    if (!user.isActive) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: "Account has been disabled. Please contact administrator",
        },
        { status: 403 }
      );
    }

    // Verify password
    const isPasswordValid = await comparePassword(password, user.passwordHash);
    if (!isPasswordValid) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: "Invalid email or password",
        },
        { status: 401 }
      );
    }

    // Generate JWT token
    const token = generateToken(user.id);

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

    return NextResponse.json<ApiResponse>({
      success: true,
      data: {
        user: userResponse,
        token,
      },
      message: "Login successful",
    });
  } catch (error) {
    console.error("Login failed:", error);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 }
    );
  }
}
