"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import {
  CodeBracketIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  UserIcon,
  DocumentTextIcon,
  MusicalNoteIcon,
} from "@heroicons/react/24/outline";
import {
  CheckCircleIcon as CheckCircleSolidIcon,
  XCircleIcon as XCircleSolidIcon,
} from "@heroicons/react/24/solid";

interface CollaborationRequest {
  id: number;
  title: string;
  description: string;
  status: "pending" | "approved" | "rejected" | "merged";
  created_at: string;
  updated_at: string;
  review_comment?: string;
  reviewed_at?: string;
  version_number: string;
  commit_message: string;
  changes_summary: string;
  midi_file_path: string;
  midi_file_size: number;
  requester_id: number;
  requester_username: string;
  requester_avatar?: string;
  reviewer_id?: number;
  reviewer_username?: string;
}

interface CollaborationListProps {
  workId: number;
  isOwner: boolean;
}

export default function CollaborationList({
  workId,
  isOwner,
}: CollaborationListProps) {
  const [collaborations, setCollaborations] = useState<CollaborationRequest[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<number | null>(null);
  const [reviewComment, setReviewComment] = useState("");

  useEffect(() => {
    fetchCollaborations();
  }, [workId]);

  const fetchCollaborations = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/works/${workId}/collaborations`);
      if (response.data.success) {
        setCollaborations(response.data.data);
      }
    } catch (error: any) {
      console.error("获取协作请求失败:", error);
      toast.error(error.response?.data?.error || "获取协作请求失败");
    } finally {
      setLoading(false);
    }
  };

  const handleReview = async (prId: number, action: "approve" | "reject") => {
    if (
      !confirm(
        `确定要${action === "approve" ? "接受" : "拒绝"}这个协作请求吗？`
      )
    ) {
      return;
    }

    try {
      setProcessingId(prId);
      const response = await axios.put(
        `/api/works/${workId}/collaborations/${prId}`,
        {
          action,
          reviewComment: reviewComment.trim() || undefined,
        }
      );

      if (response.data.success) {
        toast.success(response.data.data.message);
        setReviewComment("");
        fetchCollaborations(); // 重新获取数据
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error || "操作失败");
    } finally {
      setProcessingId(null);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <ClockIcon className="h-5 w-5 text-yellow-500" />;
      case "approved":
        return <CheckCircleSolidIcon className="h-5 w-5 text-green-500" />;
      case "rejected":
        return <XCircleSolidIcon className="h-5 w-5 text-red-500" />;
      case "merged":
        return <CheckCircleSolidIcon className="h-5 w-5 text-blue-500" />;
      default:
        return <ClockIcon className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "待审核";
      case "approved":
        return "已接受";
      case "rejected":
        return "已拒绝";
      case "merged":
        return "已合并";
      default:
        return "未知状态";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "approved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "merged":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatFileSize = (bytes: number) => {
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + " " + sizes[i];
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          <span className="ml-2 text-gray-600">加载中...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <CodeBracketIcon className="h-5 w-5 mr-2" />
          协作请求 ({collaborations.length})
        </h3>
      </div>

      {collaborations.length === 0 ? (
        <div className="text-center py-8">
          <CodeBracketIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">暂无协作请求</p>
        </div>
      ) : (
        <div className="space-y-4">
          {collaborations.map((collab) => (
            <div
              key={collab.id}
              className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h4 className="font-medium text-gray-900">
                      {collab.title}
                    </h4>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                        collab.status
                      )}`}
                    >
                      {getStatusIcon(collab.status)}
                      <span className="ml-1">
                        {getStatusText(collab.status)}
                      </span>
                    </span>
                  </div>

                  {collab.description && (
                    <p className="text-sm text-gray-600 mb-2">
                      {collab.description}
                    </p>
                  )}

                  <div className="flex items-center space-x-4 text-xs text-gray-500 mb-3">
                    <div className="flex items-center">
                      <UserIcon className="h-3 w-3 mr-1" />
                      {collab.requester_username}
                    </div>
                    <div className="flex items-center">
                      <DocumentTextIcon className="h-3 w-3 mr-1" />
                      {collab.version_number}
                    </div>
                    <div className="flex items-center">
                      <MusicalNoteIcon className="h-3 w-3 mr-1" />
                      {formatFileSize(collab.midi_file_size)}
                    </div>
                    <div>
                      {new Date(collab.created_at).toLocaleDateString()}
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded p-3 mb-3">
                    <div className="text-sm font-medium text-gray-900 mb-1">
                      提交信息
                    </div>
                    <div className="text-sm text-gray-700 mb-2">
                      {collab.commit_message}
                    </div>
                    {collab.changes_summary && (
                      <div className="text-sm text-gray-600">
                        <span className="font-medium">变更摘要：</span>
                        {collab.changes_summary}
                      </div>
                    )}
                  </div>

                  {collab.review_comment && (
                    <div className="bg-blue-50 rounded p-3 mb-3">
                      <div className="text-sm font-medium text-blue-900 mb-1">
                        审核意见
                      </div>
                      <div className="text-sm text-blue-700">
                        {collab.review_comment}
                      </div>
                    </div>
                  )}
                </div>

                {isOwner && collab.status === "pending" && (
                  <div className="ml-4 flex flex-col space-y-2">
                    <button
                      onClick={() => handleReview(collab.id, "approve")}
                      disabled={processingId === collab.id}
                      className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {processingId === collab.id ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-1"></div>
                      ) : (
                        <CheckCircleIcon className="h-4 w-4 mr-1" />
                      )}
                      接受
                    </button>
                    <button
                      onClick={() => handleReview(collab.id, "reject")}
                      disabled={processingId === collab.id}
                      className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {processingId === collab.id ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-1"></div>
                      ) : (
                        <XCircleIcon className="h-4 w-4 mr-1" />
                      )}
                      拒绝
                    </button>
                  </div>
                )}
              </div>

              {isOwner && collab.status === "pending" && (
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <textarea
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    placeholder="添加审核意见（可选）..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    rows={2}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
