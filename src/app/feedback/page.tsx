"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

export default function FeedbackPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitSuccess, setIsSubmitSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(""); // 清除之前的错误信息

    try {
      // 调用API提交反馈
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok || data.success === false) {
        throw new Error(data.error || data.message || "提交失败");
      }

      toast.success("感谢您的反馈！我们会尽快处理。");
      setIsSubmitSuccess(true);
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
    } catch (error) {
      let friendlyMessage = "未知错误";
      let technicalMessage = "";

      if (error instanceof Error) {
        technicalMessage = error.message;
      }

      // 显示更友好的错误信息
      if (
        technicalMessage.includes("Table") &&
        technicalMessage.includes("doesn't exist")
      ) {
        friendlyMessage = "系统尚未准备好接收反馈，请联系管理员初始化反馈系统";
      } else if (technicalMessage.includes("数据库错误")) {
        friendlyMessage = "数据库服务暂时不可用，请稍后再试";
      }

      // 设置错误信息状态
      setErrorMessage(friendlyMessage);

      // 显示toast通知
      toast.error(`提交失败: ${friendlyMessage}`);
      console.error("提交反馈失败:", error, technicalMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleContinueFeedback = () => {
    setIsSubmitSuccess(false);
  };

  const handleGoBack = () => {
    router.back();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
          提交反馈与建议
        </h1>
        <p className="mt-4 text-lg text-gray-600">
          我们非常重视您的意见和建议，这将帮助我们不断改进产品和服务
        </p>
      </div>

      {isSubmitSuccess ? (
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="p-6 sm:p-8 text-center">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
              <svg
                className="h-10 w-10 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                ></path>
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              反馈提交成功
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              非常感谢您的宝贵意见和建议！我们会认真阅读并尽快处理您的反馈。
              <br />
              您的支持是我们不断进步的动力。
            </p>
            <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4">
              <button
                onClick={handleContinueFeedback}
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                继续提交反馈
              </button>
              <button
                onClick={handleGoBack}
                className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                返回上一页
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="p-6 sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700"
                  >
                    您的姓名
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="name"
                      id="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                      placeholder="请输入您的姓名"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700"
                  >
                    电子邮箱
                  </label>
                  <div className="mt-1">
                    <input
                      type="email"
                      name="email"
                      id="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                      placeholder="请输入您的邮箱"
                      required
                    />
                  </div>
                </div>
              </div>

              <div>
                <label
                  htmlFor="subject"
                  className="block text-sm font-medium text-gray-700"
                >
                  反馈类型
                </label>
                <div className="mt-1">
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                    required
                  >
                    <option value="">请选择反馈类型</option>
                    <option value="功能建议">功能建议</option>
                    <option value="问题报告">问题报告</option>
                    <option value="内容反馈">内容反馈</option>
                    <option value="使用体验">使用体验</option>
                    <option value="其他">其他</option>
                  </select>
                </div>
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-gray-700"
                >
                  反馈内容
                </label>
                <div className="mt-1">
                  <textarea
                    id="message"
                    name="message"
                    rows={6}
                    value={formData.message}
                    onChange={handleChange}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                    placeholder="请详细描述您的反馈或建议..."
                    required
                  ></textarea>
                </div>
              </div>

              {/* 错误信息显示区域 */}
              {errorMessage && (
                <div className="rounded-md bg-red-50 p-4 mb-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg
                        className="h-5 w-5 text-red-400"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-red-800">
                        提交失败
                      </h3>
                      <div className="mt-2 text-sm text-red-700">
                        <p>{errorMessage}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "提交中..." : "提交反馈"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="mt-12 text-center">
        <h2 className="text-xl font-semibold text-gray-900">其他联系方式</h2>
        <p className="mt-2 text-gray-600">
          如果您有紧急问题需要解决，也可以通过以下方式联系我们
        </p>
        <div className="mt-4 flex justify-center space-x-6">
          <div className="text-center">
            <div className="text-lg font-medium text-gray-900">电子邮箱</div>
            <div className="mt-1 text-gray-600">support@MusicEmit.com</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-medium text-gray-900">客服热线</div>
            <div className="mt-1 text-gray-600">400-123-4567</div>
          </div>
        </div>
      </div>
    </div>
  );
}
