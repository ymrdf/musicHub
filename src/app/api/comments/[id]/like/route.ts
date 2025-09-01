import { NextRequest, NextResponse } from "next/server";
import sequelize from "@/lib/database";
import { getUserFromRequest } from "@/lib/auth";
import { QueryTypes } from "sequelize";

// 点赞评论
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json(
        { success: false, error: "未授权" },
        { status: 401 }
      );
    }

    const commentId = parseInt(params.id);
    if (isNaN(commentId)) {
      return NextResponse.json(
        { success: false, error: "无效的评论ID" },
        { status: 400 }
      );
    }

    // 检查评论是否存在
    const [comment] = await sequelize.query(
      "SELECT id FROM comments WHERE id = ?",
      {
        replacements: [commentId],
        type: QueryTypes.SELECT,
      }
    );

    if (!comment) {
      return NextResponse.json(
        { success: false, error: "评论不存在" },
        { status: 404 }
      );
    }

    // 检查用户是否已经点赞
    const [existingLike] = await sequelize.query(
      "SELECT id FROM comment_likes WHERE comment_id = ? AND user_id = ?",
      {
        replacements: [commentId, user.id],
        type: QueryTypes.SELECT,
      }
    );

    if (existingLike) {
      return NextResponse.json(
        { success: false, error: "您已经点赞过此评论" },
        { status: 400 }
      );
    }

    // 创建点赞记录
    await sequelize.query(
      "INSERT INTO comment_likes (comment_id, user_id, created_at) VALUES (?, ?, NOW())",
      {
        replacements: [commentId, user.id],
        type: QueryTypes.INSERT,
      }
    );

    // 更新评论的点赞计数
    await sequelize.query(
      "UPDATE comments SET likes_count = likes_count + 1 WHERE id = ?",
      {
        replacements: [commentId],
        type: QueryTypes.UPDATE,
      }
    );

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("点赞评论失败:", error);
    return NextResponse.json(
      { success: false, error: "点赞评论失败" },
      { status: 500 }
    );
  }
}

// 取消点赞评论
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json(
        { success: false, error: "未授权" },
        { status: 401 }
      );
    }

    const commentId = parseInt(params.id);
    if (isNaN(commentId)) {
      return NextResponse.json(
        { success: false, error: "无效的评论ID" },
        { status: 400 }
      );
    }

    // 检查评论是否存在
    const [comment] = await sequelize.query(
      "SELECT id FROM comments WHERE id = ?",
      {
        replacements: [commentId],
        type: QueryTypes.SELECT,
      }
    );

    if (!comment) {
      return NextResponse.json(
        { success: false, error: "评论不存在" },
        { status: 404 }
      );
    }

    // 检查用户是否已经点赞
    const [existingLike] = await sequelize.query(
      "SELECT id FROM comment_likes WHERE comment_id = ? AND user_id = ?",
      {
        replacements: [commentId, user.id],
        type: QueryTypes.SELECT,
      }
    );

    if (!existingLike) {
      return NextResponse.json(
        { success: false, error: "您尚未点赞此评论" },
        { status: 400 }
      );
    }

    // 删除点赞记录
    await sequelize.query(
      "DELETE FROM comment_likes WHERE comment_id = ? AND user_id = ?",
      {
        replacements: [commentId, user.id],
        type: QueryTypes.DELETE,
      }
    );

    // 更新评论的点赞计数
    await sequelize.query(
      "UPDATE comments SET likes_count = likes_count - 1 WHERE id = ?",
      {
        replacements: [commentId],
        type: QueryTypes.UPDATE,
      }
    );

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("取消点赞评论失败:", error);
    return NextResponse.json(
      { success: false, error: "取消点赞评论失败" },
      { status: 500 }
    );
  }
}
