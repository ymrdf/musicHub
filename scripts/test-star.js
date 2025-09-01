const axios = require("axios");

// 测试配置
const BASE_URL = "http://localhost:3000";
const TEST_USER = {
  email: "test@example.com",
  password: "password123",
};

async function testStarFunctionality() {
  try {
    console.log("🧪 开始测试 Star 功能...\n");

    // 1. 登录用户
    console.log("1. 测试用户登录...");
    const loginResponse = await axios.post(
      `${BASE_URL}/api/auth/login`,
      TEST_USER
    );

    if (!loginResponse.data.success) {
      throw new Error("登录失败: " + loginResponse.data.error);
    }

    const token = loginResponse.data.data.token;
    const authHeader = { Authorization: `Bearer ${token}` };
    console.log("✅ 登录成功\n");

    // 2. 获取作品列表
    console.log("2. 获取作品列表...");
    const worksResponse = await axios.get(`${BASE_URL}/api/works`, {
      headers: authHeader,
    });

    if (
      !worksResponse.data.success ||
      worksResponse.data.data.works.length === 0
    ) {
      throw new Error("没有找到作品");
    }

    const workId = worksResponse.data.data.works[0].id;
    console.log(`✅ 找到作品 ID: ${workId}\n`);

    // 3. 测试收藏作品
    console.log("3. 测试收藏作品...");
    const starResponse = await axios.post(
      `${BASE_URL}/api/works/${workId}/star`,
      {},
      { headers: authHeader }
    );

    if (!starResponse.data.success) {
      throw new Error("收藏失败: " + starResponse.data.error);
    }

    console.log("✅ 收藏成功");
    console.log(`   收藏数: ${starResponse.data.data.starsCount}\n`);

    // 4. 测试取消收藏
    console.log("4. 测试取消收藏...");
    const unstarResponse = await axios.delete(
      `${BASE_URL}/api/works/${workId}/star`,
      { headers: authHeader }
    );

    if (!unstarResponse.data.success) {
      throw new Error("取消收藏失败: " + unstarResponse.data.error);
    }

    console.log("✅ 取消收藏成功");
    console.log(`   收藏数: ${unstarResponse.data.data.starsCount}\n`);

    // 5. 测试热门榜单API
    console.log("5. 测试热门榜单API...");
    const trendingResponse = await axios.get(
      `${BASE_URL}/api/trending?type=work&timePeriod=weekly`,
      { headers: authHeader }
    );

    if (!trendingResponse.data.success) {
      throw new Error("获取热门榜单失败: " + trendingResponse.data.error);
    }

    console.log("✅ 热门榜单API正常");
    console.log(`   返回项目数: ${trendingResponse.data.data.items.length}\n`);

    console.log("🎉 所有测试通过！Star 功能正常工作。");
  } catch (error) {
    console.error("❌ 测试失败:", error.message);
    if (error.response) {
      console.error("响应状态:", error.response.status);
      console.error("响应数据:", error.response.data);
    }
    process.exit(1);
  }
}

// 运行测试
testStarFunctionality();
