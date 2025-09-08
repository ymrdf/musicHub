import { NextRequest, NextResponse } from "next/server";
import { User, UserFollow } from "@/lib/models";
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

    // Check if user exists
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

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const offset = (page - 1) * limit;

    // Get user followers
    const followers = await UserFollow.findAll({
      where: { followingId: user.id },
      include: [
        {
          model: User,
          as: "follower",
          attributes: [
            "id",
            "username",
            "avatarUrl",
            "bio",
            "isVerified",
            "followersCount",
            "followingCount",
            "worksCount",
            "performancesCount",
            "createdAt",
          ],
        },
      ],
      order: [["createdAt", "DESC"]],
      limit,
      offset,
    });

    // Get total count
    const totalCount = await UserFollow.count({
      where: { followingId: user.id },
    });

    // Format return data
    const users = followers.map((follow) => ({
      id: (follow as any).follower.id,
      username: (follow as any).follower.username,
      avatarUrl: (follow as any).follower.avatarUrl,
      bio: (follow as any).follower.bio,
      isVerified: (follow as any).follower.isVerified,
      followersCount: (follow as any).follower.followersCount,
      followingCount: (follow as any).follower.followingCount,
      worksCount: (follow as any).follower.worksCount,
      performancesCount: (follow as any).follower.performancesCount,
      createdAt: (follow as any).follower.createdAt,
      followedAt: follow.createdAt,
    }));

    return NextResponse.json<ApiResponse>({
      success: true,
      data: {
        users,
        pagination: {
          page,
          limit,
          total: totalCount,
          totalPages: Math.ceil(totalCount / limit),
        },
      },
    });
  } catch (error) {
    console.error("Failed to get user followers list:", error);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 }
    );
  }
}
