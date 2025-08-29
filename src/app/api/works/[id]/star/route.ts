import { NextRequest, NextResponse } from "next/server";
import { Work } from "@/lib/models";
import { getUserFromRequest } from "@/lib/auth";
import { testConnection } from "@/lib/database";
import type { ApiResponse } from "@/types";
import sequelize from "@/lib/database";

// 收藏作品
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const workId = parseInt(params.id);
    if (isNaN(workId)) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: "无效的作品ID",
        },
        { status: 400 }
      );
    }

    // 检查作品是否存在
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

    // 不能收藏自己的作品
    if (work.userId === currentUser.id) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: "不能收藏自己的作品",
        },
        { status: 400 }
      );
    }

    // 检查是否已经收藏
    const [existingStar] = await sequelize.query(
      "SELECT id FROM work_stars WHERE work_id = ? AND user_id = ?",
      {
        replacements: [workId, currentUser.id],
        type: sequelize.QueryTypes.SELECT,
      }
    );

    if (existingStar) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: "已经收藏过该作品",
        },
        { status: 400 }
      );
    }

    // 开始事务
    const transaction = await sequelize.transaction();

    try {
      // 创建收藏记录
      await sequelize.query(
        "INSERT INTO work_stars (work_id, user_id) VALUES (?, ?)",
        {
          replacements: [workId, currentUser.id],
          transaction,
        }
      );

      // 更新作品收藏数
      await work.increment("starsCount", { transaction });

      await transaction.commit();

      return NextResponse.json<ApiResponse>({
        success: true,
        message: "收藏成功",
        data: {
          isStarred: true,
          starsCount: work.starsCount + 1,
        },
      });
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  } catch (error) {
    console.error("收藏作品失败:", error);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: "服务器内部错误",
      },
      { status: 500 }
    );
  }
}

// 取消收藏
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const workId = parseInt(params.id);
    if (isNaN(workId)) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: "无效的作品ID",
        },
        { status: 400 }
      );
    }

    // 检查作品是否存在
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

    // 检查是否已经收藏
    const [existingStar] = await sequelize.query(
      "SELECT id FROM work_stars WHERE work_id = ? AND user_id = ?",
      {
        replacements: [workId, currentUser.id],
        type: sequelize.QueryTypes.SELECT,
      }
    );

    if (!existingStar) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: "尚未收藏该作品",
        },
        { status: 400 }
      );
    }

    // 开始事务
    const transaction = await sequelize.transaction();

    try {
      // 删除收藏记录
      await sequelize.query(
        "DELETE FROM work_stars WHERE work_id = ? AND user_id = ?",
        {
          replacements: [workId, currentUser.id],
          transaction,
        }
      );

      // 更新作品收藏数
      await work.decrement("starsCount", { transaction });

      await transaction.commit();

      return NextResponse.json<ApiResponse>({
        success: true,
        message: "取消收藏成功",
        data: {
          isStarred: false,
          starsCount: Math.max(0, work.starsCount - 1),
        },
      });
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  } catch (error) {
    console.error("取消收藏失败:", error);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: "服务器内部错误",
      },
      { status: 500 }
    );
  }
}
