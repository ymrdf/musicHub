import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/database";
import { getServerSession } from "@/lib/auth";

// 点赞评论
export async function POST(
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

    // 检查用户是否已经点赞
    const existingLike = await db.commentLike.findFirst({
      where: {
        commentId,
        userId: session.user.id,
      },
    });

    if (existingLike) {
      return NextResponse.json(
        { success: false, error: "您已经点赞过此评论" },
        { status: 400 }
      );
    }

    // 创建点赞记录
    await db.commentLike.create({
      data: {
        commentId,
        userId: session.user.id,
      },
    });

    // 更新评论的点赞计数
    await db.comment.update({
      where: { id: commentId },
      data: {
        likesCount: {
          increment: 1,
        },
      },
    });

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

    // 检查用户是否已经点赞
    const existingLike = await db.commentLike.findFirst({
      where: {
        commentId,
        userId: session.user.id,
      },
    });

    if (!existingLike) {
      return NextResponse.json(
        { success: false, error: "您尚未点赞此评论" },
        { status: 400 }
      );
    }

    // 删除点赞记录
    await db.commentLike.delete({
      where: {
        id: existingLike.id,
      },
    });

    // 更新评论的点赞计数
    await db.comment.update({
      where: { id: commentId },
      data: {
        likesCount: {
          decrement: 1,
        },
      },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("取消点赞评论失败:", error);
    return NextResponse.json(
      { success: false, error: "取消点赞评论失败" },
      { status: 500 }
    );
  }
}
