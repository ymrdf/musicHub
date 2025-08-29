"use client";

import { useState } from "react";

export default function DebugPage() {
  const [testResult, setTestResult] = useState<string>("");
  const [uploadTest, setUploadTest] = useState<string>("");

  const testAPI = async () => {
    try {
      const response = await fetch("/api/test");
      const data = await response.json();
      setTestResult(JSON.stringify(data, null, 2));
    } catch (error) {
      setTestResult(`错误: ${error}`);
    }
  };

  const testUpload = async () => {
    try {
      // 创建一个测试文件
      const testFile = new File(["test audio content"], "test.mp3", {
        type: "audio/mpeg",
      });

      const formData = new FormData();
      formData.append("file", testFile);
      formData.append("type", "audio");

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      setUploadTest(JSON.stringify(data, null, 2));
    } catch (error) {
      setUploadTest(`错误: ${error}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">调试页面</h1>

          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">
                API 测试
              </h2>
              <button onClick={testAPI} className="btn-primary">
                测试 API
              </button>
              {testResult && (
                <pre className="mt-3 p-3 bg-gray-100 rounded text-sm overflow-auto">
                  {testResult}
                </pre>
              )}
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">
                上传测试
              </h2>
              <button onClick={testUpload} className="btn-primary">
                测试上传
              </button>
              {uploadTest && (
                <pre className="mt-3 p-3 bg-gray-100 rounded text-sm overflow-auto">
                  {uploadTest}
                </pre>
              )}
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">
                环境信息
              </h2>
              <div className="bg-gray-100 p-3 rounded">
                <p>
                  <strong>Node.js 版本:</strong> {process.version}
                </p>
                <p>
                  <strong>环境:</strong> {process.env.NODE_ENV}
                </p>
                <p>
                  <strong>数据库主机:</strong>{" "}
                  {process.env.DB_HOST || "127.0.0.1"}
                </p>
                <p>
                  <strong>数据库端口:</strong> {process.env.DB_PORT || "3306"}
                </p>
                <p>
                  <strong>数据库名称:</strong>{" "}
                  {process.env.DB_NAME || "musicHub"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
