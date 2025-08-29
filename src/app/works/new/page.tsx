"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/layout/Providers";
import { useForm } from "react-hook-form";
import {
  DocumentArrowUpIcon,
  MusicalNoteIcon,
  TagIcon,
  XMarkIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";
import { toast } from "react-hot-toast";
import axios from "axios";

interface Category {
  id: number;
  name: string;
  description?: string;
}

interface Tag {
  id: number;
  name: string;
  color: string;
}

interface WorkFormData {
  title: string;
  description: string;
  genreId: number | null;
  instrumentId: number | null;
  purposeId: number | null;
  isPublic: boolean;
  allowCollaboration: boolean;
  license: string;
}

export default function NewWorkPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<{
    genre: Category[];
    instrument: Category[];
    purpose: Category[];
  }>({
    genre: [],
    instrument: [],
    purpose: [],
  });
  const [tags, setTags] = useState<Tag[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [midiFile, setMidiFile] = useState<File | null>(null);
  const [pdfUploading, setPdfUploading] = useState(false);
  const [midiUploading, setMidiUploading] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string>("");
  const [midiUrl, setMidiUrl] = useState<string>("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<WorkFormData>({
    defaultValues: {
      isPublic: true,
      allowCollaboration: true,
      license: "CC BY-SA 4.0",
    },
  });

  // 检查用户是否已登录
  useEffect(() => {
    if (!user) {
      router.push("/auth/login");
      return;
    }
  }, [user, router]);

  // 获取分类和标签数据
  useEffect(() => {
    fetchCategories();
    fetchTags();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get("/api/categories");
      if (response.data.success) {
        setCategories(response.data.data);
      }
    } catch (error) {
      console.error("获取分类失败:", error);
    }
  };

  const fetchTags = async () => {
    try {
      const response = await axios.get("/api/tags?limit=50");
      if (response.data.success) {
        setTags(response.data.data);
      }
    } catch (error) {
      console.error("获取标签失败:", error);
    }
  };

  const handleFileUpload = async (file: File, type: "pdf" | "midi") => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", type);

    try {
      if (type === "pdf") {
        setPdfUploading(true);
      } else {
        setMidiUploading(true);
      }

      const response = await axios.post("/api/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success) {
        if (type === "pdf") {
          setPdfUrl(response.data.data.url);
          toast.success("PDF 上传成功");
        } else {
          setMidiUrl(response.data.data.url);
          toast.success("MIDI 上传成功");
        }
      }
    } catch (error: any) {
      toast.error(
        error.response?.data?.error || `${type.toUpperCase()} 上传失败`
      );
    } finally {
      if (type === "pdf") {
        setPdfUploading(false);
      } else {
        setMidiUploading(false);
      }
    }
  };

  const handlePdfFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== "application/pdf") {
        toast.error("请选择 PDF 文件");
        return;
      }
      if (file.size > 20 * 1024 * 1024) {
        toast.error("PDF 文件大小不能超过 20MB");
        return;
      }
      setPdfFile(file);
      handleFileUpload(file, "pdf");
    }
  };

  const handleMidiFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (
        !file.name.toLowerCase().endsWith(".mid") &&
        !file.name.toLowerCase().endsWith(".midi")
      ) {
        toast.error("请选择 MIDI 文件");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error("MIDI 文件大小不能超过 5MB");
        return;
      }
      setMidiFile(file);
      handleFileUpload(file, "midi");
    }
  };

  const addTag = () => {
    if (newTag.trim() && !selectedTags.includes(newTag.trim())) {
      if (selectedTags.length >= 10) {
        toast.error("最多只能添加 10 个标签");
        return;
      }
      setSelectedTags([...selectedTags, newTag.trim()]);
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setSelectedTags(selectedTags.filter((tag) => tag !== tagToRemove));
  };

  const onSubmit = async (data: WorkFormData) => {
    if (!pdfUrl && !midiUrl) {
      toast.error("请至少上传一个 PDF 乐谱或 MIDI 文件");
      return;
    }

    try {
      setLoading(true);

      const workData = {
        ...data,
        pdfFilePath: pdfUrl || null,
        midiFilePath: midiUrl || null,
        tags: selectedTags,
        genreId: data.genreId || null,
        instrumentId: data.instrumentId || null,
        purposeId: data.purposeId || null,
      };

      const response = await axios.post("/api/works", workData);

      if (response.data.success) {
        toast.success("作品创建成功！");
        router.push(`/works/${response.data.data.id}`);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error || "创建作品失败");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">加载中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow">
          {/* 头部 */}
          <div className="px-6 py-4 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
              <MusicalNoteIcon className="h-6 w-6 mr-2" />
              创建新作品
            </h1>
            <p className="mt-2 text-gray-600">
              分享您的原创音乐作品，让更多人欣赏您的创作
            </p>
          </div>

          {/* 表单 */}
          <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
            {/* 基本信息 */}
            <div className="grid grid-cols-1 gap-6">
              {/* 标题 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  作品标题 *
                </label>
                <input
                  {...register("title", {
                    required: "请输入作品标题",
                    maxLength: { value: 200, message: "标题不能超过200个字符" },
                  })}
                  type="text"
                  className="input-field"
                  placeholder="请输入作品标题"
                />
                {errors.title && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.title.message}
                  </p>
                )}
              </div>

              {/* 描述 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  作品描述
                </label>
                <textarea
                  {...register("description", {
                    maxLength: {
                      value: 2000,
                      message: "描述不能超过2000个字符",
                    },
                  })}
                  className="textarea-field"
                  rows={4}
                  placeholder="请描述您的作品，包括创作背景、演奏技巧、情感表达等..."
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.description.message}
                  </p>
                )}
              </div>
            </div>

            {/* 文件上传 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* PDF 上传 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  PDF 乐谱
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary-400 transition-colors duration-200 relative">
                  {pdfUrl ? (
                    <div className="text-green-600">
                      <DocumentArrowUpIcon className="h-12 w-12 mx-auto mb-2" />
                      <p className="text-sm font-medium">PDF 上传成功</p>
                      <p className="text-xs">{pdfFile?.name}</p>
                      <button
                        type="button"
                        onClick={() => {
                          setPdfFile(null);
                          setPdfUrl("");
                        }}
                        className="mt-2 text-xs text-red-600 hover:text-red-800 underline"
                      >
                        重新上传
                      </button>
                    </div>
                  ) : (
                    <div>
                      <DocumentArrowUpIcon className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600 mb-2">
                        点击上传 PDF 乐谱
                      </p>
                      <p className="text-xs text-gray-500 mb-3">
                        支持 PDF 格式，最大 20MB
                      </p>
                      <label className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 cursor-pointer">
                        <DocumentArrowUpIcon className="h-4 w-4 mr-2" />
                        选择文件
                        <input
                          type="file"
                          accept=".pdf"
                          onChange={handlePdfFileChange}
                          disabled={pdfUploading}
                          className="hidden"
                        />
                      </label>
                    </div>
                  )}
                  {pdfUploading && (
                    <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600"></div>
                    </div>
                  )}
                </div>
              </div>

              {/* MIDI 上传 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  MIDI 文件
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary-400 transition-colors duration-200 relative">
                  {midiUrl ? (
                    <div className="text-green-600">
                      <MusicalNoteIcon className="h-12 w-12 mx-auto mb-2" />
                      <p className="text-sm font-medium">MIDI 上传成功</p>
                      <p className="text-xs">{midiFile?.name}</p>
                      <button
                        type="button"
                        onClick={() => {
                          setMidiFile(null);
                          setMidiUrl("");
                        }}
                        className="mt-2 text-xs text-red-600 hover:text-red-800 underline"
                      >
                        重新上传
                      </button>
                    </div>
                  ) : (
                    <div>
                      <MusicalNoteIcon className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600 mb-2">
                        点击上传 MIDI 文件
                      </p>
                      <p className="text-xs text-gray-500 mb-3">
                        支持 .mid .midi 格式，最大 5MB
                      </p>
                      <label className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 cursor-pointer">
                        <MusicalNoteIcon className="h-4 w-4 mr-2" />
                        选择文件
                        <input
                          type="file"
                          accept=".mid,.midi"
                          onChange={handleMidiFileChange}
                          disabled={midiUploading}
                          className="hidden"
                        />
                      </label>
                    </div>
                  )}
                  {midiUploading && (
                    <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600"></div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* 分类选择 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* 曲种 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  曲种分类
                </label>
                <select
                  {...register("genreId", {
                    setValueAs: (value) =>
                      value === "" ? null : parseInt(value),
                  })}
                  className="input-field"
                >
                  <option value="">请选择曲种</option>
                  {categories.genre.map((genre) => (
                    <option key={genre.id} value={genre.id}>
                      {genre.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* 乐器 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  主要乐器
                </label>
                <select
                  {...register("instrumentId", {
                    setValueAs: (value) =>
                      value === "" ? null : parseInt(value),
                  })}
                  className="input-field"
                >
                  <option value="">请选择乐器</option>
                  {categories.instrument.map((instrument) => (
                    <option key={instrument.id} value={instrument.id}>
                      {instrument.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* 用途 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  作品用途
                </label>
                <select
                  {...register("purposeId", {
                    setValueAs: (value) =>
                      value === "" ? null : parseInt(value),
                  })}
                  className="input-field"
                >
                  <option value="">请选择用途</option>
                  {categories.purpose.map((purpose) => (
                    <option key={purpose.id} value={purpose.id}>
                      {purpose.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* 标签 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <TagIcon className="inline h-4 w-4 mr-1" />
                标签 (最多10个)
              </label>

              {/* 已选标签 */}
              {selectedTags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {selectedTags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary-100 text-primary-800"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="ml-2 text-primary-600 hover:text-primary-800"
                      >
                        <XMarkIcon className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}

              {/* 添加标签 */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={(e) =>
                    e.key === "Enter" && (e.preventDefault(), addTag())
                  }
                  placeholder="输入标签名称"
                  className="input-field flex-1"
                  disabled={selectedTags.length >= 10}
                />
                <button
                  type="button"
                  onClick={addTag}
                  disabled={!newTag.trim() || selectedTags.length >= 10}
                  className="btn-primary"
                >
                  <PlusIcon className="h-4 w-4" />
                </button>
              </div>

              {/* 推荐标签 */}
              {tags.length > 0 && (
                <div className="mt-3">
                  <p className="text-xs text-gray-500 mb-2">推荐标签：</p>
                  <div className="flex flex-wrap gap-2">
                    {tags.slice(0, 10).map((tag) => (
                      <button
                        key={tag.id}
                        type="button"
                        onClick={() => {
                          if (
                            !selectedTags.includes(tag.name) &&
                            selectedTags.length < 10
                          ) {
                            setSelectedTags([...selectedTags, tag.name]);
                          }
                        }}
                        disabled={
                          selectedTags.includes(tag.name) ||
                          selectedTags.length >= 10
                        }
                        className="px-2 py-1 text-xs border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {tag.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* 设置选项 */}
            <div className="space-y-4">
              <div className="flex items-center">
                <input
                  {...register("isPublic")}
                  type="checkbox"
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-900">
                  公开作品（其他用户可以查看和收藏）
                </label>
              </div>

              <div className="flex items-center">
                <input
                  {...register("allowCollaboration")}
                  type="checkbox"
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-900">
                  允许协作（其他用户可以提交修改建议）
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  许可证
                </label>
                <select
                  {...register("license")}
                  className="input-field w-full md:w-1/2"
                >
                  <option value="CC BY-SA 4.0">CC BY-SA 4.0 (推荐)</option>
                  <option value="CC BY 4.0">CC BY 4.0</option>
                  <option value="CC BY-NC 4.0">CC BY-NC 4.0</option>
                  <option value="All Rights Reserved">
                    All Rights Reserved
                  </option>
                </select>
              </div>
            </div>

            {/* 提交按钮 */}
            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => router.back()}
                className="btn-secondary"
              >
                取消
              </button>
              <button
                type="submit"
                disabled={loading || (!pdfUrl && !midiUrl)}
                className="btn-primary"
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    创建中...
                  </div>
                ) : (
                  "创建作品"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
