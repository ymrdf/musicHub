"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

interface Feedback {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: "pending" | "reviewed" | "resolved";
  created_at: string;
}

export default function AdminFeedbackPage() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    // 检查用户是否已登录且是管理员
    if (status === "unauthenticated") {
      router.push("/auth/login?callbackUrl=/admin/feedback");
      return;
    }

    // 这里应该有检查用户是否是管理员的逻辑
    // 如果不是管理员，应该重定向到首页

    if (status === "authenticated") {
      fetchFeedbacks();
    }
  }, [status, router]);

  const fetchFeedbacks = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/feedback");

      if (!response.ok) {
        throw new Error("获取反馈数据失败");
      }

      const data = await response.json();
      setFeedbacks(data.feedbacks);
    } catch (err) {
      setError(err instanceof Error ? err.message : "未知错误");
    } finally {
      setLoading(false);
    }
  };

  const updateFeedbackStatus = async (
    id: number,
    status: "pending" | "reviewed" | "resolved"
  ) => {
    try {
      const response = await fetch(`/api/admin/feedback/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        throw new Error("更新反馈状态失败");
      }

      // 更新本地状态
      setFeedbacks(
        feedbacks.map((feedback) =>
          feedback.id === id ? { ...feedback, status } : feedback
        )
      );
    } catch (err) {
      console.error("更新反馈状态时出错:", err);
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "reviewed":
        return "bg-blue-100 text-blue-800";
      case "resolved":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "待处理";
      case "reviewed":
        return "已查看";
      case "resolved":
        return "已解决";
      default:
        return status;
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="spinner"></div>
          <p className="mt-4 text-gray-600">加载中...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="text-red-500 text-xl">错误</div>
          <p className="mt-2 text-gray-600">{error}</p>
          <button
            onClick={fetchFeedbacks}
            className="mt-4 px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700"
          >
            重试
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">用户反馈管理</h1>

      {feedbacks.length === 0 ? (
        <div className="bg-white shadow rounded-lg p-6 text-center">
          <p className="text-gray-600">暂无反馈数据</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  ID
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  用户
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  类型
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  内容
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  状态
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  提交时间
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  操作
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {feedbacks.map((feedback) => (
                <tr key={feedback.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {feedback.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {feedback.name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {feedback.email}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {feedback.subject}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                    {feedback.message}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(
                        feedback.status
                      )}`}
                    >
                      {getStatusText(feedback.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(feedback.created_at).toLocaleString("zh-CN")}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      {feedback.status === "pending" && (
                        <button
                          onClick={() =>
                            updateFeedbackStatus(feedback.id, "reviewed")
                          }
                          className="text-blue-600 hover:text-blue-900"
                        >
                          标记已查看
                        </button>
                      )}
                      {(feedback.status === "pending" ||
                        feedback.status === "reviewed") && (
                        <button
                          onClick={() =>
                            updateFeedbackStatus(feedback.id, "resolved")
                          }
                          className="text-green-600 hover:text-green-900"
                        >
                          标记已解决
                        </button>
                      )}
                      <button
                        onClick={() => {
                          // 实现查看详情功能
                          // 可以打开一个模态框显示完整内容
                        }}
                        className="text-gray-600 hover:text-gray-900"
                      >
                        查看详情
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
