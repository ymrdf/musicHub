"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/components/layout/Providers";
import { useForm } from "react-hook-form";
import {
  EyeIcon,
  EyeSlashIcon,
  MusicalNoteIcon,
} from "@heroicons/react/24/outline";
import { toast } from "react-hot-toast";
import { LoginFormData } from "@/types";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>();

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      await login(data.email, data.password);
      toast.success("登录成功！");
      router.push("/");
    } catch (error: any) {
      console.error("登录错误:", error);
      toast.error(error.message || "登录失败，请稍后再试");
    } finally {
      setIsLoading(false);
    }
  };

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
          <h2 className="text-3xl font-extrabold text-gray-900">欢迎回来</h2>
          <p className="mt-2 text-sm text-gray-600">
            登录您的账户，继续您的音乐创作之旅
          </p>
        </div>

        {/* 登录表单 */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            {/* 邮箱 */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                邮箱地址
              </label>
              <div className="mt-1">
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
            </div>

            {/* 密码 */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                密码
              </label>
              <div className="mt-1 relative">
                <input
                  {...register("password", {
                    required: "密码不能为空",
                  })}
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  className="input-field pr-10"
                  placeholder="请输入您的密码"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                  ) : (
                    <EyeIcon className="h-5 w-5 text-gray-400" />
                  )}
                </button>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.password.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* 记住密码和忘记密码 */}
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label
                htmlFor="remember-me"
                className="ml-2 block text-sm text-gray-900"
              >
                记住我
              </label>
            </div>

            <div className="text-sm">
              <Link
                href="/auth/forgot-password"
                className="font-medium text-primary-600 hover:text-primary-500"
              >
                忘记密码？
              </Link>
            </div>
          </div>

          {/* 登录按钮 */}
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  登录中...
                </div>
              ) : (
                "登录"
              )}
            </button>
          </div>

          {/* 注册链接 */}
          <div className="text-center">
            <p className="text-sm text-gray-600">
              还没有账户？{" "}
              <Link
                href="/auth/register"
                className="font-medium text-primary-600 hover:text-primary-500"
              >
                立即注册
              </Link>
            </p>
          </div>
        </form>

        {/* 分割线 */}
        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-50 text-gray-500">或者</span>
            </div>
          </div>
        </div>

        {/* 第三方登录 */}
        <div className="mt-6 grid grid-cols-2 gap-3">
          <button
            type="button"
            className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors duration-200"
          >
            <span className="text-lg">微</span>
            <span className="ml-1">微信</span>
          </button>

          <button
            type="button"
            className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors duration-200"
          >
            <span className="text-lg">Q</span>
            <span className="ml-1">QQ</span>
          </button>
        </div>

        {/* 底部提示 */}
        <div className="text-center text-xs text-gray-500">
          <p>
            登录即表示您同意我们的{" "}
            <Link
              href="/terms"
              className="text-primary-600 hover:text-primary-500"
            >
              服务条款
            </Link>{" "}
            和{" "}
            <Link
              href="/privacy"
              className="text-primary-600 hover:text-primary-500"
            >
              隐私政策
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
