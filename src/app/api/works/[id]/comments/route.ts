import { NextRequest, NextResponse } from "next/server";
import sequelize from "@/lib/database";
import { getUserFromRequest } from "@/lib/auth";
import { ApiResponse, Comment, PaginatedResponse } from "@/types";
import { QueryTypes } from "sequelize";

// 获取作品评论列表
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const workId = parseInt(params.id);
    if (isNaN(workId)) {
      return NextResponse.json(
        { success: false, error: "无效的作品ID" },
        { status: 400 }
      );
    }

    // 检查作品是否存在
    const [works] = await sequelize.query("SELECT id FROM works WHERE id = ?", {
      replacements: [workId],
      type: QueryTypes.SELECT,
    });

    if (!works) {
      return NextResponse.json(
        { success: false, error: "作品不存在" },
        { status: 404 }
      );
    }

    // 获取URL查询参数
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const parentId = searchParams.get("parentId");

    // 计算分页
    const offset = (page - 1) * limit;

    // 构建查询条件
    const parentCondition = parentId
      ? `AND c.parent_id = ${parseInt(parentId)}`
      : `AND c.parent_id IS NULL`;

    // 获取评论总数
    const [countResult] = await sequelize.query(
      `SELECT COUNT(*) as total FROM comments c 
       WHERE c.commentable_type = 'work' AND c.commentable_id = ? ${parentCondition}`,
      {
        replacements: [workId],
        type: QueryTypes.SELECT,
      }
    );

    const totalCount = countResult ? (countResult as any).total : 0;

    // 获取评论列表
    const comments = await sequelize.query(
      `SELECT c.*, u.username, u.avatar_url,
       (SELECT COUNT(*) FROM comments WHERE parent_id = c.id) as replies_count,
       (SELECT COUNT(*) FROM comment_likes WHERE comment_id = c.id) as likes_count
       FROM comments c
       LEFT JOIN users u ON c.user_id = u.id
       WHERE c.commentable_type = 'work' AND c.commentable_id = ? ${parentCondition}
       ORDER BY c.created_at DESC
       LIMIT ? OFFSET ?`,
      {
        replacements: [workId, limit, offset],
        type: QueryTypes.SELECT,
      }
    );

    // 获取当前用户
    const user = await getUserFromRequest(request);
    const userId = user?.id;

    // 如果用户已登录，检查用户是否已点赞评论
    let commentsWithLikeStatus = comments;
    if (userId && comments.length > 0) {
      const commentIds = comments.map((comment: any) => comment.id).join(",");

      const userLikes = await sequelize.query(
        `SELECT comment_id FROM comment_likes 
         WHERE comment_id IN (${commentIds}) AND user_id = ?`,
        {
          replacements: [userId],
          type: QueryTypes.SELECT,
        }
      );

      const likedCommentIds = new Set(
        userLikes.map((like: any) => like.comment_id)
      );

      commentsWithLikeStatus = comments.map((comment: any) => ({
        id: comment.id,
        userId: comment.user_id,
        commentableType: comment.commentable_type,
        commentableId: comment.commentable_id,
        content: comment.content,
        parentId: comment.parent_id,
        likesCount: parseInt(comment.likes_count || 0),
        repliesCount: parseInt(comment.replies_count || 0),
        isPublic: Boolean(comment.is_public),
        createdAt: comment.created_at,
        updatedAt: comment.updated_at,
        isLiked: likedCommentIds.has(comment.id),
        user: {
          id: comment.user_id,
          username: comment.username,
          avatarUrl: comment.avatar_url,
        },
      }));
    } else {
      commentsWithLikeStatus = comments.map((comment: any) => ({
        id: comment.id,
        userId: comment.user_id,
        commentableType: comment.commentable_type,
        commentableId: comment.commentable_id,
        content: comment.content,
        parentId: comment.parent_id,
        likesCount: parseInt(comment.likes_count || 0),
        repliesCount: parseInt(comment.replies_count || 0),
        isPublic: Boolean(comment.is_public),
        createdAt: comment.created_at,
        updatedAt: comment.updated_at,
        isLiked: false,
        user: {
          id: comment.user_id,
          username: comment.username,
          avatarUrl: comment.avatar_url,
        },
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
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json(
        { success: false, error: "未授权" },
        { status: 401 }
      );
    }

    const workId = parseInt(params.id);
    if (isNaN(workId)) {
      return NextResponse.json(
        { success: false, error: "无效的作品ID" },
        { status: 400 }
      );
    }

    // 检查作品是否存在
    const [work] = await sequelize.query("SELECT id FROM works WHERE id = ?", {
      replacements: [workId],
      type: QueryTypes.SELECT,
    });

    if (!work) {
      return NextResponse.json(
        { success: false, error: "作品不存在" },
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
      const [parentComment] = await sequelize.query(
        "SELECT id, commentable_type, commentable_id FROM comments WHERE id = ?",
        {
          replacements: [parentId],
          type: QueryTypes.SELECT,
        }
      );

      if (!parentComment) {
        return NextResponse.json(
          { success: false, error: "父评论不存在" },
          { status: 404 }
        );
      }

      // 确保父评论也属于同一个作品
      if (
        (parentComment as any).commentable_type !== "work" ||
        (parentComment as any).commentable_id !== workId
      ) {
        return NextResponse.json(
          { success: false, error: "父评论不属于此作品" },
          { status: 400 }
        );
      }
    }

    // 创建新评论
    const [result] = await sequelize.query(
      `INSERT INTO comments 
       (user_id, commentable_type, commentable_id, content, parent_id, is_public, created_at, updated_at) 
       VALUES (?, 'work', ?, ?, ?, true, NOW(), NOW())`,
      {
        replacements: [user.id, workId, content.trim(), parentId || null],
        type: QueryTypes.INSERT,
      }
    );

    const newCommentId = Array.isArray(result) ? result[0] : result;

    // 获取新创建的评论详情
    const [newComment] = await sequelize.query(
      `SELECT c.*, u.username, u.avatar_url 
       FROM comments c 
       LEFT JOIN users u ON c.user_id = u.id 
       WHERE c.id = ?`,
      {
        replacements: [newCommentId],
        type: QueryTypes.SELECT,
      }
    );

    // 更新作品的评论计数
    await sequelize.query(
      "UPDATE works SET comments_count = comments_count + 1 WHERE id = ?",
      {
        replacements: [workId],
        type: QueryTypes.UPDATE,
      }
    );

    // 如果是回复，更新父评论的回复计数
    if (parentId) {
      await sequelize.query(
        "UPDATE comments SET replies_count = replies_count + 1 WHERE id = ?",
        {
          replacements: [parentId],
          type: QueryTypes.UPDATE,
        }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        id: (newComment as any).id,
        userId: (newComment as any).user_id,
        commentableType: (newComment as any).commentable_type,
        commentableId: (newComment as any).commentable_id,
        content: (newComment as any).content,
        parentId: (newComment as any).parent_id,
        likesCount: 0,
        repliesCount: 0,
        isPublic: Boolean((newComment as any).is_public),
        createdAt: (newComment as any).created_at,
        updatedAt: (newComment as any).updated_at,
        isLiked: false,
        user: {
          id: (newComment as any).user_id,
          username: (newComment as any).username,
          avatarUrl: (newComment as any).avatar_url,
        },
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
