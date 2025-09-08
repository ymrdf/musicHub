import { NextRequest, NextResponse } from "next/server";
import { User, Work } from "@/lib/models";
import { testConnection } from "@/lib/database";
import type { ApiResponse } from "@/types";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const userId = parseInt(params.id);
    if (isNaN(userId)) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: "Invalid user ID",
        },
        { status: 400 }
      );
    }

    // Get user information
    const user = await User.findByPk(userId);
    if (!user) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: "User not found",
        },
        { status: 404 }
      );
    }

    // Get user works list
    const works = await Work.findAll({
      where: { userId: user.id, isPublic: true },
      order: [["createdAt", "DESC"]],
      limit: 10,
    });

    // Return user information (excluding sensitive data)
    const userResponse = {
      id: user.id,
      username: user.username,
      avatarUrl: user.avatarUrl,
      bio: user.bio,
      website: user.website,
      isVerified: user.isVerified,
      followersCount: user.followersCount,
      followingCount: user.followingCount,
      worksCount: user.worksCount,
      performancesCount: user.performancesCount,
      createdAt: user.createdAt,
      recentWorks: works.map((work) => ({
        id: work.id,
        title: work.title,
        description: work.description,
        starsCount: work.starsCount,
        performancesCount: work.performancesCount,
        createdAt: work.createdAt,
      })),
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
