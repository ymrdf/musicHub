"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  DocumentArrowUpIcon,
  MusicalNoteIcon,
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

interface WorkFormProps {
  mode: "create" | "edit";
  workId?: string;
  initialData?: WorkDetail;
  onSuccess: (workId: string) => void;
  onCancel: () => void;
}

export default function WorkForm({
  mode,
  workId,
  initialData,
  onSuccess,
  onCancel,
}: WorkFormProps) {
  const [loading, setLoading] = useState(mode === "edit");
  const [saving, setSaving] = useState(false);
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
    reset,
  } = useForm<WorkFormData>({
    defaultValues: {
      isPublic: true,
      allowCollaboration: true,
      license: "CC BY-SA 4.0",
    },
  });

  // 获取分类和标签数据
  useEffect(() => {
    fetchCategories();
    fetchTags();

    if (mode === "edit" && initialData) {
      initializeFormData(initialData);
    }
  }, [mode, initialData]);

  const initializeFormData = (workData: WorkDetail) => {
    // 设置表单默认值
    reset({
      title: workData.title,
      description: workData.description || "",
      genreId: workData.genre?.id || null,
      instrumentId: workData.instrument?.id || null,
      purposeId: workData.purpose?.id || null,
      isPublic: workData.isPublic,
      allowCollaboration: workData.allowCollaboration,
      license: workData.license,
    });

    // 设置标签
    setSelectedTags(workData.tags.map((tag) => tag.name));

    // 设置文件URL
    if (workData.pdfFilePath) {
      setPdfUrl(workData.pdfFilePath);
    }
    if (workData.midiFilePath) {
      setMidiUrl(workData.midiFilePath);
    }

    setLoading(false);
  };

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
      const response = await axios.get("/api/tags");
      if (response.data.success) {
        setTags(response.data.data);
      }
    } catch (error) {
      console.error("获取标签失败:", error);
    }
  };

  const handlePdfUpload = async (file: File) => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", "pdf");

    try {
      setPdfUploading(true);
      const response = await axios.post("/api/upload", formData);
      if (response.data.success) {
        setPdfUrl(response.data.data.url);
        setPdfFile(null);
        toast.success("PDF文件上传成功");
      } else {
        toast.error(response.data.error || "PDF文件上传失败");
      }
    } catch (error: any) {
      console.error("PDF文件上传失败:", error);
      toast.error(error.response?.data?.error || "PDF文件上传失败");
    } finally {
      setPdfUploading(false);
    }
  };

  const handleMidiUpload = async (file: File) => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", "midi");

    try {
      setMidiUploading(true);
      const response = await axios.post("/api/upload", formData);
      if (response.data.success) {
        setMidiUrl(response.data.data.url);
        setMidiFile(null);
        toast.success("MIDI文件上传成功");
      } else {
        toast.error(response.data.error || "MIDI文件上传失败");
      }
    } catch (error: any) {
      console.error("MIDI文件上传失败:", error);
      toast.error(error.response?.data?.error || "MIDI文件上传失败");
    } finally {
      setMidiUploading(false);
    }
  };

  const addTag = () => {
    if (newTag.trim() && !selectedTags.includes(newTag.trim())) {
      setSelectedTags([...selectedTags, newTag.trim()]);
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setSelectedTags(selectedTags.filter((tag) => tag !== tagToRemove));
  };

  const onSubmit = async (data: WorkFormData) => {
    try {
      setSaving(true);

      const submitData = {
        ...data,
        tags: selectedTags,
        pdfFilePath: pdfUrl,
        midiFilePath: midiUrl,
      };

      let response;
      if (mode === "create") {
        response = await axios.post("/api/works", submitData);
      } else {
        response = await axios.put(`/api/works/${workId}`, submitData);
      }

      if (response.data.success) {
        const successMessage =
          mode === "create" ? "作品创建成功" : "作品更新成功";
        toast.success(successMessage);

        const newWorkId = mode === "create" ? response.data.data.id : workId!;
        onSuccess(newWorkId);
      } else {
        toast.error(response.data.error || "操作失败");
      }
    } catch (error: any) {
      console.error(`${mode === "create" ? "创建" : "更新"}作品失败:`, error);
      toast.error(error.response?.data?.error || "操作失败，请稍后重试");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">加载中...</p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* 基本信息 */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">基本信息</h3>
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              作品标题 *
            </label>
            <input
              type="text"
              id="title"
              {...register("title", { required: "请输入作品标题" })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="请输入作品标题"
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600">
                {errors.title.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              作品描述
            </label>
            <textarea
              id="description"
              rows={4}
              {...register("description")}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="请输入作品描述（可选）"
            />
          </div>
        </div>
      </div>

      {/* 分类信息 */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">分类信息</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label
              htmlFor="genreId"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              曲种
            </label>
            <select
              id="genreId"
              {...register("genreId")}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">选择曲种</option>
              {categories.genre.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="instrumentId"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              乐器
            </label>
            <select
              id="instrumentId"
              {...register("instrumentId")}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">选择乐器</option>
              {categories.instrument.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="purposeId"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              用途
            </label>
            <select
              id="purposeId"
              {...register("purposeId")}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">选择用途</option>
              {categories.purpose.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* 标签 */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">标签</h3>
        <div className="space-y-3">
          <div className="flex space-x-2">
            <input
              type="text"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyPress={(e) =>
                e.key === "Enter" && (e.preventDefault(), addTag())
              }
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="输入标签名称，按回车添加"
            />
            <button
              type="button"
              onClick={addTag}
              className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <PlusIcon className="h-4 w-4" />
            </button>
          </div>

          {selectedTags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {selectedTags.map((tag) => (
                <span
                  key={tag}
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
        </div>
      </div>

      {/* 文件上传 */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">文件管理</h3>
        <div className="space-y-4">
          {/* PDF文件 */}
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center">
                <DocumentArrowUpIcon className="h-6 w-6 text-red-500 mr-2" />
                <span className="font-medium text-gray-900">PDF乐谱</span>
              </div>
              {pdfUrl && (
                <span className="text-sm text-green-600">✓ 已上传</span>
              )}
            </div>

            {pdfUrl ? (
              <div className="mb-3">
                <p className="text-sm text-gray-600 mb-2">
                  当前文件：{pdfUrl.split("/").pop()}
                </p>
                <button
                  type="button"
                  onClick={() => setPdfUrl("")}
                  className="text-sm text-red-600 hover:text-red-800"
                >
                  移除文件
                </button>
              </div>
            ) : (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <input
                  type="file"
                  accept=".pdf"
                  onChange={(e) => setPdfFile(e.target.files?.[0] || null)}
                  className="hidden"
                  id="pdf-upload"
                />
                <label
                  htmlFor="pdf-upload"
                  className="cursor-pointer text-primary-600 hover:text-primary-800"
                >
                  <DocumentArrowUpIcon className="h-8 w-8 mx-auto mb-2" />
                  <p>点击上传PDF文件</p>
                </label>
              </div>
            )}

            {pdfFile && (
              <div className="mt-3">
                <button
                  type="button"
                  onClick={() => handlePdfUpload(pdfFile)}
                  disabled={pdfUploading}
                  className="w-full px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50"
                >
                  {pdfUploading ? "上传中..." : "上传PDF文件"}
                </button>
              </div>
            )}
          </div>

          {/* MIDI文件 */}
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center">
                <MusicalNoteIcon className="h-6 w-6 text-blue-500 mr-2" />
                <span className="font-medium text-gray-900">MIDI文件</span>
              </div>
              {midiUrl && (
                <span className="text-sm text-green-600">✓ 已上传</span>
              )}
            </div>

            {midiUrl ? (
              <div className="mb-3">
                <p className="text-sm text-gray-600 mb-2">
                  当前文件：{midiUrl.split("/").pop()}
                </p>
                <button
                  type="button"
                  onClick={() => setMidiUrl("")}
                  className="text-sm text-red-600 hover:text-red-800"
                >
                  移除文件
                </button>
              </div>
            ) : (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <input
                  type="file"
                  accept=".mid,.midi"
                  onChange={(e) => setMidiFile(e.target.files?.[0] || null)}
                  className="hidden"
                  id="midi-upload"
                />
                <label
                  htmlFor="midi-upload"
                  className="cursor-pointer text-primary-600 hover:text-primary-800"
                >
                  <MusicalNoteIcon className="h-8 w-8 mx-auto mb-2" />
                  <p>点击上传MIDI文件</p>
                </label>
              </div>
            )}

            {midiFile && (
              <div className="mt-3">
                <button
                  type="button"
                  onClick={() => handleMidiUpload(midiFile)}
                  disabled={midiUploading}
                  className="w-full px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50"
                >
                  {midiUploading ? "上传中..." : "上传MIDI文件"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 设置 */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">设置</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label
                htmlFor="isPublic"
                className="text-sm font-medium text-gray-700"
              >
                公开作品
              </label>
              <p className="text-sm text-gray-500">
                其他用户可以查看和下载此作品
              </p>
            </div>
            <input
              type="checkbox"
              id="isPublic"
              {...register("isPublic")}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label
                htmlFor="allowCollaboration"
                className="text-sm font-medium text-gray-700"
              >
                允许协作
              </label>
              <p className="text-sm text-gray-500">
                其他用户可以为此作品贡献演奏
              </p>
            </div>
            <input
              type="checkbox"
              id="allowCollaboration"
              {...register("allowCollaboration")}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
          </div>

          <div>
            <label
              htmlFor="license"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              许可证
            </label>
            <select
              id="license"
              {...register("license")}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="CC BY-SA 4.0">
                CC BY-SA 4.0 (署名-相同方式共享)
              </option>
              <option value="CC BY 4.0">CC BY 4.0 (署名)</option>
              <option value="CC BY-NC 4.0">
                CC BY-NC 4.0 (署名-非商业性使用)
              </option>
              <option value="CC BY-ND 4.0">CC BY-ND 4.0 (署名-禁止演绎)</option>
              <option value="CC0 1.0">CC0 1.0 (公共领域)</option>
            </select>
          </div>
        </div>
      </div>

      {/* 提交按钮 */}
      <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          取消
        </button>
        <button
          type="submit"
          disabled={saving}
          className="px-6 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50"
        >
          {saving ? "保存中..." : mode === "create" ? "创建作品" : "保存更改"}
        </button>
      </div>
    </form>
  );
}
