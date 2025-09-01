import { useState, useEffect } from "react";
import { Comment, ApiResponse, PaginatedResponse } from "@/types";
import CommentItem from "./CommentItem";
import CommentForm from "./CommentForm";
import { useAuth } from "@/components/layout/Providers";

interface WorkCommentListProps {
  workId: number;
}

export default function WorkCommentList({ workId }: WorkCommentListProps) {
  const { user } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // 获取评论列表
  const fetchComments = async (pageNum = 1, append = false) => {
    try {
      setLoading(true);
      // 获取认证令牌
      const token = localStorage.getItem("token");

      const response = await fetch(
        `/api/works/${workId}/comments?page=${pageNum}&limit=10`,
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
        }
      );

      if (!response.ok) {
        throw new Error("获取评论失败");
      }

      const data: ApiResponse<PaginatedResponse<Comment>> =
        await response.json();

      if (data.success && data.data) {
        if (append) {
          setComments((prev) => [...prev, ...data.data!.items]);
        } else {
          setComments(data.data.items);
        }
        setHasMore(data.data.page < data.data.totalPages);
        setPage(data.data.page);
      } else {
        throw new Error(data.error || "获取评论失败");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 加载更多评论
  const loadMoreComments = () => {
    if (hasMore && !loading) {
      fetchComments(page + 1, true);
    }
  };

  // 提交新评论
  const handleSubmitComment = async (content: string) => {
    if (!user) return;

    setSubmitting(true);
    try {
      // 获取认证令牌
      const token = localStorage.getItem("token");

      const response = await fetch(`/api/works/${workId}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify({ content }),
      });

      if (!response.ok) {
        throw new Error("提交评论失败");
      }

      const data = await response.json();

      if (data.success && data.data) {
        // 将新评论添加到列表顶部
        setComments((prev) => [data.data, ...prev]);
      } else {
        throw new Error(data.error || "提交评论失败");
      }
    } catch (err: any) {
      console.error("提交评论失败:", err);
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  // 提交回复
  const handleSubmitReply = async (parentId: number, content: string) => {
    if (!user) return;

    try {
      // 获取认证令牌
      const token = localStorage.getItem("token");

      const response = await fetch(`/api/works/${workId}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify({ content, parentId }),
      });

      if (!response.ok) {
        throw new Error("提交回复失败");
      }

      const data = await response.json();

      if (data.success && data.data) {
        // 更新父评论的回复计数
        setComments((prev) =>
          prev.map((comment) =>
            comment.id === parentId
              ? { ...comment, repliesCount: (comment.repliesCount || 0) + 1 }
              : comment
          )
        );
      } else {
        throw new Error(data.error || "提交回复失败");
      }
    } catch (err: any) {
      console.error("提交回复失败:", err);
      alert(err.message);
    }
  };

  // 删除评论
  const handleDeleteComment = async (commentId: number) => {
    try {
      // 获取认证令牌
      const token = localStorage.getItem("token");

      const response = await fetch(`/api/comments/${commentId}`, {
        method: "DELETE",
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      });

      if (!response.ok) {
        throw new Error("删除评论失败");
      }

      const data = await response.json();

      if (data.success) {
        // 从列表中移除评论
        setComments((prev) =>
          prev.filter((comment) => comment.id !== commentId)
        );
      } else {
        throw new Error(data.error || "删除评论失败");
      }
    } catch (err: any) {
      console.error("删除评论失败:", err);
      alert(err.message);
    }
  };

  // 点赞/取消点赞评论
  const handleLikeComment = async (commentId: number, isLiked: boolean) => {
    if (!user) return;

    try {
      // 获取认证令牌
      const token = localStorage.getItem("token");

      const method = isLiked ? "DELETE" : "POST";
      const response = await fetch(`/api/comments/${commentId}/like`, {
        method,
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      });

      if (!response.ok) {
        throw new Error(isLiked ? "取消点赞失败" : "点赞失败");
      }

      const data = await response.json();

      if (data.success) {
        // 更新评论的点赞状态和计数
        setComments((prev) =>
          prev.map((comment) =>
            comment.id === commentId
              ? {
                  ...comment,
                  isLiked: !isLiked,
                  likesCount: isLiked
                    ? (comment.likesCount || 0) - 1
                    : (comment.likesCount || 0) + 1,
                }
              : comment
          )
        );
      } else {
        throw new Error(data.error || (isLiked ? "取消点赞失败" : "点赞失败"));
      }
    } catch (err: any) {
      console.error(isLiked ? "取消点赞失败" : "点赞失败", err);
    }
  };

  // 初始加载评论
  useEffect(() => {
    if (workId) {
      fetchComments();
    }
  }, [workId]);

  return (
    <div>
      {/* 评论表单 */}
      <div className="mb-6">
        <CommentForm onSubmit={handleSubmitComment} />
      </div>

      {/* 评论列表 */}
      {loading && comments.length === 0 ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
      ) : error ? (
        <div className="text-center py-8 text-red-500">{error}</div>
      ) : comments.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          暂无评论，快来发表第一条评论吧！
        </div>
      ) : (
        <div className="space-y-6">
          {comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              onReply={handleSubmitReply}
              onDelete={handleDeleteComment}
              onLike={handleLikeComment}
            />
          ))}

          {/* 加载更多按钮 */}
          {hasMore && (
            <div className="text-center pt-4">
              <button
                onClick={loadMoreComments}
                disabled={loading}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                {loading ? "加载中..." : "加载更多评论"}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
