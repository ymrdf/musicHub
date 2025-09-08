import { NextRequest, NextResponse } from "next/server";
import sequelize from "@/lib/database";
import { QueryTypes } from "sequelize";
import { getUserFromRequest } from "@/lib/auth";
import type { ApiResponse } from "@/types";

// 强制动态渲染
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const currentUser = await getUserFromRequest(request);

    // 获取热门作品（按收藏数排序）
    const hotWorksQuery = `
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
      ORDER BY w.stars_count DESC, w.views_count DESC
      LIMIT 6
    `;

    // 获取最新作品
    const latestWorksQuery = `
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
      ORDER BY w.created_at DESC
      LIMIT 6
    `;

    // 获取热门演奏
    const hotPerformancesQuery = `
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
        w.id as workId,
        w.title as workTitle,
        g.id as genreId,
        g.name as genreName,
        i.id as instrumentId,
        i.name as instrumentName,
        p.id as purposeId,
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
      ORDER BY p.likes_count DESC, p.plays_count DESC
      LIMIT 6
    `;

    // 获取最新演奏
    const latestPerformancesQuery = `
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
        w.id as workId,
        w.title as workTitle,
        g.id as genreId,
        g.name as genreName,
        i.id as instrumentId,
        i.name as instrumentName,
        p.id as purposeId,
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
      ORDER BY p.created_at DESC
      LIMIT 6
    `;

    // 执行查询
    const [hotWorks, latestWorks, hotPerformances, latestPerformances] =
      await Promise.all([
        sequelize.query(hotWorksQuery, { type: QueryTypes.SELECT }),
        sequelize.query(latestWorksQuery, { type: QueryTypes.SELECT }),
        sequelize.query(hotPerformancesQuery, { type: QueryTypes.SELECT }),
        sequelize.query(latestPerformancesQuery, { type: QueryTypes.SELECT }),
      ]);

    // 格式化数据
    const formatWork = (work: any) => ({
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
      user: {
        id: work.userId,
        username: work.username,
        avatarUrl: work.avatarUrl,
        isVerified: work.isVerified,
      },
      genre: work.genreId ? { id: work.genreId, name: work.genreName } : null,
      instrument: work.instrumentId
        ? { id: work.instrumentId, name: work.instrumentName }
        : null,
      purpose: work.purposeId
        ? { id: work.purposeId, name: work.purposeName }
        : null,
      isStarred: work.isStarred > 0,
    });

    const formatPerformance = (performance: any) => ({
      id: performance.id,
      type: "performance",
      title: performance.title,
      description: performance.description,
      likesCount: performance.likesCount,
      commentsCount: performance.commentsCount,
      playsCount: performance.playsCount,
      audioFilePath: performance.audioFilePath,
      createdAt: performance.createdAt,
      user: {
        id: performance.userId,
        username: performance.username,
        avatarUrl: performance.avatarUrl,
        isVerified: performance.isVerified,
      },
      work: {
        id: performance.workId,
        title: performance.workTitle,
      },
      genre: performance.genreId
        ? { id: performance.genreId, name: performance.genreName }
        : null,
      instrument: performance.instrumentId
        ? { id: performance.instrumentId, name: performance.instrumentName }
        : null,
      purpose: performance.purposeId
        ? { id: performance.purposeId, name: performance.purposeName }
        : null,
      isLiked: performance.isLiked > 0,
    });

    const recommendations = {
      hotWorks: hotWorks.map(formatWork),
      latestWorks: latestWorks.map(formatWork),
      hotPerformances: hotPerformances.map(formatPerformance),
      latestPerformances: latestPerformances.map(formatPerformance),
    };

    return NextResponse.json<ApiResponse>({
      success: true,
      data: recommendations,
    });
  } catch (error) {
    console.error("获取推荐内容失败:", error);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: "获取推荐内容失败",
      },
      { status: 500 }
    );
  }
}
