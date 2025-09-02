"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import {
  ClockIcon,
  UserIcon,
  DocumentTextIcon,
  MusicalNoteIcon,
  CheckCircleIcon,
  ArrowDownTrayIcon,
} from "@heroicons/react/24/outline";
import { CheckCircleIcon as CheckCircleSolidIcon } from "@heroicons/react/24/solid";
import RealMidiPlayer from "./RealMidiPlayer";

interface Version {
  id: number;
  version_number: string;
  commit_message: string;
  changes_summary: string;
  midi_file_path: string;
  midi_file_size: number;
  is_merged: boolean;
  merged_at?: string;
  created_at: string;
  submitter_id: number;
  submitter_username: string;
  submitter_avatar?: string;
  merger_id?: number;
  merger_username?: string;
  pr_id?: number;
  pr_title?: string;
  pr_status?: string;
}

interface VersionHistoryProps {
  workId: number;
}

export default function VersionHistory({ workId }: VersionHistoryProps) {
  const [versions, setVersions] = useState<Version[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVersions();
  }, [workId]);

  const fetchVersions = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/works/${workId}/versions`);
      if (response.data.success) {
        setVersions(response.data.data);
      }
    } catch (error: any) {
      console.error("获取版本历史失败:", error);
      toast.error(error.response?.data?.error || "获取版本历史失败");
    } finally {
      setLoading(false);
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
          <ClockIcon className="h-5 w-5 mr-2" />
          版本历史 ({versions.length})
        </h3>
      </div>

      {versions.length === 0 ? (
        <div className="text-center py-8">
          <ClockIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">暂无版本历史</p>
        </div>
      ) : (
        <div className="space-y-4">
          {versions.map((version, index) => (
            <div
              key={version.id}
              className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h4 className="font-medium text-gray-900">
                      {version.version_number}
                    </h4>
                    {version.is_merged && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <CheckCircleSolidIcon className="h-3 w-3 mr-1" />
                        已合并
                      </span>
                    )}
                    {version.pr_status === "pending" && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        <ClockIcon className="h-3 w-3 mr-1" />
                        待审核
                      </span>
                    )}
                  </div>

                  <div className="text-sm text-gray-700 mb-2">
                    {version.commit_message}
                  </div>

                  <div className="flex items-center space-x-4 text-xs text-gray-500 mb-3">
                    <div className="flex items-center">
                      <UserIcon className="h-3 w-3 mr-1" />
                      {version.submitter_username}
                    </div>
                    <div className="flex items-center">
                      <MusicalNoteIcon className="h-3 w-3 mr-1" />
                      {formatFileSize(version.midi_file_size)}
                    </div>
                    <div>
                      {new Date(version.created_at).toLocaleDateString()}
                    </div>
                    {version.merged_at && (
                      <div className="flex items-center">
                        <CheckCircleIcon className="h-3 w-3 mr-1" />
                        合并于{" "}
                        {new Date(version.merged_at).toLocaleDateString()}
                      </div>
                    )}
                  </div>

                  {version.changes_summary && (
                    <div className="bg-gray-50 rounded p-3 mb-3">
                      <div className="text-sm font-medium text-gray-900 mb-1">
                        变更摘要
                      </div>
                      <div className="text-sm text-gray-700">
                        {version.changes_summary}
                      </div>
                    </div>
                  )}

                  {version.pr_title && (
                    <div className="bg-blue-50 rounded p-3 mb-3">
                      <div className="text-sm font-medium text-blue-900 mb-1">
                        协作请求
                      </div>
                      <div className="text-sm text-blue-700">
                        {version.pr_title}
                      </div>
                    </div>
                  )}

                  {version.merger_username && (
                    <div className="text-xs text-gray-500">
                      合并者: {version.merger_username}
                    </div>
                  )}

                  {/* MIDI文件预览 */}
                  <div className="mt-3">
                    <RealMidiPlayer
                      filePath={version.midi_file_path}
                      fileName={`${version.version_number}.mid`}
                      fileSize={version.midi_file_size}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
