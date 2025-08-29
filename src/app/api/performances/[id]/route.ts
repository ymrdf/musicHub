import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/auth";
import { performanceSchema } from "@/utils/validation";
import type { ApiResponse } from "@/types";
import { User, Work, Performance, Comment } from "@/lib/models";

// 获取演奏详情
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
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

    const performance = await Performance.findByPk(performanceId, {
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "username", "avatarUrl", "bio"],
        },
        {
          model: Work,
          as: "work",
          attributes: ["id", "title", "description"],
        },
      ],
    });

    if (!performance) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: "演奏不存在",
        },
        { status: 404 }
      );
    }

    // 增加播放次数
    await performance.increment("playsCount");

    return NextResponse.json<ApiResponse>({
      success: true,
      data: performance,
    });
  } catch (error) {
    console.error("获取演奏详情失败:", error);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: "获取演奏详情失败",
      },
      { status: 500 }
    );
  }
}

// 更新演奏
export async function PUT(
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

    // 检查权限（只有演奏者本人可以编辑）
    if (performance.userId !== currentUser.id) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: "没有权限编辑此演奏",
        },
        { status: 403 }
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

    // 更新演奏记录
    await performance.update(body);

    // 返回更新后的演奏记录
    const updatedPerformance = await Performance.findByPk(performanceId, {
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

    return NextResponse.json<ApiResponse>({
      success: true,
      data: updatedPerformance,
      message: "演奏更新成功",
    });
  } catch (error) {
    console.error("更新演奏失败:", error);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: "更新演奏失败",
      },
      { status: 500 }
    );
  }
}

// 删除演奏
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

    // 查找演奏记录
    const performance = await Performance.findByPk(performanceId, {
      include: [
        {
          model: Work,
          as: "work",
        },
      ],
    });

    if (!performance) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: "演奏不存在",
        },
        { status: 404 }
      );
    }

    // 检查权限（只有演奏者本人可以删除）
    if (performance.userId !== currentUser.id) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: "没有权限删除此演奏",
        },
        { status: 403 }
      );
    }

    // 删除演奏记录
    await performance.destroy();

    // 更新作品的演奏数量
    if (performance.work) {
      await performance.work.decrement("performancesCount");
    }

    // 更新用户的演奏数量
    await currentUser.decrement("performancesCount");

    return NextResponse.json<ApiResponse>({
      success: true,
      message: "演奏删除成功",
    });
  } catch (error) {
    console.error("删除演奏失败:", error);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: "删除演奏失败",
      },
      { status: 500 }
    );
  }
}
