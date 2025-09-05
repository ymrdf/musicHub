"use client";

import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/components/layout/Providers";
import { UserCircleIcon } from "@heroicons/react/24/solid";

interface CommentFormProps {
  onSubmit: (content: string) => Promise<void>;
  placeholder?: string;
  submitButtonText?: string;
  autoFocus?: boolean;
}

export default function CommentForm({
  onSubmit,
  placeholder = "Write your comment...",
  submitButtonText = "Post Comment",
  autoFocus = false,
}: CommentFormProps) {
  const { user } = useAuth();
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (autoFocus && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [autoFocus]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || isSubmitting || !user) return;

    setIsSubmitting(true);
    try {
      await onSubmit(content);
      setContent("");
    } catch (error) {
      console.error("Failed to submit comment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Auto-adjust textarea height
  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const textarea = e.target;
    setContent(textarea.value);

    // Reset height
    textarea.style.height = "auto";
    // Set new height
    textarea.style.height = `${textarea.scrollHeight}px`;
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center py-4 bg-gray-50 rounded-lg">
        <p className="text-gray-500">Please login to post comments</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-3">
      <div className="flex-shrink-0">
        {user.avatarUrl ? (
          <img
            src={user.avatarUrl}
            alt={user.username}
            className="w-8 h-8 rounded-full"
          />
        ) : (
          <UserCircleIcon className="w-8 h-8 text-gray-400" />
        )}
      </div>
      <div className="flex-1">
        <textarea
          ref={textareaRef}
          value={content}
          onChange={handleTextareaChange}
          placeholder={placeholder}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none min-h-[80px]"
          rows={1}
        />
        <div className="flex justify-end mt-2">
          <button
            type="submit"
            disabled={!content.trim() || isSubmitting}
            className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Submitting..." : submitButtonText}
          </button>
        </div>
      </div>
    </form>
  );
}
