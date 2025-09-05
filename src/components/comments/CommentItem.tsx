"use client";

import { useState } from "react";
import { Comment } from "@/types";
import {
  HeartIcon,
  TrashIcon,
  EllipsisVerticalIcon as DotsVerticalIcon,
  ChatBubbleLeftIcon as ReplyIcon,
} from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolidIcon } from "@heroicons/react/24/solid";
import { UserCircleIcon } from "@heroicons/react/24/solid";
import { useAuth } from "@/components/layout/Providers";
import { formatDistanceToNow } from "date-fns";
import { zhCN } from "date-fns/locale";
import CommentForm from "./CommentForm";

interface CommentItemProps {
  comment: Comment;
  onReply: (parentId: number, content: string) => Promise<void>;
  onDelete: (commentId: number) => Promise<void>;
  onLike: (commentId: number, isLiked: boolean) => Promise<void>;
  showReplies?: boolean;
  isReply?: boolean;
}

export default function CommentItem({
  comment,
  onReply,
  onDelete,
  onLike,
  showReplies = false,
  isReply = false,
}: CommentItemProps) {
  const { user: currentUser } = useAuth();
  const [isReplying, setIsReplying] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [likeLoading, setLikeLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const handleReplySubmit = async (content: string) => {
    await onReply(comment.id, content);
    setIsReplying(false);
  };

  const handleLike = async () => {
    if (!currentUser) return;
    if (likeLoading) return;

    setLikeLoading(true);
    try {
      await onLike(comment.id, comment.isLiked || false);
    } finally {
      setLikeLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!currentUser) return;
    if (deleteLoading) return;
    if (!confirm("Are you sure you want to delete this comment?")) return;

    setDeleteLoading(true);
    try {
      await onDelete(comment.id);
    } finally {
      setDeleteLoading(false);
      setShowDropdown(false);
    }
  };

  const canDelete = currentUser && currentUser.id === comment.userId;
  const formattedDate = comment.createdAt
    ? formatDistanceToNow(new Date(comment.createdAt), {
        addSuffix: true,
        locale: zhCN,
      })
    : "";

  return (
    <div
      className={`${
        isReply ? "pl-6 border-l border-gray-200" : ""
      } mb-4 last:mb-0`}
    >
      <div className="flex gap-3">
        {/* User avatar */}
        <div className="flex-shrink-0">
          {comment.user?.avatarUrl ? (
            <img
              src={comment.user.avatarUrl}
              alt={comment.user.username}
              className="w-8 h-8 rounded-full"
            />
          ) : (
            <UserCircleIcon className="w-8 h-8 text-gray-400" />
          )}
        </div>

        {/* Comment content */}
        <div className="flex-1 min-w-0">
          <div className="bg-gray-50 rounded-lg px-4 py-3">
            <div className="flex items-center justify-between mb-1">
              <span className="font-medium text-gray-900">
                {comment.user?.username}
              </span>
              {canDelete && (
                <div className="relative">
                  <button
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <DotsVerticalIcon className="h-4 w-4" />
                  </button>
                  {showDropdown && (
                    <div className="absolute right-0 mt-1 w-40 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                      <button
                        onClick={handleDelete}
                        disabled={deleteLoading}
                        className="flex items-center w-full px-4 py-2 text-sm text-left text-red-600 hover:bg-gray-100"
                      >
                        <TrashIcon className="h-4 w-4 mr-2" />
                        {deleteLoading ? "Deleting..." : "Delete Comment"}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
            <p className="text-gray-800 whitespace-pre-wrap break-words">
              {comment.content}
            </p>
          </div>

          {/* Comment actions */}
          <div className="flex items-center mt-2 text-sm text-gray-500">
            <span className="mr-4">{formattedDate}</span>

            <button
              onClick={handleLike}
              disabled={likeLoading || !currentUser}
              className={`flex items-center mr-4 hover:text-primary-600 ${
                comment.isLiked ? "text-primary-600" : ""
              }`}
            >
              {comment.isLiked ? (
                <HeartSolidIcon className="h-4 w-4 mr-1" />
              ) : (
                <HeartIcon className="h-4 w-4 mr-1" />
              )}
              <span>{comment.likesCount || 0}</span>
            </button>

            {!isReply && (
              <button
                onClick={() => setIsReplying(!isReplying)}
                disabled={!currentUser}
                className="flex items-center hover:text-primary-600"
              >
                <ReplyIcon className="h-4 w-4 mr-1" />
                <span>{isReplying ? "Cancel Reply" : "Reply"}</span>
                {comment.repliesCount > 0 && !showReplies && (
                  <span className="ml-1">({comment.repliesCount})</span>
                )}
              </button>
            )}
          </div>

          {/* Reply form */}
          {isReplying && (
            <div className="mt-3">
              <CommentForm
                onSubmit={handleReplySubmit}
                placeholder={`Reply to ${comment.user?.username}...`}
                submitButtonText="Reply"
                autoFocus
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
