import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/database";
import { getServerSession } from "@/lib/auth";

// 删除评论
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession();
    if (!session?.user) {
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
    const comment = await db.comment.findUnique({
      where: { id: commentId },
    });

    if (!comment) {
      return NextResponse.json(
        { success: false, error: "评论不存在" },
        { status: 404 }
      );
    }

    // 检查用户是否有权限删除评论（评论作者或管理员）
    if (comment.userId !== session.user.id && session.user.role !== "admin") {
      return NextResponse.json(
        { success: false, error: "没有权限删除此评论" },
        { status: 403 }
      );
    }

    // 获取评论所属的内容类型和ID
    const { commentableType, commentableId, parentId } = comment;

    // 删除评论的所有点赞
    await db.commentLike.deleteMany({
      where: { commentId },
    });

    // 如果是父评论，递归删除所有子评论
    if (!parentId) {
      // 获取所有子评论
      const childComments = await db.comment.findMany({
        where: { parentId: commentId },
      });

      // 删除所有子评论的点赞
      if (childComments.length > 0) {
        const childCommentIds = childComments.map((c) => c.id);
        await db.commentLike.deleteMany({
          where: { commentId: { in: childCommentIds } },
        });
      }

      // 删除所有子评论
      await db.comment.deleteMany({
        where: { parentId: commentId },
      });
    } else {
      // 如果是子评论，更新父评论的回复计数
      await db.comment.update({
        where: { id: parentId },
        data: {
          repliesCount: {
            decrement: 1,
          },
        },
      });
    }

    // 删除评论
    await db.comment.delete({
      where: { id: commentId },
    });

    // 更新相关内容的评论计数
    if (commentableType === "performance") {
      await db.performance.update({
        where: { id: commentableId },
        data: {
          commentsCount: {
            decrement: 1,
          },
        },
      });
    } else if (commentableType === "work") {
      await db.work.update({
        where: { id: commentableId },
        data: {
          commentsCount: {
            decrement: 1,
          },
        },
      });
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
