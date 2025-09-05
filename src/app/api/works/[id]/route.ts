import { NextRequest, NextResponse } from "next/server";
import { Work, User, Category, Tag } from "@/lib/models";
import { getUserFromRequest } from "@/lib/auth";
import { testConnection } from "@/lib/database";
import type { ApiResponse } from "@/types";
import sequelize from "@/lib/database";
import { QueryTypes } from "sequelize";

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

    // Get current user (if logged in)
    const currentUser = await getUserFromRequest(request);

    // Query work details
    const work = await Work.findByPk(workId, {
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "username", "avatarUrl", "isVerified", "bio"],
        },
        {
          model: Category,
          as: "genre",
          attributes: ["id", "name", "description"],
        },
        {
          model: Category,
          as: "instrument",
          attributes: ["id", "name", "description"],
        },
        {
          model: Category,
          as: "purpose",
          attributes: ["id", "name", "description"],
        },
      ],
    });

    if (!work) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: "Work not found",
        },
        { status: 404 }
      );
    }

    // Check access permissions
    if (!work.isPublic && (!currentUser || currentUser.id !== work.userId)) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: "No permission to access this work",
        },
        { status: 403 }
      );
    }

    // Get work tags
    const tags = await sequelize.query(
      `
      SELECT t.id, t.name, t.color 
      FROM tags t 
      INNER JOIN work_tags wt ON t.id = wt.tag_id 
      WHERE wt.work_id = ?
      ORDER BY t.name
      `,
      {
        replacements: [workId],
        type: QueryTypes.SELECT,
      }
    );

    // Check if current user has starred this work
    let isStarred = false;
    if (currentUser) {
      const [star] = await sequelize.query(
        "SELECT id FROM work_stars WHERE work_id = ? AND user_id = ?",
        {
          replacements: [workId, currentUser.id],
          type: QueryTypes.SELECT,
        }
      );
      isStarred = !!star;
    }

    // Increment view count (async execution, does not affect response)
    work.increment("viewsCount").catch((error) => {
      console.error("Failed to update view count:", error);
    });

    // Build response data
    const workData = {
      id: work.id,
      title: work.title,
      description: work.description,
      pdfFilePath: work.pdfFilePath,
      midiFilePath: work.midiFilePath,
      pdfFileSize: work.pdfFileSize,
      midiFileSize: work.midiFileSize,
      starsCount: work.starsCount,
      performancesCount: work.performancesCount,
      commentsCount: work.commentsCount,
      viewsCount: work.viewsCount + 1, // Include current view
      isPublic: work.isPublic,
      allowCollaboration: work.allowCollaboration,
      license: work.license,
      createdAt: work.createdAt,
      updatedAt: work.updatedAt,
      user: (work as any).user,
      genre: (work as any).genre,
      instrument: (work as any).instrument,
      purpose: (work as any).purpose,
      tags,
      isStarred,
      isOwner: currentUser?.id === work.userId,
    };

    return NextResponse.json<ApiResponse>({
      success: true,
      data: workData,
    });
  } catch (error) {
    console.error("Failed to get work details:", error);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 }
    );
  }
}

// Update work
export async function PUT(
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

    // Find work
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

    // Check permissions
    if (work.userId !== currentUser.id) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: "No permission to modify this work",
        },
        { status: 403 }
      );
    }

    const body = await request.json();
    const {
      title,
      description,
      genreId,
      instrumentId,
      purposeId,
      tags = [],
      isPublic,
      allowCollaboration,
      license,
    } = body;

    // Start transaction
    const transaction = await sequelize.transaction();

    try {
      // Update work information
      await work.update(
        {
          title: title || work.title,
          description:
            description !== undefined ? description : work.description,
          genreId: genreId !== undefined ? genreId : work.genreId,
          instrumentId:
            instrumentId !== undefined ? instrumentId : work.instrumentId,
          purposeId: purposeId !== undefined ? purposeId : work.purposeId,
          isPublic: isPublic !== undefined ? isPublic : work.isPublic,
          allowCollaboration:
            allowCollaboration !== undefined
              ? allowCollaboration
              : work.allowCollaboration,
          license: license || work.license,
        },
        { transaction }
      );

      // Update tags
      if (tags.length >= 0) {
        // Delete existing tag associations
        await sequelize.query("DELETE FROM work_tags WHERE work_id = ?", {
          replacements: [workId],
          transaction,
        });

        // Add new tags
        for (const tagName of tags) {
          let [tag] = await Tag.findOrCreate({
            where: { name: tagName.trim() },
            defaults: {
              name: tagName.trim(),
              usageCount: 0,
              color: "#007bff",
            },
            transaction,
          });

          await sequelize.query(
            "INSERT INTO work_tags (work_id, tag_id) VALUES (?, ?)",
            {
              replacements: [workId, tag.id],
              transaction,
            }
          );

          await tag.increment("usageCount", { transaction });
        }
      }

      await transaction.commit();

      return NextResponse.json<ApiResponse>({
        success: true,
        message: "Work updated successfully",
      });
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  } catch (error) {
    console.error("Failed to update work:", error);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 }
    );
  }
}

// Delete work
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

    // Find work
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

    // Check permissions
    if (work.userId !== currentUser.id) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: "No permission to delete this work",
        },
        { status: 403 }
      );
    }

    // Start transaction
    const transaction = await sequelize.transaction();

    try {
      // Delete work (cascade delete related data)
      await work.destroy({ transaction });

      // Update user works count
      await currentUser.decrement("worksCount", { transaction });

      await transaction.commit();

      return NextResponse.json<ApiResponse>({
        success: true,
        message: "Work deleted successfully",
      });
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  } catch (error) {
    console.error("Failed to delete work:", error);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 }
    );
  }
}
