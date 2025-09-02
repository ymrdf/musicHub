const axios = require("axios");

// 配置
const BASE_URL = "http://localhost:3000";
const TEST_WORK_ID = 1; // 假设存在一个测试作品

// 测试数据
const testUser = {
  email: "test@example.com",
  password: "test", // 使用简单的测试密码
};

let authToken = "";

// 登录获取token
async function login() {
  try {
    console.log("🔐 登录中...");
    const response = await axios.post(`${BASE_URL}/api/auth/login`, {
      email: testUser.email,
      password: testUser.password,
    });

    if (response.data.success) {
      authToken = response.data.data.token;
      console.log("✅ 登录成功");
      return true;
    } else {
      console.log("❌ 登录失败:", response.data.error);
      return false;
    }
  } catch (error) {
    console.log("❌ 登录失败:", error.response?.data?.error || error.message);
    return false;
  }
}

// 获取协作请求列表
async function getCollaborations() {
  try {
    console.log("📋 获取协作请求列表...");
    const response = await axios.get(
      `${BASE_URL}/api/works/${TEST_WORK_ID}/collaborations`,
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }
    );

    if (response.data.success) {
      console.log("✅ 获取协作请求成功");
      console.log("协作请求数量:", response.data.data.length);
      return response.data.data;
    } else {
      console.log("❌ 获取协作请求失败:", response.data.error);
      return [];
    }
  } catch (error) {
    console.log(
      "❌ 获取协作请求失败:",
      error.response?.data?.error || error.message
    );
    return [];
  }
}

// 获取版本历史
async function getVersions() {
  try {
    console.log("📚 获取版本历史...");
    const response = await axios.get(
      `${BASE_URL}/api/works/${TEST_WORK_ID}/versions`,
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }
    );

    if (response.data.success) {
      console.log("✅ 获取版本历史成功");
      console.log("版本数量:", response.data.data.length);
      return response.data.data;
    } else {
      console.log("❌ 获取版本历史失败:", response.data.error);
      return [];
    }
  } catch (error) {
    console.log(
      "❌ 获取版本历史失败:",
      error.response?.data?.error || error.message
    );
    return [];
  }
}

// 主测试函数
async function runTests() {
  console.log("🚀 开始测试协作功能...\n");

  // 1. 登录
  const loginSuccess = await login();
  if (!loginSuccess) {
    console.log("❌ 登录失败，无法继续测试");
    return;
  }

  console.log("");

  // 2. 获取协作请求
  const collaborations = await getCollaborations();

  console.log("");

  // 3. 获取版本历史
  const versions = await getVersions();

  console.log("\n📊 测试结果汇总:");
  console.log(`- 协作请求: ${collaborations.length} 个`);
  console.log(`- 版本历史: ${versions.length} 个`);

  if (collaborations.length > 0) {
    console.log("\n📋 协作请求详情:");
    collaborations.forEach((collab, index) => {
      console.log(`${index + 1}. ${collab.title} (${collab.status})`);
    });
  }

  if (versions.length > 0) {
    console.log("\n📚 版本历史详情:");
    versions.forEach((version, index) => {
      console.log(
        `${index + 1}. ${version.version_number} - ${version.commit_message}`
      );
    });
  }

  console.log("\n✅ 测试完成！");
}

// 运行测试
runTests().catch(console.error);
