import { NextRequest, NextResponse } from "next/server";
import sequelize from "@/lib/database";
import { QueryTypes } from "sequelize";

export async function GET() {
  try {
    console.log("开始获取统计数据...");

    // 测试数据库连接
    await sequelize.authenticate();
    console.log("数据库连接成功");

    // 获取用户总数
    const userCountResult = await sequelize.query(
      "SELECT COUNT(*) as count FROM users WHERE is_active = 1",
      { type: QueryTypes.SELECT }
    );
    const userCount = userCountResult[0] as any;

    // 获取原创作品总数
    const workCountResult = await sequelize.query(
      "SELECT COUNT(*) as count FROM works WHERE is_public = 1",
      { type: QueryTypes.SELECT }
    );
    const workCount = workCountResult[0] as any;

    // 获取演奏作品总数
    const performanceCountResult = await sequelize.query(
      "SELECT COUNT(*) as count FROM performances WHERE is_public = 1",
      { type: QueryTypes.SELECT }
    );
    const performanceCount = performanceCountResult[0] as any;

    // 获取收藏总数
    const starCountResult = await sequelize.query(
      "SELECT COUNT(*) as count FROM work_stars",
      { type: QueryTypes.SELECT }
    );
    const starCount = starCountResult[0] as any;

    const stats = {
      users: userCount.count,
      works: workCount.count,
      performances: performanceCount.count,
      stars: starCount.count,
    };

    console.log("统计数据:", stats);

    return NextResponse.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error("获取统计数据失败:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "获取统计数据失败",
      },
      { status: 500 }
    );
  }
}
