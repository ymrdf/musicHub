import { NextRequest, NextResponse } from "next/server";
import sequelize from "@/lib/database";
import { getUserFromRequest } from "@/lib/auth";
import { QueryTypes } from "sequelize";

// 删除评论
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
      "SELECT id, user_id, commentable_type, commentable_id, parent_id FROM comments WHERE id = ?",
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

    // 检查用户是否有权限删除评论（评论作者或管理员）
    if ((comment as any).user_id !== user.id && user.role !== "admin") {
      return NextResponse.json(
        { success: false, error: "没有权限删除此评论" },
        { status: 403 }
      );
    }

    // 获取评论所属的内容类型和ID
    const commentableType = (comment as any).commentable_type;
    const commentableId = (comment as any).commentable_id;
    const parentId = (comment as any).parent_id;

    // 删除评论的所有点赞
    await sequelize.query("DELETE FROM comment_likes WHERE comment_id = ?", {
      replacements: [commentId],
      type: QueryTypes.DELETE,
    });

    // 如果是父评论，递归删除所有子评论
    if (!parentId) {
      // 获取所有子评论
      const childComments = await sequelize.query(
        "SELECT id FROM comments WHERE parent_id = ?",
        {
          replacements: [commentId],
          type: QueryTypes.SELECT,
        }
      );

      // 删除所有子评论的点赞
      if (childComments.length > 0) {
        const childCommentIds = childComments.map((c: any) => c.id).join(",");
        if (childCommentIds) {
          await sequelize.query(
            `DELETE FROM comment_likes WHERE comment_id IN (${childCommentIds})`,
            { type: QueryTypes.DELETE }
          );
        }
      }

      // 删除所有子评论
      await sequelize.query("DELETE FROM comments WHERE parent_id = ?", {
        replacements: [commentId],
        type: QueryTypes.DELETE,
      });
    } else {
      // 如果是子评论，更新父评论的回复计数
      await sequelize.query(
        "UPDATE comments SET replies_count = replies_count - 1 WHERE id = ?",
        {
          replacements: [parentId],
          type: QueryTypes.UPDATE,
        }
      );
    }

    // 删除评论
    await sequelize.query("DELETE FROM comments WHERE id = ?", {
      replacements: [commentId],
      type: QueryTypes.DELETE,
    });

    // 更新相关内容的评论计数
    if (commentableType === "performance") {
      await sequelize.query(
        "UPDATE performances SET comments_count = comments_count - 1 WHERE id = ?",
        {
          replacements: [commentableId],
          type: QueryTypes.UPDATE,
        }
      );
    } else if (commentableType === "work") {
      await sequelize.query(
        "UPDATE works SET comments_count = comments_count - 1 WHERE id = ?",
        {
          replacements: [commentableId],
          type: QueryTypes.UPDATE,
        }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("删除评论失败:", error);
    return NextResponse.json(
      { success: false, error: "删除评论失败" },
      { status: 500 }
    );
  }
}
