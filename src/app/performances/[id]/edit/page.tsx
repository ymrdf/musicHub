"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/components/layout/Providers";
import { PerformanceFormData } from "@/types";
import { performanceFormSchema } from "@/utils/validation";
import {
  MusicalNoteIcon,
  MicrophoneIcon,
  ArrowLeftIcon,
} from "@heroicons/react/24/outline";

export default function EditPerformancePage() {
  const params = useParams();
  const router = useRouter();
  const { user: currentUser } = useAuth();
  const performanceId = params.id as string;

  const [formData, setFormData] = useState<PerformanceFormData>({
    title: "",
    description: "",
    type: "instrumental",
    instrument: "",
    lyricsId: undefined,
    isPublic: true,
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [performance, setPerformance] = useState<any>(null);

  useEffect(() => {
    if (performanceId) {
      fetchPerformance();
    }
  }, [performanceId]);

  const fetchPerformance = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/performances/${performanceId}`);
      if (response.ok) {
        const data = await response.json();
        const perf = data.data;

        // 检查权限
        if (perf.userId !== currentUser?.id) {
          router.push("/");
          return;
        }

        setPerformance(perf);
        setFormData({
          title: perf.title,
          description: perf.description || "",
          type: perf.type,
          instrument: perf.instrument || "",
          lyricsId: perf.lyricsId,
          isPublic: perf.isPublic,
        });
      } else {
        throw new Error("获取演奏信息失败");
      }
    } catch (error: any) {
      console.error("获取演奏信息失败:", error);
      setErrors((prev) => ({ ...prev, submit: error.message }));
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // 清除错误
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = (): boolean => {
    try {
      performanceFormSchema.validateSync(formData, { abortEarly: false });
      return true;
    } catch (error: any) {
      const newErrors: { [key: string]: string } = {};
      error.details?.forEach((detail: any) => {
        newErrors[detail.path[0]] = detail.message;
      });
      setErrors(newErrors);
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setSaving(true);
    try {
      const response = await fetch(`/api/performances/${performanceId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "更新演奏失败");
      }

      // 跳转到演奏详情页面
      router.push(`/performances/${performanceId}`);
    } catch (error: any) {
      setErrors((prev) => ({ ...prev, submit: error.message }));
    } finally {
      setSaving(false);
    }
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow p-6">
          <h1 className="text-xl font-semibold text-gray-900 mb-4">请先登录</h1>
          <p className="text-gray-600 mb-4">您需要登录后才能编辑演奏</p>
          <button
            onClick={() => router.push("/auth/login")}
            className="w-full btn-primary"
          >
            去登录
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!performance) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow p-6">
          <h1 className="text-xl font-semibold text-gray-900 mb-4">
            演奏不存在
          </h1>
          <button onClick={() => router.back()} className="w-full btn-primary">
            返回
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 头部导航 */}
        <div className="mb-6">
          <button
            onClick={() => router.back()}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeftIcon className="h-5 w-5" />
            <span>返回</span>
          </button>
          <h1 className="text-2xl font-bold text-gray-900">编辑演奏</h1>
          <p className="text-gray-600 mt-2">修改演奏信息</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 演奏标题 */}
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                演奏标题 *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                  errors.title ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="请输入演奏标题"
              />
              {errors.title && (
                <p className="text-red-500 text-sm mt-1">{errors.title}</p>
              )}
            </div>

            {/* 演奏描述 */}
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                演奏描述
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="描述一下您的演奏（可选）"
              />
            </div>

            {/* 演奏类型 */}
            <div>
              <label
                htmlFor="type"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                演奏类型 *
              </label>
              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="instrumental">器乐演奏</option>
                <option value="vocal">声乐演唱</option>
              </select>
            </div>

            {/* 乐器 */}
            <div>
              <label
                htmlFor="instrument"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                乐器/声部
              </label>
              <input
                type="text"
                id="instrument"
                name="instrument"
                value={formData.instrument}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder={
                  formData.type === "instrumental"
                    ? "如：钢琴、小提琴、吉他"
                    : "如：男高音、女中音"
                }
              />
            </div>

            {/* 当前音频文件信息 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                当前音频文件
              </label>
              <div className="p-3 bg-gray-50 rounded-md">
                <div className="flex items-center space-x-2">
                  {formData.type === "instrumental" ? (
                    <MusicalNoteIcon className="h-5 w-5 text-green-600" />
                  ) : (
                    <MicrophoneIcon className="h-5 w-5 text-green-600" />
                  )}
                  <span className="text-sm text-gray-700">
                    {performance.audioFilePath.split("/").pop()}
                  </span>
                  <span className="text-xs text-gray-500">
                    ({(performance.audioFileSize / 1024 / 1024).toFixed(2)} MB)
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  音频文件无法修改，如需更换请重新上传
                </p>
              </div>
            </div>

            {/* 公开设置 */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isPublic"
                name="isPublic"
                checked={formData.isPublic}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    isPublic: e.target.checked,
                  }))
                }
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label
                htmlFor="isPublic"
                className="ml-2 block text-sm text-gray-700"
              >
                公开演奏，其他用户可以听到
              </label>
            </div>

            {/* 提交错误 */}
            {errors.submit && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-red-600 text-sm">{errors.submit}</p>
              </div>
            )}

            {/* 操作按钮 */}
            <div className="flex space-x-3 pt-4">
              <button
                type="button"
                onClick={() => router.back()}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                取消
              </button>
              <button
                type="submit"
                disabled={saving}
                className="flex-1 btn-primary disabled:opacity-50"
              >
                {saving ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    保存中...
                  </div>
                ) : (
                  "保存修改"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
