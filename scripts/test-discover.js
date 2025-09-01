const axios = require("axios");

// 测试配置
const BASE_URL = "http://localhost:3000";

async function testDiscoverAPIs() {
  try {
    console.log("🧪 开始测试 Discover 页面 API...\n");

    // 1. 测试作品API
    console.log("1. 测试作品API...");
    try {
      const worksResponse = await axios.get(`${BASE_URL}/api/works?limit=5`);
      console.log("✅ 作品API响应状态:", worksResponse.status);
      console.log("   响应数据结构:", Object.keys(worksResponse.data));
      if (worksResponse.data.data) {
        console.log("   数据属性:", Object.keys(worksResponse.data.data));
        if (worksResponse.data.data.items) {
          console.log("   作品数量:", worksResponse.data.data.items.length);
          if (worksResponse.data.data.items.length > 0) {
            console.log("   第一个作品:", {
              id: worksResponse.data.data.items[0].id,
              title: worksResponse.data.data.items[0].title,
              user: worksResponse.data.data.items[0].user?.username,
            });
          }
        }
      }
    } catch (error) {
      console.error("❌ 作品API测试失败:", error.message);
      if (error.response) {
        console.error("   状态码:", error.response.status);
        console.error("   响应数据:", error.response.data);
      }
    }

    console.log("");

    // 2. 测试演奏API
    console.log("2. 测试演奏API...");
    try {
      const performancesResponse = await axios.get(
        `${BASE_URL}/api/performances?limit=5`
      );
      console.log("✅ 演奏API响应状态:", performancesResponse.status);
      console.log("   响应数据结构:", Object.keys(performancesResponse.data));
      if (performancesResponse.data.data) {
        console.log(
          "   数据属性:",
          Object.keys(performancesResponse.data.data)
        );
        if (performancesResponse.data.data.items) {
          console.log(
            "   演奏数量:",
            performancesResponse.data.data.items.length
          );
          if (performancesResponse.data.data.items.length > 0) {
            console.log("   第一个演奏:", {
              id: performancesResponse.data.data.items[0].id,
              title: performancesResponse.data.data.items[0].title,
              user: performancesResponse.data.data.items[0].user?.username,
            });
          }
        }
      }
    } catch (error) {
      console.error("❌ 演奏API测试失败:", error.message);
      if (error.response) {
        console.error("   状态码:", error.response.status);
        console.error("   响应数据:", error.response.data);
      }
    }

    console.log("");

    // 3. 测试分类API
    console.log("3. 测试分类API...");
    try {
      const categoriesResponse = await axios.get(`${BASE_URL}/api/categories`);
      console.log("✅ 分类API响应状态:", categoriesResponse.status);
      if (categoriesResponse.data.data) {
        console.log("   分类数量:", categoriesResponse.data.data.length);
      }
    } catch (error) {
      console.error("❌ 分类API测试失败:", error.message);
    }

    console.log("");

    // 4. 测试标签API
    console.log("4. 测试标签API...");
    try {
      const tagsResponse = await axios.get(`${BASE_URL}/api/tags?limit=10`);
      console.log("✅ 标签API响应状态:", tagsResponse.status);
      if (tagsResponse.data.data) {
        console.log("   标签数量:", tagsResponse.data.data.length);
      }
    } catch (error) {
      console.error("❌ 标签API测试失败:", error.message);
    }

    console.log("\n🎉 API测试完成！");
  } catch (error) {
    console.error("❌ 测试过程中发生错误:", error.message);
    process.exit(1);
  }
}

// 运行测试
testDiscoverAPIs();
