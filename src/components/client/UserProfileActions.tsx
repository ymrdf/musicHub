"use client";

import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import axios from "axios";
import Link from "next/link";
import { UserPlusIcon, UserMinusIcon } from "@heroicons/react/24/outline";
import { useAuth } from "@/components/layout/Providers";

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
  const { user } = useAuth();
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const [followersCount, setFollowersCount] = useState(initialFollowersCount);
  const [followLoading, setFollowLoading] = useState(false);

  // 使用客户端获取的用户信息，如果服务端没有提供的话
  const actualCurrentUserId = currentUserId || user?.id || null;
  const isOwnProfile = actualCurrentUserId === userId;

  // 检查是否已经关注了该用户
  useEffect(() => {
    const checkFollowStatus = async () => {
      if (!actualCurrentUserId || isOwnProfile) return;

      try {
        const response = await axios.get(`/api/users/${userId}/follow-status`);
        if (response.data.success) {
          setIsFollowing(response.data.data.isFollowing);
        }
      } catch (error) {
        console.error("检查关注状态失败:", error);
      }
    };

    checkFollowStatus();
  }, [actualCurrentUserId, userId, isOwnProfile]);

  const handleFollow = async () => {
    if (!actualCurrentUserId) {
      toast.error("Please login first");
      return;
    }

    try {
      setFollowLoading(true);

      if (isFollowing) {
        // Unfollow
        const response = await axios.delete(`/api/users/${userId}/follow`);
        if (response.data.success) {
          setIsFollowing(false);
          setFollowersCount(response.data.data.followersCount);
          toast.success("Unfollowed successfully");
        }
      } else {
        // Follow
        const response = await axios.post(`/api/users/${userId}/follow`);
        if (response.data.success) {
          setIsFollowing(true);
          setFollowersCount(response.data.data.followersCount);
          toast.success("Followed successfully");
        }
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Operation failed");
    } finally {
      setFollowLoading(false);
    }
  };

  if (isOwnProfile) {
    return null;
    // return (
    //   <Link
    //     href="/settings/profile"
    //     className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
    //   >
    //     Edit Profile
    //   </Link>
    // );
  }

  if (!actualCurrentUserId) {
    return (
      <Link
        href="/auth/login"
        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
      >
        <UserPlusIcon className="h-4 w-4 mr-2" />
        Follow
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
      {isFollowing ? "Unfollow" : "Follow"}
    </button>
  );
}
