import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/auth";
import { performanceSchema } from "@/utils/validation";
import type { ApiResponse } from "@/types";
import { sequelize } from "@/lib/database";
import { User, Work, Performance } from "@/lib/models";

// 获取演奏列表
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const workId = searchParams.get("workId");
    const userId = searchParams.get("userId");
    const type = searchParams.get("type");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");

    // 获取当前用户信息
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
          attributes: ["id", "title"],
        },
      ],
      order: [["createdAt", "DESC"]],
      limit,
      offset,
    });

    // 如果用户已登录，检查点赞状态
    if (currentUser) {
      const performanceIds = rows.map((p) => p.id);
      const likes = await sequelize.models.PerformanceLike.findAll({
        where: {
          performanceId: performanceIds,
          userId: currentUser.id,
        },
        attributes: ["performanceId"],
      });

      const likedPerformanceIds = new Set(likes.map((l) => l.performanceId));

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
    console.error("获取演奏列表失败:", error);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: "获取演奏列表失败",
      },
      { status: 500 }
    );
  }
}

// 创建演奏
export async function POST(request: NextRequest) {
  try {
    // 验证用户身份
    const currentUser = await getUserFromRequest(request);
    if (!currentUser) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: "请先登录",
        },
        { status: 401 }
      );
    }

    const body = await request.json();

    // 验证请求数据
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

    // 验证作品是否存在
    const work = await Work.findByPk(workId);
    if (!work) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: "作品不存在",
        },
        { status: 404 }
      );
    }

    // 创建演奏记录
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

    // 更新作品的演奏数量
    await work.increment("performancesCount");

    // 更新用户的演奏数量
    await currentUser.increment("performancesCount");

    // 返回创建的演奏记录
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
        message: "演奏上传成功",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("创建演奏失败:", error);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: "创建演奏失败",
      },
      { status: 500 }
    );
  }
}
