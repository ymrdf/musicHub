import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/auth";
import type { ApiResponse } from "@/types";
import { Performance, PerformanceLike, User } from "@/lib/models";

// 点赞演奏
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const performanceId = parseInt(params.id);

    if (isNaN(performanceId)) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: "无效的演奏ID",
        },
        { status: 400 }
      );
    }

    // 查找演奏记录
    const performance = await Performance.findByPk(performanceId);
    if (!performance) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: "演奏不存在",
        },
        { status: 404 }
      );
    }

    // 检查是否已经点赞
    const existingLike = await PerformanceLike.findOne({
      where: {
        performanceId,
        userId: currentUser.id,
      },
    });

    if (existingLike) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: "您已经点赞过此演奏",
        },
        { status: 400 }
      );
    }

    // 创建点赞记录
    await PerformanceLike.create({
      performanceId,
      userId: currentUser.id,
    });

    // 更新演奏的点赞数
    await performance.increment("likesCount");

    return NextResponse.json<ApiResponse>({
      success: true,
      message: "点赞成功",
    });
  } catch (error) {
    console.error("点赞演奏失败:", error);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: "点赞演奏失败",
      },
      { status: 500 }
    );
  }
}

// 取消点赞
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const performanceId = parseInt(params.id);

    if (isNaN(performanceId)) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: "无效的演奏ID",
        },
        { status: 400 }
      );
    }

    // 查找点赞记录
    const like = await PerformanceLike.findOne({
      where: {
        performanceId,
        userId: currentUser.id,
      },
    });

    if (!like) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: "您还没有点赞过此演奏",
        },
        { status: 400 }
      );
    }

    // 删除点赞记录
    await like.destroy();

    // 更新演奏的点赞数
    await Performance.decrement("likesCount", {
      where: { id: performanceId },
    });

    return NextResponse.json<ApiResponse>({
      success: true,
      message: "取消点赞成功",
    });
  } catch (error) {
    console.error("取消点赞演奏失败:", error);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: "取消点赞演奏失败",
      },
      { status: 500 }
    );
  }
}

// 检查是否已点赞
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // 验证用户身份
    const currentUser = await getUserFromRequest(request);
    if (!currentUser) {
      return NextResponse.json<ApiResponse>({
        success: true,
        data: { isLiked: false },
      });
    }

    const performanceId = parseInt(params.id);

    if (isNaN(performanceId)) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: "无效的演奏ID",
        },
        { status: 400 }
      );
    }

    // 检查是否已经点赞
    const existingLike = await PerformanceLike.findOne({
      where: {
        performanceId,
        userId: currentUser.id,
      },
    });

    return NextResponse.json<ApiResponse>({
      success: true,
      data: { isLiked: !!existingLike },
    });
  } catch (error) {
    console.error("检查点赞状态失败:", error);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: "检查点赞状态失败",
      },
      { status: 500 }
    );
  }
}
