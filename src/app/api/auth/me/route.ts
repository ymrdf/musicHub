import { NextRequest, NextResponse } from "next/server";
import type { ApiResponse } from "@/types";
import { getUserFromRequest } from "@/lib/auth";
import { testConnection } from "@/lib/database";

// 强制动态渲染
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
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

    // Get current user
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: "Unauthorized access",
        },
        { status: 401 }
      );
    }

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
      updatedAt: user.updatedAt.toISOString(),
    };

    return NextResponse.json<ApiResponse>({
      success: true,
      data: userResponse,
    });
  } catch (error) {
    console.error("Failed to get user information:", error);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 }
    );
  }
}
