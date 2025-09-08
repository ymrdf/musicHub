import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/auth";
import { testConnection } from "@/lib/database";
import type { ApiResponse } from "@/types";
import sequelize from "@/lib/database";
import { QueryTypes } from "sequelize";

// Check follow status
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

    // Verify user identity
    const currentUser = await getUserFromRequest(request);
    if (!currentUser) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: "Please login first",
        },
        { status: 401 }
      );
    }

    const targetUserId = parseInt(params.id);
    if (isNaN(targetUserId)) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: "Invalid user ID",
        },
        { status: 400 }
      );
    }

    // Check if already following
    const [existingFollow] = await sequelize.query(
      "SELECT * FROM user_follows WHERE follower_id = ? AND following_id = ?",
      {
        replacements: [currentUser.id, targetUserId],
        type: QueryTypes.SELECT,
      }
    );

    return NextResponse.json<ApiResponse>({
      success: true,
      data: {
        isFollowing: !!existingFollow,
      },
    });
  } catch (error) {
    console.error("Failed to check follow status:", error);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 }
    );
  }
}
