"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/components/layout/Providers";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { toast } from "react-hot-toast";
import axios from "axios";
import Link from "next/link";
import WorkForm from "@/components/works/WorkForm";

interface WorkDetail {
  id: number;
  title: string;
  description?: string;
  pdfFilePath?: string;
  midiFilePath?: string;
  pdfFileSize?: number;
  midiFileSize?: number;
  isPublic: boolean;
  allowCollaboration: boolean;
  license: string;
  genre?: {
    id: number;
    name: string;
  };
  instrument?: {
    id: number;
    name: string;
  };
  purpose?: {
    id: number;
    name: string;
  };
  tags: Array<{
    id: number;
    name: string;
    color: string;
  }>;
}

export default function EditWorkPage() {
  const { user } = useAuth();
  const router = useRouter();
  const params = useParams();
  const workId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [work, setWork] = useState<WorkDetail | null>(null);

  // 检查用户是否已登录
  useEffect(() => {
    if (!user) {
      router.push("/auth/login");
      return;
    }
  }, [user, router]);

  // 获取作品详情
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
      } else {
        toast.error("获取作品详情失败");
        router.push("/works");
      }
    } catch (error: any) {
      console.error("获取作品详情失败:", error);
      if (error.response?.status === 404) {
        toast.error("作品不存在");
      } else if (error.response?.status === 403) {
        toast.error("无权编辑此作品");
      } else {
        toast.error("获取作品详情失败");
      }
      router.push("/works");
    } finally {
      setLoading(false);
    }
  };

  const handleSuccess = (workId: string) => {
    router.push(`/works/${workId}`);
  };

  const handleCancel = () => {
    router.push(`/works/${workId}`);
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
          <div className="text-2xl font-bold text-gray-900 mb-2">
            作品不存在
          </div>
          <p className="text-gray-600">您要编辑的作品不存在或已被删除</p>
          <Link
            href="/works"
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
          >
            返回作品列表
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 页面头部 */}
        <div className="mb-8">
          <div className="flex items-center space-x-4">
            <Link
              href={`/works/${workId}`}
              className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <ArrowLeftIcon className="h-4 w-4 mr-2" />
              返回作品
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">编辑作品</h1>
          </div>
          <p className="mt-2 text-gray-600">修改作品信息，更新乐谱和MIDI文件</p>
        </div>

        {/* 编辑表单 */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <WorkForm
              mode="edit"
              workId={workId}
              initialData={work}
              onSuccess={handleSuccess}
              onCancel={handleCancel}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
