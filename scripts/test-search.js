const axios = require("axios");

const BASE_URL = "http://localhost:3000";

async function testSearch() {
  console.log("🧪 测试搜索功能...\n");

  try {
    // 测试搜索作品
    console.log("1. 测试搜索作品...");
    const worksResponse = await axios.get(
      `${BASE_URL}/api/search?q=test&type=works`
    );
    console.log("✅ 作品搜索成功:", worksResponse.data.success);
    console.log(
      "   结果数量:",
      worksResponse.data.data?.results?.works?.total || 0
    );
    console.log("");

    // 测试搜索用户
    console.log("2. 测试搜索用户...");
    const usersResponse = await axios.get(
      `${BASE_URL}/api/search?q=test&type=users`
    );
    console.log("✅ 用户搜索成功:", usersResponse.data.success);
    console.log(
      "   结果数量:",
      usersResponse.data.data?.results?.users?.total || 0
    );
    console.log("");

    // 测试搜索演奏
    console.log("3. 测试搜索演奏...");
    const performancesResponse = await axios.get(
      `${BASE_URL}/api/search?q=test&type=performances`
    );
    console.log("✅ 演奏搜索成功:", performancesResponse.data.success);
    console.log(
      "   结果数量:",
      performancesResponse.data.data?.results?.performances?.total || 0
    );
    console.log("");

    // 测试综合搜索
    console.log("4. 测试综合搜索...");
    const allResponse = await axios.get(
      `${BASE_URL}/api/search?q=test&type=all`
    );
    console.log("✅ 综合搜索成功:", allResponse.data.success);
    console.log(
      "   作品数量:",
      allResponse.data.data?.results?.works?.total || 0
    );
    console.log(
      "   用户数量:",
      allResponse.data.data?.results?.users?.total || 0
    );
    console.log(
      "   演奏数量:",
      allResponse.data.data?.results?.performances?.total || 0
    );
    console.log("");

    // 测试空搜索
    console.log("5. 测试空搜索...");
    try {
      await axios.get(`${BASE_URL}/api/search?q=&type=all`);
      console.log("❌ 空搜索应该失败但成功了");
    } catch (error) {
      console.log("✅ 空搜索正确返回错误:", error.response?.data?.error);
    }
    console.log("");

    console.log("🎉 所有搜索测试完成！");
  } catch (error) {
    console.error("❌ 搜索测试失败:", error.message);
    if (error.response) {
      console.error("   状态码:", error.response.status);
      console.error("   错误信息:", error.response.data);
    }
  }
}

// 运行测试
testSearch();
