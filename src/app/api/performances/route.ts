import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/auth";
import { performanceSchema } from "@/utils/validation";
import type { ApiResponse } from "@/types";
import sequelize from "@/lib/database";
import {
  User,
  Work,
  Performance,
  Category,
  PerformanceLike,
} from "@/lib/models";
import { Op } from "sequelize";

// Get performances list
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const workId = searchParams.get("workId");
    const userId = searchParams.get("userId");
    const type = searchParams.get("type");
    const genreId = searchParams.get("genreId");
    const instrumentId = searchParams.get("instrumentId");
    const purposeId = searchParams.get("purposeId");
    const search = searchParams.get("search");
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = searchParams.get("sortOrder") || "desc";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");

    // Get current user information
    const currentUser = await getUserFromRequest(request);

    const where: any = { isPublic: true };

    if (workId) {
      where.workId = parseInt(workId);
    }

    if (userId) {
      where.userId = parseInt(userId);
    }

    if (type && ["instrumental", "vocal"].includes(type)) {
      where.type = type;
    }

    // Build work filter conditions
    const workWhere: any = {};
    if (genreId) {
      workWhere.genreId = parseInt(genreId);
    }
    if (instrumentId) {
      workWhere.instrumentId = parseInt(instrumentId);
    }
    if (purposeId) {
      workWhere.purposeId = parseInt(purposeId);
    }
    if (search && search.trim()) {
      workWhere[Op.or] = [
        { title: { [Op.like]: `%${search.trim()}%` } },
        { description: { [Op.like]: `%${search.trim()}%` } },
      ];
    }

    const offset = (page - 1) * limit;

    const { count, rows } = await Performance.findAndCountAll({
      where,
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "username", "avatarUrl"],
        },
        {
          model: Work,
          as: "work",
          attributes: ["id", "title", "genreId", "instrumentId", "purposeId"],
          where: Object.keys(workWhere).length > 0 ? workWhere : undefined,
          include: [
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
        },
      ],
      order: [[sortBy, sortOrder.toUpperCase()]],
      limit,
      offset,
    });

    // If user is logged in, check like status
    if (currentUser) {
      const performanceIds = rows.map((p) => p.id);
      const likes = await PerformanceLike.findAll({
        where: {
          performanceId: performanceIds,
          userId: currentUser.id,
        },
        attributes: ["performanceId"],
      });

      const likedPerformanceIds = new Set(
        likes.map((l) => (l as any).performanceId)
      );

      rows.forEach((performance) => {
        performance.dataValues.isLiked = likedPerformanceIds.has(
          performance.id
        );
      });
    }

    const totalPages = Math.ceil(count / limit);

    return NextResponse.json<ApiResponse>({
      success: true,
      data: {
        performances: rows,
        pagination: {
          page,
          limit,
          total: count,
          totalPages,
        },
      },
    });
  } catch (error) {
    console.error("Failed to get performances list:", error);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: "Failed to get performances list",
      },
      { status: 500 }
    );
  }
}

// Create performance
export async function POST(request: NextRequest) {
  try {
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
    const { error } = performanceSchema.validate(body);
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
      type,
      instrument,
      lyricsId,
      isPublic,
      workId,
      audioFilePath,
      audioFileSize,
      fileFormat,
    } = body;

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

    // Create performance record
    const performance = await Performance.create({
      workId,
      userId: currentUser.id,
      lyricsId,
      title,
      description,
      audioFilePath,
      audioFileSize,
      fileFormat,
      type,
      instrument,
      isPublic,
      likesCount: 0,
      commentsCount: 0,
      playsCount: 0,
    });

    // Update work performances count
    await work.increment("performancesCount");

    // Update user performances count
    await currentUser.increment("performancesCount");

    // Return created performance record
    const createdPerformance = await Performance.findByPk(performance.id, {
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "username", "avatarUrl"],
        },
        {
          model: Work,
          as: "work",
          attributes: ["id", "title"],
        },
      ],
    });

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        data: createdPerformance,
        message: "Performance uploaded successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Failed to create performance:", error);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: "Failed to create performance",
      },
      { status: 500 }
    );
  }
}
