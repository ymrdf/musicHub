"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { MusicalNoteIcon } from "@heroicons/react/24/outline";
import { toast } from "react-hot-toast";
import axios from "axios";

interface ForgotPasswordFormData {
  email: string;
}

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>();

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setIsLoading(true);
    try {
      const response = await axios.post("/api/auth/forgot-password", {
        email: data.email,
      });

      if (response.data.success) {
        setEmailSent(true);
        toast.success("密码重置链接已发送");
      } else {
        toast.error(response.data.error || "发送失败");
      }
    } catch (error: any) {
      if (error.response?.data?.error) {
        toast.error(error.response.data.error);
      } else {
        toast.error("发送失败，请稍后再试");
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (emailSent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 text-center">
          <div>
            <Link
              href="/"
              className="flex items-center justify-center space-x-2 mb-6"
            >
              <MusicalNoteIcon className="h-10 w-10 text-primary-600" />
              <span className="text-2xl font-bold text-gray-900 font-music">
                MusicHub
              </span>
            </Link>
            <h2 className="text-3xl font-extrabold text-gray-900">
              邮件已发送
            </h2>
            <p className="mt-4 text-sm text-gray-600">
              我们已向您的邮箱发送了密码重置链接，请查收邮件并按照说明重置密码。
            </p>
            <p className="mt-2 text-xs text-gray-500">
              如果您没有收到邮件，请检查垃圾邮件文件夹，或者等待几分钟后重试。
            </p>
          </div>

          <div className="space-y-4">
            <Link
              href="/auth/login"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200"
            >
              返回登录
            </Link>
            <button
              onClick={() => setEmailSent(false)}
              className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200"
            >
              重新发送
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Logo 和标题 */}
        <div className="text-center">
          <Link
            href="/"
            className="flex items-center justify-center space-x-2 mb-6"
          >
            <MusicalNoteIcon className="h-10 w-10 text-primary-600" />
            <span className="text-2xl font-bold text-gray-900 font-music">
              MusicHub
            </span>
          </Link>
          <h2 className="text-3xl font-extrabold text-gray-900">忘记密码</h2>
          <p className="mt-2 text-sm text-gray-600">
            输入您的邮箱地址，我们将发送密码重置链接给您
          </p>
        </div>

        {/* 重置表单 */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label htmlFor="email" className="sr-only">
              邮箱地址
            </label>
            <input
              {...register("email", {
                required: "邮箱不能为空",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "请输入有效的邮箱地址",
                },
              })}
              type="email"
              autoComplete="email"
              className="input-field"
              placeholder="请输入您的邮箱"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  发送中...
                </div>
              ) : (
                "发送重置链接"
              )}
            </button>
          </div>

          <div className="text-center">
            <Link
              href="/auth/login"
              className="font-medium text-primary-600 hover:text-primary-500"
            >
              返回登录
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
