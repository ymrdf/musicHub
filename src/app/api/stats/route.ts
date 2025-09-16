import { NextResponse } from "next/server";
import { getStats } from "@/lib/stats";

// 强制动态渲染，确保数据实时更新
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const stats = await getStats();
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
