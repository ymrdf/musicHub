import { NextRequest, NextResponse } from "next/server";
import { Work, Performance } from "@/lib/models";
import { getUserFromRequest } from "@/lib/auth";
import { testConnection } from "@/lib/database";
import type { ApiResponse } from "@/types";
import sequelize from "@/lib/database";
import { QueryTypes } from "sequelize";

export async function GET(request: NextRequest) {
  try {
    // 测试数据库连接
    const isConnected = await testConnection();
    if (!isConnected) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: "数据库连接失败",
        },
        { status: 500 }
      );
    }

    // 获取查询参数
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type") || "all";
    const timePeriod = searchParams.get("timePeriod") || "weekly";
    const limit = parseInt(searchParams.get("limit") || "20");

    // 验证时间周期参数
    if (!["daily", "weekly", "monthly", "all"].includes(timePeriod)) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: "无效的时间周期参数",
        },
        { status: 400 }
      );
    }

    // 获取当前用户（用于检查是否已收藏/点赞）
    const currentUser = await getUserFromRequest(request);

    let items: any[] = [];

    // 根据类型获取数据
    if (type === "all" || type === "work") {
      // 获取热门作品
      const worksQuery = `
        SELECT 
          w.id,
          w.title,
          w.description,
          w.stars_count as starsCount,
          w.performances_count as performancesCount,
          w.comments_count as commentsCount,
          w.views_count as viewsCount,
          w.pdf_file_path as pdfFilePath,
          w.midi_file_path as midiFilePath,
          w.created_at as createdAt,
          u.id as userId,
          u.username,
          u.avatar_url as avatarUrl,
          u.is_verified as isVerified,
          g.id as genreId,
          g.name as genreName,
          i.id as instrumentId,
          i.name as instrumentName,
          p.id as purposeId,
          p.name as purposeName,
          ${
            currentUser
              ? `(SELECT COUNT(*) FROM work_stars WHERE work_id = w.id AND user_id = ${currentUser.id}) as isStarred`
              : "0 as isStarred"
          }
        FROM works w
        LEFT JOIN users u ON w.user_id = u.id
        LEFT JOIN categories g ON w.genre_id = g.id
        LEFT JOIN categories i ON w.instrument_id = i.id
        LEFT JOIN categories p ON w.purpose_id = p.id
        WHERE w.is_public = 1
        ${timePeriod === "daily" ? "AND DATE(w.created_at) = CURDATE()" : ""}
        ${
          timePeriod === "weekly"
            ? "AND YEARWEEK(w.created_at) = YEARWEEK(CURDATE())"
            : ""
        }
        ${
          timePeriod === "monthly"
            ? "AND YEAR(w.created_at) = YEAR(CURDATE()) AND MONTH(w.created_at) = MONTH(CURDATE())"
            : ""
        }
        ${timePeriod === "all" ? "" : ""}
        ORDER BY w.stars_count DESC, w.views_count DESC
        LIMIT ${limit}
      `;

      const works = await sequelize.query(worksQuery, {
        type: QueryTypes.SELECT,
      });

      // 格式化作品数据
      const formattedWorks = works.map((work: any) => ({
        id: work.id,
        type: "work",
        title: work.title,
        description: work.description,
        starsCount: work.starsCount,
        performancesCount: work.performancesCount,
        commentsCount: work.commentsCount,
        viewsCount: work.viewsCount,
        pdfFilePath: work.pdfFilePath,
        midiFilePath: work.midiFilePath,
        createdAt: work.createdAt,
        isStarred: work.isStarred > 0,
        user: {
          id: work.userId,
          username: work.username,
          avatarUrl: work.avatarUrl,
          isVerified: work.isVerified,
        },
        genre: work.genreId
          ? {
              id: work.genreId,
              name: work.genreName,
            }
          : undefined,
        instrument: work.instrumentId
          ? {
              id: work.instrumentId,
              name: work.instrumentName,
            }
          : undefined,
        purpose: work.purposeId
          ? {
              id: work.purposeId,
              name: work.purposeName,
            }
          : undefined,
      }));

      items.push(...formattedWorks);
    }

    if (type === "all" || type === "performance") {
      // 获取热门演奏
      const performancesQuery = `
        SELECT 
          p.id,
          p.title,
          p.description,
          p.likes_count as likesCount,
          p.comments_count as commentsCount,
          p.plays_count as playsCount,
          p.audio_file_path as audioFilePath,
          p.created_at as createdAt,
          u.id as userId,
          u.username,
          u.avatar_url as avatarUrl,
          u.is_verified as isVerified,
          w.genre_id as genreId,
          g.name as genreName,
          w.instrument_id as instrumentId,
          i.name as instrumentName,
          w.purpose_id as purposeId,
          pu.name as purposeName,
          ${
            currentUser
              ? `(SELECT COUNT(*) FROM performance_likes WHERE performance_id = p.id AND user_id = ${currentUser.id}) as isLiked`
              : "0 as isLiked"
          }
        FROM performances p
        LEFT JOIN users u ON p.user_id = u.id
        LEFT JOIN works w ON p.work_id = w.id
        LEFT JOIN categories g ON w.genre_id = g.id
        LEFT JOIN categories i ON w.instrument_id = i.id
        LEFT JOIN categories pu ON w.purpose_id = pu.id
        WHERE p.is_public = 1
        ${timePeriod === "daily" ? "AND DATE(p.created_at) = CURDATE()" : ""}
        ${
          timePeriod === "weekly"
            ? "AND YEARWEEK(p.created_at) = YEARWEEK(CURDATE())"
            : ""
        }
        ${
          timePeriod === "monthly"
            ? "AND YEAR(p.created_at) = YEAR(CURDATE()) AND MONTH(p.created_at) = MONTH(CURDATE())"
            : ""
        }
        ${timePeriod === "all" ? "" : ""}
        ORDER BY p.likes_count DESC, p.plays_count DESC
        LIMIT ${limit}
      `;

      const performances = await sequelize.query(performancesQuery, {
        type: QueryTypes.SELECT,
      });

      // 格式化演奏数据
      const formattedPerformances = performances.map((performance: any) => ({
        id: performance.id,
        type: "performance",
        title: performance.title,
        description: performance.description,
        likesCount: performance.likesCount,
        commentsCount: performance.commentsCount,
        playsCount: performance.playsCount,
        audioFilePath: performance.audioFilePath,
        createdAt: performance.createdAt,
        isLiked: performance.isLiked > 0,
        user: {
          id: performance.userId,
          username: performance.username,
          avatarUrl: performance.avatarUrl,
          isVerified: performance.isVerified,
        },
        genre: performance.genreId
          ? {
              id: performance.genreId,
              name: performance.genreName,
            }
          : undefined,
        instrument: performance.instrumentId
          ? {
              id: performance.instrumentId,
              name: performance.instrumentName,
            }
          : undefined,
        purpose: performance.purposeId
          ? {
              id: performance.purposeId,
              name: performance.purposeName,
            }
          : undefined,
      }));

      items.push(...formattedPerformances);
    }

    // 按热度排序（star数或like数）
    items.sort((a, b) => {
      const aScore = a.type === "work" ? a.starsCount : a.likesCount;
      const bScore = b.type === "work" ? b.starsCount : b.likesCount;
      return (bScore || 0) - (aScore || 0);
    });

    // 限制返回数量
    items = items.slice(0, limit);

    return NextResponse.json<ApiResponse>({
      success: true,
      data: {
        items,
        total: items.length,
        timePeriod,
        type,
      },
    });
  } catch (error) {
    console.error("获取热门内容失败:", error);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: "服务器内部错误",
      },
      { status: 500 }
    );
  }
}
