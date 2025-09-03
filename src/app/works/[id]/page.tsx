"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/components/layout/Providers";
import {
  StarIcon,
  EyeIcon,
  PlayIcon,
  ChatBubbleLeftIcon,
  DocumentArrowDownIcon,
  MusicalNoteIcon,
  UserIcon,
  CalendarIcon,
  TagIcon,
  PencilIcon,
  TrashIcon,
  ShareIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  ArrowsPointingOutIcon,
  ArrowsPointingInIcon,
  CodeBracketIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";
import { StarIcon as StarSolidIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import axios from "axios";
import { toast } from "react-hot-toast";
import PerformanceList from "@/components/works/PerformanceList";
import WorkCommentList from "@/components/comments/WorkCommentList";
import CollaborationList from "@/components/works/CollaborationList";
import VersionHistory from "@/components/works/VersionHistory";
import CollaborationModal from "@/components/works/CollaborationModal";
import RealMidiPlayer from "@/components/works/RealMidiPlayer";

interface WorkDetail {
  id: number;
  title: string;
  description?: string;
  pdfFilePath?: string;
  midiFilePath?: string;
  pdfFileSize?: number;
  midiFileSize?: number;
  starsCount: number;
  performancesCount: number;
  commentsCount: number;
  viewsCount: number;
  isPublic: boolean;
  allowCollaboration: boolean;
  license: string;
  createdAt: string;
  updatedAt: string;
  user: {
    id: number;
    username: string;
    avatarUrl?: string;
    isVerified: boolean;
    bio?: string;
  };
  genre?: {
    id: number;
    name: string;
    description?: string;
  };
  instrument?: {
    id: number;
    name: string;
    description?: string;
  };
  purpose?: {
    id: number;
    name: string;
    description?: string;
  };
  tags: Array<{
    id: number;
    name: string;
    color: string;
  }>;
  isStarred: boolean;
  isOwner: boolean;
}

export default function WorkDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user: currentUser } = useAuth();
  const [work, setWork] = useState<WorkDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [starLoading, setStarLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [pdfScale, setPdfScale] = useState(1);
  const [showPdfViewer, setShowPdfViewer] = useState(true);
  const [activeTab, setActiveTab] = useState("performances");
  const [showCollaborationModal, setShowCollaborationModal] = useState(false);

  const workId = params.id as string;

  useEffect(() => {
    if (workId) {
      fetchWorkDetail();
    }
  }, [workId]);

  const fetchWorkDetail = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/works/${workId}`);
      if (response.data.success) {
        setWork(response.data.data);
      }
    } catch (error: any) {
      if (error.response?.status === 404) {
        toast.error("作品不存在");
        router.push("/works");
      } else if (error.response?.status === 403) {
        toast.error("无权访问此作品");
        router.push("/works");
      } else {
        toast.error(error.response?.data?.error || "获取作品详情失败");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleStar = async () => {
    if (!currentUser) {
      toast.error("请先登录");
      router.push("/auth/login");
      return;
    }

    if (!work) return;

    try {
      setStarLoading(true);

      if (work.isStarred) {
        // 取消收藏
        const response = await axios.delete(`/api/works/${workId}/star`);
        if (response.data.success) {
          setWork((prev) =>
            prev
              ? {
                  ...prev,
                  isStarred: false,
                  starsCount: response.data.data.starsCount,
                }
              : null
          );
          toast.success("取消收藏成功");
        }
      } else {
        // 收藏
        const response = await axios.post(`/api/works/${workId}/star`);
        if (response.data.success) {
          setWork((prev) =>
            prev
              ? {
                  ...prev,
                  isStarred: true,
                  starsCount: response.data.data.starsCount,
                }
              : null
          );
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
        title: work?.title,
        text: work?.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("链接已复制到剪贴板");
    }
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return "";
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + " " + sizes[i];
  };

  const handleZoomIn = () => {
    setPdfScale((prev) => Math.min(prev + 0.2, 3));
  };

  const handleZoomOut = () => {
    setPdfScale((prev) => Math.max(prev - 0.2, 0.5));
  };

  const handleResetZoom = () => {
    setPdfScale(1);
  };

  const handleDelete = async () => {
    if (!work) return;

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

      const response = await axios.delete(`/api/works/${work.id}`);

      if (response.data.success) {
        toast.success("作品删除成功");
        // 删除成功后跳转到用户主页
        if (currentUser) {
          router.push(`/users/${currentUser.id}`);
        } else {
          router.push("/works");
        }
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">加载中...</p>
        </div>
      </div>
    );
  }

  if (!work) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <MusicalNoteIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">作品不存在</h2>
          <p className="text-gray-600">您访问的作品不存在或已被删除</p>
          <Link
            href="/works"
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
          >
            浏览更多作品
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 作品头部信息 */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row lg:items-start lg:space-x-8">
            {/* 左侧：作品信息 */}
            <div className="flex-1">
              <div className="flex items-start justify-between mb-4">
                <h1 className="text-3xl font-bold text-gray-900 flex-1">
                  {work.title}
                </h1>

                {/* 操作按钮 */}
                <div className="flex items-center space-x-2 ml-4">
                  {work.isOwner && (
                    <>
                      <Link
                        href={`/works/${work.id}/edit`}
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
                    disabled={starLoading || work.isOwner}
                    className={`inline-flex items-center px-4 py-2 border border-transparent rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 ${
                      work.isStarred
                        ? "text-white bg-yellow-500 hover:bg-yellow-600"
                        : "text-primary-700 bg-primary-100 hover:bg-primary-200"
                    } ${work.isOwner ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    {starLoading ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                    ) : work.isStarred ? (
                      <StarSolidIcon className="h-4 w-4 mr-2" />
                    ) : (
                      <StarIcon className="h-4 w-4 mr-2" />
                    )}
                    {work.isStarred ? "已收藏" : "收藏"} ({work.starsCount})
                  </button>

                  <button
                    onClick={handleShare}
                    className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                  >
                    <ShareIcon className="h-4 w-4 mr-1" />
                    分享
                  </button>
                </div>
              </div>

              {/* 作者信息 */}
              <div className="flex items-center space-x-4 mb-6">
                <Link
                  href={`/users/${work.user.id}`}
                  className="flex items-center space-x-2 hover:text-primary-600"
                >
                  {work.user.avatarUrl ? (
                    <img
                      src={work.user.avatarUrl}
                      alt={work.user.username}
                      className="h-8 w-8 rounded-full"
                    />
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center">
                      <UserIcon className="h-5 w-5 text-primary-600" />
                    </div>
                  )}
                  <span className="font-medium">{work.user.username}</span>
                  {work.user.isVerified && (
                    <span className="text-primary-500" title="已验证用户">
                      ✓
                    </span>
                  )}
                </Link>

                <span className="text-gray-300">•</span>

                <div className="flex items-center text-sm text-gray-500">
                  <CalendarIcon className="h-4 w-4 mr-1" />
                  {new Date(work.createdAt).toLocaleDateString()}
                </div>
              </div>

              {/* 描述 */}
              {work.description && (
                <div className="mb-6">
                  <p className="text-gray-700 whitespace-pre-wrap">
                    {work.description}
                  </p>
                </div>
              )}

              {/* 分类和标签 */}
              <div className="space-y-3 mb-6">
                {/* 分类信息 */}
                <div className="flex flex-wrap gap-4 text-sm">
                  {work.genre && (
                    <div className="flex items-center">
                      <span className="text-gray-500 mr-1">曲种:</span>
                      <span className="font-medium">{work.genre.name}</span>
                    </div>
                  )}
                  {work.instrument && (
                    <div className="flex items-center">
                      <span className="text-gray-500 mr-1">乐器:</span>
                      <span className="font-medium">
                        {work.instrument.name}
                      </span>
                    </div>
                  )}
                  {work.purpose && (
                    <div className="flex items-center">
                      <span className="text-gray-500 mr-1">用途:</span>
                      <span className="font-medium">{work.purpose.name}</span>
                    </div>
                  )}
                </div>

                {/* 标签 */}
                {work.tags.length > 0 && (
                  <div className="flex items-center space-x-2">
                    <TagIcon className="h-4 w-4 text-gray-500" />
                    <div className="flex flex-wrap gap-2">
                      {work.tags.map((tag) => (
                        <span
                          key={tag.id}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                          style={{
                            backgroundColor: tag.color + "20",
                            color: tag.color,
                          }}
                        >
                          {tag.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* 统计信息 */}
              <div className="flex space-x-6 text-sm text-gray-500">
                <div className="flex items-center">
                  <EyeIcon className="h-4 w-4 mr-1" />
                  {work.viewsCount} 浏览
                </div>
                <div className="flex items-center">
                  <StarIcon className="h-4 w-4 mr-1" />
                  {work.starsCount} 收藏
                </div>
                <div className="flex items-center">
                  <PlayIcon className="h-4 w-4 mr-1" />
                  {work.performancesCount} 演奏
                </div>
                <div className="flex items-center">
                  <ChatBubbleLeftIcon className="h-4 w-4 mr-1" />
                  {work.commentsCount} 评论
                </div>
              </div>
            </div>

            {/* 右侧：文件下载 */}
            <div className="lg:w-80 mt-8 lg:mt-0">
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  文件下载
                </h3>

                <div className="space-y-3">
                  {work.pdfFilePath && (
                    <a
                      href={work.pdfFilePath}
                      download
                      className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:border-primary-300 bg-white transition-colors duration-200"
                    >
                      <div className="flex items-center">
                        <DocumentArrowDownIcon className="h-8 w-8 text-red-500 mr-3" />
                        <div>
                          <div className="font-medium text-gray-900">
                            PDF 乐谱
                          </div>
                          <div className="text-xs text-gray-500">
                            {formatFileSize(work.pdfFileSize)}
                          </div>
                        </div>
                      </div>
                      <DocumentArrowDownIcon className="h-5 w-5 text-gray-400" />
                    </a>
                  )}

                  {work.midiFilePath && (
                    <a
                      href={work.midiFilePath}
                      download
                      className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:border-primary-300 bg-white transition-colors duration-200"
                    >
                      <div className="flex items-center">
                        <MusicalNoteIcon className="h-8 w-8 text-blue-500 mr-3" />
                        <div>
                          <div className="font-medium text-gray-900">
                            MIDI 文件
                          </div>
                          <div className="text-xs text-gray-500">
                            {formatFileSize(work.midiFileSize)}
                          </div>
                        </div>
                      </div>
                      <DocumentArrowDownIcon className="h-5 w-5 text-gray-400" />
                    </a>
                  )}
                </div>

                {/* 许可证信息 */}
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="text-sm">
                    <span className="text-gray-500">许可证: </span>
                    <span className="font-medium">{work.license}</span>
                  </div>
                  {work.allowCollaboration && (
                    <div className="mt-2 text-xs text-gray-500">
                      ✓ 允许协作贡献
                    </div>
                  )}
                </div>
              </div>

              {/* 其他操作 */}
              {currentUser && !work.isOwner && (
                <div className="mt-4 space-y-2">
                  <Link
                    href={`/performances/new?workId=${work.id}`}
                    className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
                  >
                    <PlayIcon className="h-4 w-4 mr-2" />
                    我要演奏
                  </Link>

                  {work.allowCollaboration && (
                    <button
                      onClick={() => setShowCollaborationModal(true)}
                      className="w-full inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                    >
                      <CodeBracketIcon className="h-4 w-4 mr-2" />
                      提交协作
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* PDF乐谱预览区域 */}
      {work.pdfFilePath && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-lg shadow">
            {/* 工具栏 */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <div className="flex items-center space-x-4">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                  <DocumentArrowDownIcon className="h-6 w-6 text-red-500 mr-2" />
                  乐谱预览
                </h2>
                <button
                  onClick={() => setShowPdfViewer(!showPdfViewer)}
                  className="inline-flex items-center px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900"
                >
                  {showPdfViewer ? "隐藏预览" : "显示预览"}
                </button>
              </div>

              {showPdfViewer && (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleZoomOut}
                    disabled={pdfScale <= 0.5}
                    className="p-2 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
                    title="缩小"
                  >
                    <ArrowsPointingInIcon className="h-4 w-4" />
                  </button>
                  <span className="text-sm text-gray-600 min-w-[60px] text-center">
                    {Math.round(pdfScale * 100)}%
                  </span>
                  <button
                    onClick={handleZoomIn}
                    disabled={pdfScale >= 3}
                    className="p-2 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
                    title="放大"
                  >
                    <ArrowsPointingOutIcon className="h-4 w-4" />
                  </button>
                  <button
                    onClick={handleResetZoom}
                    className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 border border-gray-300 rounded hover:bg-gray-50"
                  >
                    重置
                  </button>
                </div>
              )}
            </div>

            {/* PDF查看器 */}
            {showPdfViewer && (
              <div className="p-4">
                <div className="border border-gray-200 rounded-lg overflow-hidden bg-gray-50">
                  <div className="flex justify-center p-4">
                    <iframe
                      src={`${work.pdfFilePath}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`}
                      className="w-full"
                      style={{
                        height: "800px",
                        transform: `scale(${pdfScale})`,
                        transformOrigin: "top center",
                        transition: "transform 0.2s ease-in-out",
                      }}
                      title="乐谱预览"
                    />
                  </div>
                </div>

                {/* 下载提示 */}
                <div className="mt-4 text-center text-sm text-gray-500">
                  <p>💡 提示：您可以点击右上角的下载按钮获取完整PDF文件</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MIDI播放器区域 */}
      {work.midiFilePath && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-lg shadow">
            {/* 工具栏 */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <div className="flex items-center space-x-4">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                  <MusicalNoteIcon className="h-6 w-6 text-blue-500 mr-2" />
                  MIDI播放器
                </h2>
              </div>
            </div>

            {/* MIDI播放器 */}
            <div className="p-4">
              <RealMidiPlayer
                filePath={work.midiFilePath}
                fileName={work.midiFilePath.split("/").pop() || "midi文件"}
                fileSize={work.midiFileSize || 0}
              />

              {/* 下载提示 */}
              <div className="mt-4 text-center text-sm text-gray-500">
                <p>💡 提示：您也可以点击右上角的下载按钮获取完整MIDI文件</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 协作、演奏和评论区域 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
              <PlayIcon className="h-4 w-4 inline mr-1" />
              演奏 ({work.performancesCount})
            </button>

            {work.allowCollaboration && (
              <button
                onClick={() => setActiveTab("collaborations")}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "collaborations"
                    ? "border-primary-500 text-primary-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <CodeBracketIcon className="h-4 w-4 inline mr-1" />
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
              <ClockIcon className="h-4 w-4 inline mr-1" />
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
                    相关演奏 ({work.performancesCount})
                  </h2>
                  {currentUser && !work.isOwner && (
                    <Link
                      href={`/performances/new?workId=${work.id}`}
                      className="btn-primary"
                    >
                      <PlusIcon className="h-4 w-4 mr-1" />
                      上传演奏
                    </Link>
                  )}
                </div>

                <PerformanceList workId={work.id} />
              </div>
            )}

            {activeTab === "collaborations" && work.allowCollaboration && (
              <CollaborationList workId={work.id} isOwner={work.isOwner} />
            )}

            {activeTab === "versions" && <VersionHistory workId={work.id} />}
          </div>

          {/* 评论区 */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                评论 ({work.commentsCount})
              </h3>

              <WorkCommentList workId={work.id} />
            </div>
          </div>
        </div>
      </div>

      {/* 协作请求模态框 */}
      {showCollaborationModal && work && (
        <CollaborationModal
          workId={work.id}
          workTitle={work.title}
          isOpen={showCollaborationModal}
          onClose={() => setShowCollaborationModal(false)}
          onSuccess={() => {
            setShowCollaborationModal(false);
            // 可以在这里刷新协作列表
          }}
        />
      )}
    </div>
  );
}
