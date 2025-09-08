"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  MusicalNoteIcon,
  CheckCircleIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";
import { toast } from "react-hot-toast";
import axios from "axios";

function VerifyEmailForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [verificationResult, setVerificationResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  useEffect(() => {
    const verifyEmail = async () => {
      const token = searchParams.get("token");

      if (!token) {
        setVerificationResult({
          success: false,
          message: "验证链接无效",
        });
        setIsLoading(false);
        return;
      }

      try {
        const response = await axios.post("/api/auth/verify-email", { token });

        if (response.data.success) {
          setVerificationResult({
            success: true,
            message: response.data.message || "邮箱验证成功！",
          });
          toast.success("邮箱验证成功！");
        } else {
          setVerificationResult({
            success: false,
            message: response.data.error || "验证失败",
          });
        }
      } catch (error: any) {
        const errorMessage =
          error.response?.data?.error || "验证失败，请稍后再试";
        setVerificationResult({
          success: false,
          message: errorMessage,
        });
        toast.error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    verifyEmail();
  }, [searchParams]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">正在验证您的邮箱...</p>
        </div>
      </div>
    );
  }

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
              MusicEmit
            </span>
          </Link>

          {verificationResult?.success ? (
            <div className="space-y-4">
              <CheckCircleIcon className="h-16 w-16 text-green-500 mx-auto" />
              <h2 className="text-3xl font-extrabold text-gray-900">
                验证成功
              </h2>
              <p className="text-sm text-gray-600">
                {verificationResult.message}
              </p>
              <p className="text-sm text-gray-500">
                您现在可以享受 MusicEmit 的完整功能了！
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <XCircleIcon className="h-16 w-16 text-red-500 mx-auto" />
              <h2 className="text-3xl font-extrabold text-gray-900">
                验证失败
              </h2>
              <p className="text-sm text-red-600">
                {verificationResult?.message}
              </p>
              <p className="text-sm text-gray-500">
                验证链接可能已过期或无效，请重新请求验证邮件。
              </p>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <Link
            href="/auth/login"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200"
          >
            前往登录
          </Link>

          {!verificationResult?.success && (
            <Link
              href="/auth/register"
              className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200"
            >
              重新注册
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">正在加载...</p>
          </div>
        </div>
      }
    >
      <VerifyEmailForm />
    </Suspense>
  );
}
