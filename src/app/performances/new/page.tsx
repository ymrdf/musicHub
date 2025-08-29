"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/components/layout/Providers";
import { PerformanceFormData } from "@/types";
import { performanceFormSchema } from "@/utils/validation";
import axios from "axios";
import {
  MusicalNoteIcon,
  MicrophoneIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";

export default function NewPerformancePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user: currentUser, loading } = useAuth();
  const workId = searchParams.get("workId");

  // 调试信息
  console.log("NewPerformancePage - currentUser:", currentUser);
  console.log("NewPerformancePage - loading:", loading);

  const [formData, setFormData] = useState<PerformanceFormData>({
    title: "",
    description: "",
    type: "instrumental",
    instrument: "",
    lyricsId: undefined,
    isPublic: true,
  });

  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [work, setWork] = useState<any>(null);

  // 获取作品信息
  useEffect(() => {
    if (workId) {
      fetchWorkInfo();
    }
  }, [workId]);

  const fetchWorkInfo = async () => {
    try {
      const response = await axios.get(`/api/works/${workId}`);
      if (response.data.success) {
        setWork(response.data.data);
        // 设置默认标题
        setFormData((prev) => ({
          ...prev,
          title: `${response.data.data.title} - 我的演奏`,
        }));
      }
    } catch (error) {
      console.error("获取作品信息失败:", error);
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // 验证文件类型
      if (!file.type.startsWith("audio/")) {
        setErrors((prev) => ({ ...prev, audioFile: "请选择音频文件" }));
        return;
      }
      // 验证文件大小 (50MB)
      if (file.size > 50 * 1024 * 1024) {
        setErrors((prev) => ({ ...prev, audioFile: "文件大小不能超过 50MB" }));
        return;
      }
      setAudioFile(file);
      setErrors((prev) => ({ ...prev, audioFile: "" }));
    }
  };

  const validateForm = (): boolean => {
    try {
      const { error } = performanceFormSchema.validate(formData, {
        abortEarly: false,
      });
      if (error) {
        const newErrors: { [key: string]: string } = {};
        error.details?.forEach((detail: any) => {
          newErrors[detail.path[0]] = detail.message;
        });
        setErrors(newErrors);
        return false;
      }

      if (!audioFile) {
        setErrors((prev) => ({ ...prev, audioFile: "请选择音频文件" }));
        return false;
      }
      return true;
    } catch (error: any) {
      console.error("表单验证错误:", error);
      setErrors((prev) => ({ ...prev, submit: "表单验证失败" }));
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsUploading(true);
    try {
      // 先上传音频文件
      const audioFormData = new FormData();
      audioFormData.append("file", audioFile!);
      audioFormData.append("type", "audio");

      const uploadResponse = await axios.post(`/api/upload`, audioFormData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (!uploadResponse.data.success) {
        throw new Error(uploadResponse.data.error || "音频上传失败");
      }

      const uploadResult = uploadResponse.data.data;

      // 创建演奏记录
      const performanceData = {
        ...formData,
        workId: parseInt(workId!),
        audioFilePath: uploadResult.path,
        audioFileSize: audioFile!.size,
        fileFormat: audioFile!.name.split(".").pop()?.toLowerCase(),
      };

      const createResponse = await axios.post(
        `/api/performances`,
        performanceData
      );

      if (!createResponse.data.success) {
        throw new Error(createResponse.data.error || "创建演奏失败");
      }

      // 跳转到作品页面
      router.push(`/works/${workId}`);
    } catch (error: any) {
      setErrors((prev) => ({ ...prev, submit: error.message }));
    } finally {
      setIsUploading(false);
    }
  };

  // 显示加载状态
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow p-6">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-center">正在验证登录状态...</p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow p-6">
          <h1 className="text-xl font-semibold text-gray-900 mb-4">请先登录</h1>
          <p className="text-gray-600 mb-4">您需要登录后才能上传演奏</p>
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

  if (!workId) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow p-6">
          <h1 className="text-xl font-semibold text-gray-900 mb-4">参数错误</h1>
          <p className="text-gray-600 mb-4">缺少作品ID参数</p>
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
        <div className="bg-white rounded-lg shadow p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">上传演奏</h1>
            {work && (
              <p className="text-gray-600 mt-2">
                为作品「{work.title}」添加演奏
              </p>
            )}
          </div>

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

            {/* 音频文件上传 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                音频文件 *
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <input
                  type="file"
                  accept="audio/*"
                  onChange={handleFileChange}
                  className="hidden"
                  id="audio-upload"
                />
                <label
                  htmlFor="audio-upload"
                  className="cursor-pointer text-primary-600 hover:text-primary-800"
                >
                  {formData.type === "instrumental" ? (
                    <MusicalNoteIcon className="h-12 w-12 mx-auto mb-3" />
                  ) : (
                    <MicrophoneIcon className="h-12 w-12 mx-auto mb-3" />
                  )}
                  <p className="text-lg font-medium mb-2">
                    {audioFile ? "已选择文件" : "点击上传音频文件"}
                  </p>
                  <p className="text-sm text-gray-500">
                    支持 MP3、WAV 格式，最大 50MB
                  </p>
                </label>
              </div>

              {audioFile && (
                <div className="mt-3 p-3 bg-gray-50 rounded-md">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <MusicalNoteIcon className="h-5 w-5 text-green-600" />
                      <span className="text-sm text-gray-700">
                        {audioFile.name}
                      </span>
                      <span className="text-xs text-gray-500">
                        ({(audioFile.size / 1024 / 1024).toFixed(2)} MB)
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setAudioFile(null)}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      移除
                    </button>
                  </div>
                </div>
              )}

              {errors.audioFile && (
                <p className="text-red-500 text-sm mt-1">{errors.audioFile}</p>
              )}
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
                disabled={isUploading}
                className="flex-1 btn-primary disabled:opacity-50"
              >
                {isUploading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    上传中...
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <PlusIcon className="h-4 w-4 mr-2" />
                    上传演奏
                  </div>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
