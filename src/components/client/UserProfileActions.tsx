"use client";

import { useState } from "react";
import { toast } from "react-hot-toast";
import axios from "axios";
import Link from "next/link";
import { UserPlusIcon, UserMinusIcon } from "@heroicons/react/24/outline";

interface UserProfileActionsProps {
  userId: number;
  currentUserId?: number | null;
  initialIsFollowing: boolean;
  initialFollowersCount: number;
}

export default function UserProfileActions({
  userId,
  currentUserId,
  initialIsFollowing,
  initialFollowersCount,
}: UserProfileActionsProps) {
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const [followersCount, setFollowersCount] = useState(initialFollowersCount);
  const [followLoading, setFollowLoading] = useState(false);

  const isOwnProfile = currentUserId === userId;

  const handleFollow = async () => {
    if (!currentUserId) {
      toast.error("请先登录");
      return;
    }

    try {
      setFollowLoading(true);

      if (isFollowing) {
        // 取消关注
        const response = await axios.delete(`/api/users/${userId}/follow`);
        if (response.data.success) {
          setIsFollowing(false);
          setFollowersCount(response.data.data.followersCount);
          toast.success("取消关注成功");
        }
      } else {
        // 关注
        const response = await axios.post(`/api/users/${userId}/follow`);
        if (response.data.success) {
          setIsFollowing(true);
          setFollowersCount(response.data.data.followersCount);
          toast.success("关注成功");
        }
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error || "操作失败");
    } finally {
      setFollowLoading(false);
    }
  };

  if (isOwnProfile) {
    return (
      <Link
        href="/settings/profile"
        className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
      >
        编辑资料
      </Link>
    );
  }

  if (!currentUserId) {
    return (
      <Link
        href="/auth/login"
        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
      >
        <UserPlusIcon className="h-4 w-4 mr-2" />
        关注
      </Link>
    );
  }

  return (
    <button
      onClick={handleFollow}
      disabled={followLoading}
      className={`inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 ${
        isFollowing
          ? "text-gray-700 bg-gray-200 hover:bg-gray-300"
          : "text-white bg-primary-600 hover:bg-primary-700"
      }`}
    >
      {followLoading ? (
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
      ) : isFollowing ? (
        <UserMinusIcon className="h-4 w-4 mr-2" />
      ) : (
        <UserPlusIcon className="h-4 w-4 mr-2" />
      )}
      {isFollowing ? "取消关注" : "关注"}
    </button>
  );
}
