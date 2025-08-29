#!/usr/bin/env node

const axios = require("axios");

// 配置基础 URL
const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});

// 测试数据
const testUser = {
  username: "testuser_" + Date.now(),
  email: "test_" + Date.now() + "@example.com",
  password: "TestPass123",
};

let authToken = null;

// 测试函数
async function testRegister() {
  console.log("🧪 测试用户注册...");
  try {
    const response = await api.post("/api/auth/register", {
      username: testUser.username,
      email: testUser.email,
      password: testUser.password,
      confirmPassword: testUser.password,
    });

    if (response.data.success) {
      console.log("✅ 注册成功");
      authToken = response.data.data.token;
      return true;
    } else {
      console.log("❌ 注册失败:", response.data.error);
      return false;
    }
  } catch (error) {
    console.log("❌ 注册失败:", error.response?.data?.error || error.message);
    return false;
  }
}

async function testLogin() {
  console.log("🧪 测试用户登录...");
  try {
    const response = await api.post("/api/auth/login", {
      email: testUser.email,
      password: testUser.password,
    });

    if (response.data.success) {
      console.log("✅ 登录成功");
      authToken = response.data.data.token;
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

async function testGetUserInfo() {
  console.log("🧪 测试获取用户信息...");
  try {
    const response = await api.get("/api/auth/me", {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    if (response.data.success) {
      console.log("✅ 获取用户信息成功");
      console.log("   用户:", response.data.data.username);
      console.log("   邮箱:", response.data.data.email);
      return true;
    } else {
      console.log("❌ 获取用户信息失败:", response.data.error);
      return false;
    }
  } catch (error) {
    console.log(
      "❌ 获取用户信息失败:",
      error.response?.data?.error || error.message
    );
    return false;
  }
}

async function testForgotPassword() {
  console.log("🧪 测试忘记密码...");
  try {
    const response = await api.post("/api/auth/forgot-password", {
      email: testUser.email,
    });

    if (response.data.success) {
      console.log("✅ 忘记密码请求成功");
      if (response.data.data?.resetToken) {
        console.log("   重置令牌:", response.data.data.resetToken);
      }
      return true;
    } else {
      console.log("❌ 忘记密码请求失败:", response.data.error);
      return false;
    }
  } catch (error) {
    console.log(
      "❌ 忘记密码请求失败:",
      error.response?.data?.error || error.message
    );
    return false;
  }
}

async function testResendVerification() {
  console.log("🧪 测试重发验证邮件...");
  try {
    const response = await api.post(
      "/api/auth/resend-verification",
      {},
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }
    );

    if (response.data.success) {
      console.log("✅ 重发验证邮件成功");
      if (response.data.data?.verificationToken) {
        console.log("   验证令牌:", response.data.data.verificationToken);
      }
      return true;
    } else {
      console.log("❌ 重发验证邮件失败:", response.data.error);
      return false;
    }
  } catch (error) {
    console.log(
      "❌ 重发验证邮件失败:",
      error.response?.data?.error || error.message
    );
    return false;
  }
}

async function testInvalidAuth() {
  console.log("🧪 测试无效认证...");
  try {
    const response = await api.get("/api/auth/me", {
      headers: {
        Authorization: "Bearer invalid-token",
      },
    });

    if (!response.data.success) {
      console.log("✅ 无效认证正确拒绝");
      return true;
    } else {
      console.log("❌ 无效认证未被拒绝");
      return false;
    }
  } catch (error) {
    if (error.response?.status === 401) {
      console.log("✅ 无效认证正确拒绝");
      return true;
    }
    console.log("❌ 无效认证测试失败:", error.message);
    return false;
  }
}

// 运行所有测试
async function runAllTests() {
  console.log("🚀 开始认证功能测试...\n");

  const tests = [
    { name: "注册", fn: testRegister },
    { name: "登录", fn: testLogin },
    { name: "获取用户信息", fn: testGetUserInfo },
    { name: "忘记密码", fn: testForgotPassword },
    { name: "重发验证邮件", fn: testResendVerification },
    { name: "无效认证", fn: testInvalidAuth },
  ];

  let passed = 0;
  let failed = 0;

  for (const test of tests) {
    try {
      const result = await test.fn();
      if (result) {
        passed++;
      } else {
        failed++;
      }
    } catch (error) {
      console.log(`❌ ${test.name} 测试出错:`, error.message);
      failed++;
    }
    console.log(""); // 空行分隔
  }

  console.log("📊 测试结果总结:");
  console.log(`   ✅ 通过: ${passed}`);
  console.log(`   ❌ 失败: ${failed}`);
  console.log(
    `   📈 成功率: ${((passed / (passed + failed)) * 100).toFixed(1)}%`
  );

  if (failed === 0) {
    console.log("\n🎉 所有测试通过！系统可以投入生产使用。");
    process.exit(0);
  } else {
    console.log("\n⚠️  部分测试失败，请检查系统配置。");
    process.exit(1);
  }
}

// 检查服务器是否运行
async function checkServer() {
  try {
    await api.get("/api/test");
    console.log("✅ 服务器运行正常\n");
    return true;
  } catch (error) {
    console.log("❌ 服务器未运行或无法访问");
    console.log("   请确保 Next.js 开发服务器正在运行：npm run dev");
    console.log("   或者生产服务器正在运行：npm start\n");
    return false;
  }
}

// 主函数
async function main() {
  console.log("🔍 MusicHub 认证系统测试工具\n");

  const serverOk = await checkServer();
  if (!serverOk) {
    process.exit(1);
  }

  await runAllTests();
}

// 运行测试
main().catch((error) => {
  console.error("💥 测试运行失败:", error.message);
  process.exit(1);
});
