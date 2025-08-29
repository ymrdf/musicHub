import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/database";
import { getServerSession } from "@/lib/auth";
import { ApiResponse, Comment, PaginatedResponse } from "@/types";

// 获取演奏评论列表
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const performanceId = parseInt(params.id);
    if (isNaN(performanceId)) {
      return NextResponse.json(
        { success: false, error: "无效的演奏ID" },
        { status: 400 }
      );
    }

    // 检查演奏是否存在
    const performance = await db.performance.findUnique({
      where: { id: performanceId },
    });

    if (!performance) {
      return NextResponse.json(
        { success: false, error: "演奏不存在" },
        { status: 404 }
      );
    }

    // 获取URL查询参数
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const parentId = searchParams.get("parentId") || undefined;

    // 计算分页
    const skip = (page - 1) * limit;

    // 获取评论总数
    const totalCount = await db.comment.count({
      where: {
        commentableType: "performance",
        commentableId: performanceId,
        parentId: parentId ? parseInt(parentId) : null,
      },
    });

    // 获取评论列表
    const comments = await db.comment.findMany({
      where: {
        commentableType: "performance",
        commentableId: performanceId,
        parentId: parentId ? parseInt(parentId) : null,
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            avatarUrl: true,
          },
        },
        _count: {
          select: {
            replies: true,
            likes: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      skip,
      take: limit,
    });

    // 获取当前用户的会话
    const session = await getServerSession();
    const userId = session?.user?.id;

    // 如果用户已登录，检查用户是否已点赞评论
    let commentsWithLikeStatus = comments;
    if (userId) {
      const commentIds = comments.map((comment) => comment.id);
      const userLikes = await db.commentLike.findMany({
        where: {
          commentId: { in: commentIds },
          userId: userId,
        },
      });

      const likedCommentIds = new Set(userLikes.map((like) => like.commentId));

      commentsWithLikeStatus = comments.map((comment) => ({
        ...comment,
        likesCount: comment._count.likes,
        repliesCount: comment._count.replies,
        isLiked: likedCommentIds.has(comment.id),
        _count: undefined,
      }));
    } else {
      commentsWithLikeStatus = comments.map((comment) => ({
        ...comment,
        likesCount: comment._count.likes,
        repliesCount: comment._count.replies,
        isLiked: false,
        _count: undefined,
      }));
    }

    // 构建分页响应
    const response: ApiResponse<PaginatedResponse<Comment>> = {
      success: true,
      data: {
        items: commentsWithLikeStatus as unknown as Comment[],
        total: totalCount,
        page,
        limit,
        totalPages: Math.ceil(totalCount / limit),
      },
    };

    return NextResponse.json(response);
  } catch (error: any) {
    console.error("获取评论失败:", error);
    return NextResponse.json(
      { success: false, error: "获取评论失败" },
      { status: 500 }
    );
  }
}

// 创建新评论
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

    const performanceId = parseInt(params.id);
    if (isNaN(performanceId)) {
      return NextResponse.json(
        { success: false, error: "无效的演奏ID" },
        { status: 400 }
      );
    }

    // 检查演奏是否存在
    const performance = await db.performance.findUnique({
      where: { id: performanceId },
    });

    if (!performance) {
      return NextResponse.json(
        { success: false, error: "演奏不存在" },
        { status: 404 }
      );
    }

    // 解析请求体
    const body = await request.json();
    const { content, parentId } = body;

    if (!content || content.trim() === "") {
      return NextResponse.json(
        { success: false, error: "评论内容不能为空" },
        { status: 400 }
      );
    }

    // 如果提供了parentId，检查父评论是否存在
    if (parentId) {
      const parentComment = await db.comment.findUnique({
        where: { id: parentId },
      });

      if (!parentComment) {
        return NextResponse.json(
          { success: false, error: "父评论不存在" },
          { status: 404 }
        );
      }

      // 确保父评论也属于同一个演奏
      if (
        parentComment.commentableType !== "performance" ||
        parentComment.commentableId !== performanceId
      ) {
        return NextResponse.json(
          { success: false, error: "父评论不属于此演奏" },
          { status: 400 }
        );
      }
    }

    // 创建新评论
    const newComment = await db.comment.create({
      data: {
        userId: session.user.id,
        commentableType: "performance",
        commentableId: performanceId,
        content: content.trim(),
        parentId: parentId || null,
        isPublic: true,
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            avatarUrl: true,
          },
        },
      },
    });

    // 更新演奏的评论计数
    await db.performance.update({
      where: { id: performanceId },
      data: {
        commentsCount: {
          increment: 1,
        },
      },
    });

    // 如果是回复，更新父评论的回复计数
    if (parentId) {
      await db.comment.update({
        where: { id: parentId },
        data: {
          repliesCount: {
            increment: 1,
          },
        },
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        ...newComment,
        likesCount: 0,
        repliesCount: 0,
        isLiked: false,
      },
    });
  } catch (error: any) {
    console.error("创建评论失败:", error);
    return NextResponse.json(
      { success: false, error: "创建评论失败" },
      { status: 500 }
    );
  }
}
