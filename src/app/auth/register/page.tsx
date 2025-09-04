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
import { RegisterFormData } from "@/types";

export default function RegisterPage() {
  const router = useRouter();
  const { register: registerUser } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>();

  const password = watch("password");

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    try {
      await registerUser(data.username, data.email, data.password);
      toast.success("注册成功！欢迎加入 MusicEmit");
      router.push("/");
    } catch (error: any) {
      console.error("注册错误:", error);
      toast.error(error.message || "注册失败，请稍后再试");
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
              MusicEmit
            </span>
          </Link>
          <h2 className="text-3xl font-extrabold text-gray-900">创建账户</h2>
          <p className="mt-2 text-sm text-gray-600">
            加入音乐创作者社区，开始您的创作之旅
          </p>
        </div>

        {/* 注册表单 */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            {/* 用户名 */}
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700"
              >
                用户名
              </label>
              <div className="mt-1">
                <input
                  {...register("username", {
                    required: "用户名不能为空",
                    minLength: {
                      value: 3,
                      message: "用户名至少 3 个字符",
                    },
                    maxLength: {
                      value: 30,
                      message: "用户名最多 30 个字符",
                    },
                    pattern: {
                      value: /^[a-zA-Z0-9_]+$/,
                      message: "用户名只能包含字母、数字和下划线",
                    },
                  })}
                  type="text"
                  autoComplete="username"
                  className="input-field"
                  placeholder="请输入用户名"
                />
                {errors.username && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.username.message}
                  </p>
                )}
              </div>
            </div>

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
                    minLength: {
                      value: 8,
                      message: "密码至少 8 个字符",
                    },
                    pattern: {
                      value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                      message: "密码必须包含大小写字母和数字",
                    },
                  })}
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  className="input-field pr-10"
                  placeholder="请输入密码"
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

            {/* 确认密码 */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700"
              >
                确认密码
              </label>
              <div className="mt-1 relative">
                <input
                  {...register("confirmPassword", {
                    required: "请确认密码",
                    validate: (value) =>
                      value === password || "两次密码输入不一致",
                  })}
                  type={showConfirmPassword ? "text" : "password"}
                  autoComplete="new-password"
                  className="input-field pr-10"
                  placeholder="请再次输入密码"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                  ) : (
                    <EyeIcon className="h-5 w-5 text-gray-400" />
                  )}
                </button>
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* 密码强度提示 */}
          <div className="text-xs text-gray-500 space-y-1">
            <p>密码要求：</p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>至少 8 个字符</li>
              <li>包含大写字母</li>
              <li>包含小写字母</li>
              <li>包含数字</li>
            </ul>
          </div>

          {/* 服务条款 */}
          <div className="flex items-center">
            <input
              id="agree-terms"
              name="agree-terms"
              type="checkbox"
              required
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <label
              htmlFor="agree-terms"
              className="ml-2 block text-sm text-gray-900"
            >
              我已阅读并同意{" "}
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
            </label>
          </div>

          {/* 注册按钮 */}
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  注册中...
                </div>
              ) : (
                "创建账户"
              )}
            </button>
          </div>

          {/* 登录链接 */}
          <div className="text-center">
            <p className="text-sm text-gray-600">
              已有账户？{" "}
              <Link
                href="/auth/login"
                className="font-medium text-primary-600 hover:text-primary-500"
              >
                立即登录
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

        {/* 第三方注册 */}
        <div className="mt-6 grid grid-cols-2 gap-3">
          <button
            type="button"
            className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors duration-200"
          >
            <span className="text-lg">微</span>
            <span className="ml-1">微信注册</span>
          </button>

          <button
            type="button"
            className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors duration-200"
          >
            <span className="text-lg">Q</span>
            <span className="ml-1">QQ注册</span>
          </button>
        </div>
      </div>
    </div>
  );
}
