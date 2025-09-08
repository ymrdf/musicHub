import { NextRequest, NextResponse } from "next/server";
import { Work } from "@/lib/models";
import { getUserFromRequest } from "@/lib/auth";
import { testConnection } from "@/lib/database";
import type { ApiResponse } from "@/types";
import sequelize from "@/lib/database";
import { QueryTypes } from "sequelize";

// Star work
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

    const workId = parseInt(params.id);
    if (isNaN(workId)) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: "Invalid work ID",
        },
        { status: 400 }
      );
    }

    // Check if work exists
    const work = await Work.findByPk(workId);
    if (!work) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: "Work not found",
        },
        { status: 404 }
      );
    }

    // Cannot star own work
    if (work.userId === currentUser.id) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: "Cannot star your own work",
        },
        { status: 400 }
      );
    }

    // Check if already starred
    const [existingStar] = await sequelize.query(
      "SELECT id FROM work_stars WHERE work_id = ? AND user_id = ?",
      {
        replacements: [workId, currentUser.id],
        type: QueryTypes.SELECT,
      }
    );

    if (existingStar) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: "Work already starred",
        },
        { status: 400 }
      );
    }

    // Start transaction
    const transaction = await sequelize.transaction();

    try {
      // Create star record
      await sequelize.query(
        "INSERT INTO work_stars (work_id, user_id) VALUES (?, ?)",
        {
          replacements: [workId, currentUser.id],
          transaction,
        }
      );

      // Update work stars count
      await work.increment("starsCount", { transaction });

      await transaction.commit();

      return NextResponse.json<ApiResponse>({
        success: true,
        message: "Work starred successfully",
        data: {
          isStarred: true,
          starsCount: work.starsCount + 1,
        },
      });
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  } catch (error) {
    console.error("Failed to star work:", error);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 }
    );
  }
}

// Unstar work
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

    const workId = parseInt(params.id);
    if (isNaN(workId)) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: "Invalid work ID",
        },
        { status: 400 }
      );
    }

    // Check if work exists
    const work = await Work.findByPk(workId);
    if (!work) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: "Work not found",
        },
        { status: 404 }
      );
    }

    // Check if already starred
    const [existingStar] = await sequelize.query(
      "SELECT id FROM work_stars WHERE work_id = ? AND user_id = ?",
      {
        replacements: [workId, currentUser.id],
        type: QueryTypes.SELECT,
      }
    );

    if (!existingStar) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: "Work not starred yet",
        },
        { status: 400 }
      );
    }

    // Start transaction
    const transaction = await sequelize.transaction();

    try {
      // Delete star record
      await sequelize.query(
        "DELETE FROM work_stars WHERE work_id = ? AND user_id = ?",
        {
          replacements: [workId, currentUser.id],
          transaction,
        }
      );

      // Update work stars count
      await work.decrement("starsCount", { transaction });

      await transaction.commit();

      return NextResponse.json<ApiResponse>({
        success: true,
        message: "Work unstarred successfully",
        data: {
          isStarred: false,
          starsCount: Math.max(0, work.starsCount - 1),
        },
      });
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  } catch (error) {
    console.error("Failed to unstar work:", error);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 }
    );
  }
}
