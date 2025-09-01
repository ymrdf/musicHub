"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

export default function TestUserFeaturesPage() {
  const [testResults, setTestResults] = useState<any>({});

  const runTests = async () => {
    const results: any = {};

    try {
      // 测试1: 获取用户列表
      console.log("测试1: 获取用户列表");
      const usersResponse = await axios.get("/api/users/1");
      results.users = usersResponse.data;
      console.log("用户数据:", usersResponse.data);

      // 测试2: 获取用户star的作品
      console.log("测试2: 获取用户star的作品");
      const starredResponse = await axios.get("/api/users/1/starred-works");
      results.starredWorks = starredResponse.data;
      console.log("收藏作品数据:", starredResponse.data);

      // 测试3: 获取用户关注的人
      console.log("测试3: 获取用户关注的人");
      const followingResponse = await axios.get("/api/users/1/following");
      results.following = followingResponse.data;
      console.log("关注数据:", followingResponse.data);

      // 测试4: 获取用户粉丝
      console.log("测试4: 获取用户粉丝");
      const followersResponse = await axios.get("/api/users/1/followers");
      results.followers = followersResponse.data;
      console.log("粉丝数据:", followersResponse.data);

      setTestResults(results);
      toast.success("测试完成");
    } catch (error: any) {
      console.error("测试失败:", error);
      toast.error(`测试失败: ${error.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          用户功能测试页面
        </h1>

        <button
          onClick={runTests}
          className="mb-8 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          运行测试
        </button>

        <div className="space-y-6">
          {Object.entries(testResults).map(([key, value]) => (
            <div key={key} className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 capitalize">
                {key}
              </h3>
              <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
                {JSON.stringify(value, null, 2)}
              </pre>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

