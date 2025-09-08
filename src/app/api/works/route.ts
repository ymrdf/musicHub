import { NextRequest, NextResponse } from "next/server";
import { Work, User, Category, Tag } from "@/lib/models";
import { getUserFromRequest } from "@/lib/auth";
import { testConnection } from "@/lib/database";
import { workSchema } from "@/utils/validation";
import type { ApiResponse, PaginatedResponse } from "@/types";
import sequelize from "@/lib/database";
import { Op } from "sequelize";

// Get works list
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

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = Math.min(parseInt(searchParams.get("limit") || "20"), 100);
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = searchParams.get("sortOrder") || "desc";
    const search = searchParams.get("search");
    const genreId = searchParams.get("genreId");
    const instrumentId = searchParams.get("instrumentId");
    const userId = searchParams.get("userId");

    // Build query conditions
    const whereClause: any = { isPublic: true };

    if (search) {
      whereClause[Op.or] = [
        { title: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } },
      ];
    }

    if (genreId) {
      whereClause.genreId = parseInt(genreId);
    }

    if (instrumentId) {
      whereClause.instrumentId = parseInt(instrumentId);
    }

    if (userId) {
      whereClause.userId = parseInt(userId);
    }

    // Calculate offset
    const offset = (page - 1) * limit;

    // Query works
    const { count, rows: works } = await Work.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "username", "avatarUrl", "isVerified"],
        },
        {
          model: Category,
          as: "genre",
          attributes: ["id", "name"],
        },
        {
          model: Category,
          as: "instrument",
          attributes: ["id", "name"],
        },
        {
          model: Category,
          as: "purpose",
          attributes: ["id", "name"],
        },
      ],
      order: [[sortBy, sortOrder.toUpperCase()]],
      limit,
      offset,
    });

    // Format data
    const formattedWorks = works.map((work) => ({
      id: work.id,
      title: work.title,
      description: work.description,
      pdfFilePath: work.pdfFilePath,
      midiFilePath: work.midiFilePath,
      starsCount: work.starsCount,
      performancesCount: work.performancesCount,
      commentsCount: work.commentsCount,
      viewsCount: work.viewsCount,
      license: work.license,
      createdAt: work.createdAt,
      updatedAt: work.updatedAt,
      user: (work as any).user,
      genre: (work as any).genre,
      instrument: (work as any).instrument,
      purpose: (work as any).purpose,
    }));

    const response: PaginatedResponse<(typeof formattedWorks)[0]> = {
      items: formattedWorks,
      total: count,
      page,
      limit,
      totalPages: Math.ceil(count / limit),
    };

    return NextResponse.json<ApiResponse>({
      success: true,
      data: response,
    });
  } catch (error) {
    console.error("Failed to get works list:", error);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 }
    );
  }
}

// Create work
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

    const body = await request.json();

    // Validate request data
    const { error, value } = workSchema.validate(body);
    if (error) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: error.details[0].message,
        },
        { status: 400 }
      );
    }

    const {
      title,
      description,
      pdfFilePath,
      midiFilePath,
      genreId,
      instrumentId,
      purposeId,
      tags = [],
      isPublic = true,
      allowCollaboration = true,
      license = "CC BY-SA 4.0",
    } = value;

    // Start transaction
    const transaction = await sequelize.transaction();

    try {
      // Create work
      const work = await Work.create(
        {
          title,
          description,
          userId: currentUser.id,
          pdfFilePath,
          midiFilePath,
          genreId,
          instrumentId,
          purposeId,
          isPublic,
          allowCollaboration,
          license,
          starsCount: 0,
          performancesCount: 0,
          commentsCount: 0,
          viewsCount: 0,
        },
        { transaction }
      );

      // Handle tags
      if (tags.length > 0) {
        for (const tagName of tags) {
          // Find or create tag
          let [tag] = await Tag.findOrCreate({
            where: { name: tagName.trim() },
            defaults: {
              name: tagName.trim(),
              usageCount: 0,
              color: "#007bff",
            },
            transaction,
          });

          // Create work-tag association
          await sequelize.query(
            "INSERT INTO work_tags (work_id, tag_id) VALUES (?, ?)",
            {
              replacements: [work.id, tag.id],
              transaction,
            }
          );

          // Update tag usage count
          await tag.increment("usageCount", { transaction });
        }
      }

      // Update user works count
      await currentUser.increment("worksCount", { transaction });

      // Get complete work information (before transaction commit)
      const completeWork = await Work.findByPk(work.id, {
        include: [
          {
            model: User,
            as: "user",
            attributes: ["id", "username", "avatarUrl", "isVerified"],
          },
          {
            model: Category,
            as: "genre",
            attributes: ["id", "name"],
          },
          {
            model: Category,
            as: "instrument",
            attributes: ["id", "name"],
          },
          {
            model: Category,
            as: "purpose",
            attributes: ["id", "name"],
          },
        ],
        transaction,
      });

      // Commit transaction
      await transaction.commit();

      return NextResponse.json<ApiResponse>(
        {
          success: true,
          data: completeWork,
          message: "Work created successfully",
        },
        { status: 201 }
      );
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  } catch (error) {
    console.error("Failed to create work:", error);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 }
    );
  }
}
