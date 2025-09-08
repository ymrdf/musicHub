import { NextRequest, NextResponse } from "next/server";
import { User } from "@/lib/models";
import { getUserFromRequest } from "@/lib/auth";
import { testConnection } from "@/lib/database";
import type { ApiResponse } from "@/types";
import sequelize from "@/lib/database";
import { QueryTypes } from "sequelize";

// Follow user
export async function POST(
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

    // Cannot follow yourself
    if (currentUser.id === targetUserId) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: "Cannot follow yourself",
        },
        { status: 400 }
      );
    }

    // Check if target user exists
    const targetUser = await User.findByPk(targetUserId);
    if (!targetUser) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: "User not found",
        },
        { status: 404 }
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

    if (existingFollow) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: "Already following this user",
        },
        { status: 400 }
      );
    }

    // Start transaction
    const transaction = await sequelize.transaction();

    try {
      // Create follow relationship
      await sequelize.query(
        "INSERT INTO user_follows (follower_id, following_id) VALUES (?, ?)",
        {
          replacements: [currentUser.id, targetUserId],
          transaction,
        }
      );

      // Update follow counts
      await currentUser.increment("followingCount", { transaction });
      await targetUser.increment("followersCount", { transaction });

      await transaction.commit();

      return NextResponse.json<ApiResponse>({
        success: true,
        message: "Successfully followed user",
        data: {
          isFollowing: true,
          followersCount: targetUser.followersCount + 1,
        },
      });
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  } catch (error) {
    console.error("Failed to follow user:", error);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 }
    );
  }
}

// Unfollow user
export async function DELETE(
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

    // Check if target user exists
    const targetUser = await User.findByPk(targetUserId);
    if (!targetUser) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: "User not found",
        },
        { status: 404 }
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

    if (!existingFollow) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: "Not following this user yet",
        },
        { status: 400 }
      );
    }

    // Start transaction
    const transaction = await sequelize.transaction();

    try {
      // Delete follow relationship
      await sequelize.query(
        "DELETE FROM user_follows WHERE follower_id = ? AND following_id = ?",
        {
          replacements: [currentUser.id, targetUserId],
          transaction,
        }
      );

      // Update follow counts
      await currentUser.decrement("followingCount", { transaction });
      await targetUser.decrement("followersCount", { transaction });

      await transaction.commit();

      return NextResponse.json<ApiResponse>({
        success: true,
        message: "Successfully unfollowed user",
        data: {
          isFollowing: false,
          followersCount: Math.max(0, targetUser.followersCount - 1),
        },
      });
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  } catch (error) {
    console.error("Failed to unfollow user:", error);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 }
    );
  }
}
