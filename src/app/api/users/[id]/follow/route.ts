import { NextRequest, NextResponse } from "next/server";
import { User } from "@/lib/models";
import { getUserFromRequest } from "@/lib/auth";
import { testConnection } from "@/lib/database";
import type { ApiResponse } from "@/types";
import sequelize from "@/lib/database";
import { QueryTypes } from "sequelize";

// 关注用户
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

    const targetUserId = parseInt(params.id);
    if (isNaN(targetUserId)) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: "无效的用户ID",
        },
        { status: 400 }
      );
    }

    // 不能关注自己
    if (currentUser.id === targetUserId) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: "不能关注自己",
        },
        { status: 400 }
      );
    }

    // 检查目标用户是否存在
    const targetUser = await User.findByPk(targetUserId);
    if (!targetUser) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: "用户不存在",
        },
        { status: 404 }
      );
    }

    // 检查是否已经关注
    const [existingFollow] = await sequelize.query(
      "SELECT * FROM user_follows WHERE follower_id = ? AND following_id = ?",
      {
        replacements: [currentUser.id, targetUserId],
        type: QueryTypes.SELECT,
      }
    );

    if (existingFollow) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: "已经关注了该用户",
        },
        { status: 400 }
      );
    }

    // 开始事务
    const transaction = await sequelize.transaction();

    try {
      // 创建关注关系
      await sequelize.query(
        "INSERT INTO user_follows (follower_id, following_id) VALUES (?, ?)",
        {
          replacements: [currentUser.id, targetUserId],
          transaction,
        }
      );

      // 更新关注数统计
      await currentUser.increment("followingCount", { transaction });
      await targetUser.increment("followersCount", { transaction });

      await transaction.commit();

      return NextResponse.json<ApiResponse>({
        success: true,
        message: "关注成功",
        data: {
          isFollowing: true,
          followersCount: targetUser.followersCount + 1,
        },
      });
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  } catch (error) {
    console.error("关注用户失败:", error);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: "服务器内部错误",
      },
      { status: 500 }
    );
  }
}

// 取消关注
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

    const targetUserId = parseInt(params.id);
    if (isNaN(targetUserId)) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: "无效的用户ID",
        },
        { status: 400 }
      );
    }

    // 检查目标用户是否存在
    const targetUser = await User.findByPk(targetUserId);
    if (!targetUser) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: "用户不存在",
        },
        { status: 404 }
      );
    }

    // 检查是否已经关注
    const [existingFollow] = await sequelize.query(
      "SELECT * FROM user_follows WHERE follower_id = ? AND following_id = ?",
      {
        replacements: [currentUser.id, targetUserId],
        type: QueryTypes.SELECT,
      }
    );

    if (!existingFollow) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: "尚未关注该用户",
        },
        { status: 400 }
      );
    }

    // 开始事务
    const transaction = await sequelize.transaction();

    try {
      // 删除关注关系
      await sequelize.query(
        "DELETE FROM user_follows WHERE follower_id = ? AND following_id = ?",
        {
          replacements: [currentUser.id, targetUserId],
          transaction,
        }
      );

      // 更新关注数统计
      await currentUser.decrement("followingCount", { transaction });
      await targetUser.decrement("followersCount", { transaction });

      await transaction.commit();

      return NextResponse.json<ApiResponse>({
        success: true,
        message: "取消关注成功",
        data: {
          isFollowing: false,
          followersCount: Math.max(0, targetUser.followersCount - 1),
        },
      });
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  } catch (error) {
    console.error("取消关注失败:", error);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: "服务器内部错误",
      },
      { status: 500 }
    );
  }
}
