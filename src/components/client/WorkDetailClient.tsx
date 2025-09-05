"use client";

import { useState } from "react";
import WorkCommentList from "../comments/WorkCommentList";
import PerformanceList from "../works/PerformanceList";
import CollaborationList from "../works/CollaborationList";
import VersionHistory from "../works/VersionHistory";

interface WorkDetailClientProps {
  workId: number;
  isOwner: boolean;
  performancesCount: number;
  allowCollaboration: boolean;
}

export default function WorkDetailClient({
  workId,
  isOwner,
  performancesCount,
  allowCollaboration,
}: WorkDetailClientProps) {
  const [activeTab, setActiveTab] = useState("performances");

  return (
    <>
      {/* 标签页导航 */}
      <div className="mb-6">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab("performances")}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === "performances"
                ? "border-primary-500 text-primary-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            演奏 ({performancesCount})
          </button>

          {allowCollaboration && (
            <button
              onClick={() => setActiveTab("collaborations")}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "collaborations"
                  ? "border-primary-500 text-primary-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              协作请求
            </button>
          )}

          <button
            onClick={() => setActiveTab("versions")}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === "versions"
                ? "border-primary-500 text-primary-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            版本历史
          </button>
        </nav>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 主要内容区域 */}
        <div className="lg:col-span-2">
          {activeTab === "performances" && (
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  相关演奏 ({performancesCount})
                </h2>
              </div>

              <PerformanceList workId={workId} />
            </div>
          )}

          {activeTab === "collaborations" && allowCollaboration && (
            <CollaborationList workId={workId} isOwner={isOwner} />
          )}

          {activeTab === "versions" && <VersionHistory workId={workId} />}
        </div>

        {/* 评论区 */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">评论</h3>

            <WorkCommentList workId={workId} />
          </div>
        </div>
      </div>
    </>
  );
}
