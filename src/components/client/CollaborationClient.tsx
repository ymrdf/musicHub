"use client";

import { useState } from "react";
import CollaborationModal from "../works/CollaborationModal";
import { CodeBracketIcon } from "@heroicons/react/24/outline";

interface CollaborationClientProps {
  workId: number;
  workTitle: string;
  allowCollaboration: boolean;
}

export default function CollaborationClient({
  workId,
  workTitle,
  allowCollaboration,
}: CollaborationClientProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (!allowCollaboration) {
    return null;
  }

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSuccess = () => {
    // 可以在这里添加成功提交后的逻辑，比如刷新协作列表
  };

  return (
    <>
      <button
        onClick={handleOpenModal}
        className="w-full inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
      >
        <CodeBracketIcon className="h-4 w-4 mr-2" />
        提交协作
      </button>

      {/* 协作模态框 */}
      <CollaborationModal
        workId={workId}
        workTitle={workTitle}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSuccess={handleSuccess}
      />
    </>
  );
}
