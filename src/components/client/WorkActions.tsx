"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import axios from "axios";
import {
  StarIcon,
  PencilIcon,
  TrashIcon,
  ShareIcon,
} from "@heroicons/react/24/outline";
import { StarIcon as StarSolidIcon } from "@heroicons/react/24/solid";
import Link from "next/link";

interface WorkActionsProps {
  workId: number;
  isOwner: boolean;
  isStarred: boolean;
  starsCount: number;
  title?: string;
  description?: string;
}

export default function WorkActions({
  workId,
  isOwner,
  isStarred: initialIsStarred,
  starsCount: initialStarsCount,
  title,
  description,
}: WorkActionsProps) {
  const router = useRouter();
  const [isStarred, setIsStarred] = useState(initialIsStarred);
  const [starsCount, setStarsCount] = useState(initialStarsCount);
  const [starLoading, setStarLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const handleStar = async () => {
    try {
      setStarLoading(true);

      if (isStarred) {
        // 取消收藏
        const response = await axios.delete(`/api/works/${workId}/star`);
        if (response.data.success) {
          setIsStarred(false);
          setStarsCount(response.data.data.starsCount);
          toast.success("取消收藏成功");
        }
      } else {
        // 收藏
        const response = await axios.post(`/api/works/${workId}/star`);
        if (response.data.success) {
          setIsStarred(true);
          setStarsCount(response.data.data.starsCount);
          toast.success("收藏成功");
        }
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error || "操作失败");
    } finally {
      setStarLoading(false);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title,
        text: description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("链接已复制到剪贴板");
    }
  };

  const handleDelete = async () => {
    // 第一次确认
    if (!confirm("确定要删除这个作品吗？")) {
      return;
    }

    // 第二次确认，防止误操作
    if (!confirm("此操作不可恢复，再次确认要删除吗？")) {
      return;
    }

    try {
      setDeleteLoading(true);

      const response = await axios.delete(`/api/works/${workId}`);

      if (response.data.success) {
        toast.success("作品删除成功");
        router.push(`/users/${response.data.data.userId}`);
      } else {
        toast.error(response.data.error || "删除失败");
      }
    } catch (error: any) {
      console.error("删除作品失败:", error);
      if (error.response?.status === 403) {
        toast.error("您没有权限删除此作品");
      } else if (error.response?.status === 404) {
        toast.error("作品不存在");
      } else {
        toast.error(error.response?.data?.error || "删除失败，请稍后重试");
      }
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="flex items-center space-x-2 ml-4">
      {isOwner && (
        <>
          <Link
            href={`/works/${workId}/edit`}
            className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <PencilIcon className="h-4 w-4 mr-1" />
            编辑
          </Link>
          <button
            onClick={handleDelete}
            disabled={deleteLoading}
            className="inline-flex items-center px-3 py-2 border border-red-300 rounded-md text-sm font-medium text-red-700 bg-white hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {deleteLoading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
            ) : (
              <TrashIcon className="h-4 w-4 mr-1" />
            )}
            {deleteLoading ? "删除中..." : "删除"}
          </button>
        </>
      )}

      <button
        onClick={handleStar}
        disabled={starLoading || isOwner}
        className={`inline-flex items-center px-4 py-2 border border-transparent rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 ${
          isStarred
            ? "text-white bg-yellow-500 hover:bg-yellow-600"
            : "text-primary-700 bg-primary-100 hover:bg-primary-200"
        } ${isOwner ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        {starLoading ? (
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
        ) : isStarred ? (
          <StarSolidIcon className="h-4 w-4 mr-2" />
        ) : (
          <StarIcon className="h-4 w-4 mr-2" />
        )}
        {isStarred ? "已收藏" : "收藏"} ({starsCount})
      </button>

      <button
        onClick={handleShare}
        className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
      >
        <ShareIcon className="h-4 w-4 mr-1" />
        分享
      </button>
    </div>
  );
}
