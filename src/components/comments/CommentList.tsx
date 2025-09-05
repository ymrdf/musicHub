import { useState, useEffect } from "react";
import { Comment, ApiResponse, PaginatedResponse } from "@/types";
import CommentItem from "./CommentItem";
import CommentForm from "./CommentForm";
import { useAuth } from "@/components/layout/Providers";

interface CommentListProps {
  performanceId: number;
}

export default function CommentList({ performanceId }: CommentListProps) {
  const { user } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Fetch comments list
  const fetchComments = async (pageNum = 1, append = false) => {
    try {
      setLoading(true);
      // Get authentication token
      const token = localStorage.getItem("token");

      const response = await fetch(
        `/api/performances/${performanceId}/comments?page=${pageNum}&limit=10`,
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch comments");
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
        throw new Error(data.error || "Failed to fetch comments");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Load more comments
  const loadMoreComments = () => {
    if (hasMore && !loading) {
      fetchComments(page + 1, true);
    }
  };

  // Submit new comment
  const handleSubmitComment = async (content: string) => {
    if (!user) return;

    setSubmitting(true);
    try {
      // Get authentication token
      const token = localStorage.getItem("token");

      const response = await fetch(
        `/api/performances/${performanceId}/comments`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : "",
          },
          body: JSON.stringify({ content }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to submit comment");
      }

      const data = await response.json();

      if (data.success && data.data) {
        // Add new comment to top of list
        setComments((prev) => [data.data, ...prev]);
      } else {
        throw new Error(data.error || "Failed to submit comment");
      }
    } catch (err: any) {
      console.error("Failed to submit comment:", err);
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  // Submit reply
  const handleSubmitReply = async (parentId: number, content: string) => {
    if (!user) return;

    try {
      // Get authentication token
      const token = localStorage.getItem("token");

      const response = await fetch(
        `/api/performances/${performanceId}/comments`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : "",
          },
          body: JSON.stringify({ content, parentId }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to submit reply");
      }

      const data = await response.json();

      if (data.success && data.data) {
        // Update parent comment reply count
        setComments((prev) =>
          prev.map((comment) =>
            comment.id === parentId
              ? { ...comment, repliesCount: (comment.repliesCount || 0) + 1 }
              : comment
          )
        );
      } else {
        throw new Error(data.error || "Failed to submit reply");
      }
    } catch (err: any) {
      console.error("Failed to submit reply:", err);
      alert(err.message);
    }
  };

  // Delete comment
  const handleDeleteComment = async (commentId: number) => {
    try {
      // Get authentication token
      const token = localStorage.getItem("token");

      const response = await fetch(`/api/comments/${commentId}`, {
        method: "DELETE",
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete comment");
      }

      const data = await response.json();

      if (data.success) {
        // Remove comment from list
        setComments((prev) =>
          prev.filter((comment) => comment.id !== commentId)
        );
      } else {
        throw new Error(data.error || "Failed to delete comment");
      }
    } catch (err: any) {
      console.error("Failed to delete comment:", err);
      alert(err.message);
    }
  };

  // Like/unlike comment
  const handleLikeComment = async (commentId: number, isLiked: boolean) => {
    if (!user) {
      alert("Please login first");
      return;
    }

    try {
      // Get authentication token
      const token = localStorage.getItem("token");

      if (!token) {
        alert("Please login first");
        return;
      }

      const method = isLiked ? "DELETE" : "POST";
      const response = await fetch(`/api/comments/${commentId}/like`, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || (isLiked ? "取消Failed to like" : "Failed to like")
        );
      }

      const data = await response.json();

      if (data.success) {
        // Update comment like status and count
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
        throw new Error(
          data.error || (isLiked ? "取消Failed to like" : "Failed to like")
        );
      }
    } catch (err: any) {
      console.error(isLiked ? "取消Failed to like" : "Failed to like", err);
      alert(err.message);
    }
  };

  // Initial load comments
  useEffect(() => {
    if (performanceId) {
      fetchComments();
    }
  }, [performanceId]);

  return (
    <div>
      {/* Comment form */}
      <div className="mb-6">
        <CommentForm onSubmit={handleSubmitComment} />
      </div>

      {/* Comment list */}
      {loading && comments.length === 0 ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
      ) : error ? (
        <div className="text-center py-8 text-red-500">{error}</div>
      ) : comments.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No comments yet, be the first to comment!
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

          {/* Load more button */}
          {hasMore && (
            <div className="text-center pt-4">
              <button
                onClick={loadMoreComments}
                disabled={loading}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                {loading ? "Loading..." : "Load More Comments"}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
