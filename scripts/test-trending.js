const axios = require("axios");

// 测试配置
const BASE_URL = "http://localhost:3000";

async function testTrendingAPI() {
  try {
    console.log("🧪 开始测试 Trending API...\n");

    // 1. 测试trending API - 所有内容
    console.log("1. 测试trending API (所有内容)...");
    try {
      const response = await axios.get(
        `${BASE_URL}/api/trending?type=all&timePeriod=all`
      );
      console.log("✅ Trending API响应状态:", response.status);
      console.log("   响应数据结构:", Object.keys(response.data));

      if (response.data.success) {
        console.log("   数据属性:", Object.keys(response.data.data));
        console.log("   返回项目数:", response.data.data.items.length);
        console.log("   时间周期:", response.data.data.timePeriod);
        console.log("   内容类型:", response.data.data.type);

        if (response.data.data.items.length > 0) {
          console.log("   第一个项目:", {
            id: response.data.data.items[0].id,
            type: response.data.data.items[0].type,
            title: response.data.data.items[0].title,
            starsCount: response.data.data.items[0].starsCount,
            likesCount: response.data.data.items[0].likesCount,
          });
        } else {
          console.log("   ⚠️ 没有返回任何项目");
        }
      } else {
        console.log("   ❌ API返回错误:", response.data.error);
      }
    } catch (error) {
      console.error("❌ Trending API测试失败:", error.message);
      if (error.response) {
        console.error("   状态码:", error.response.status);
        console.error("   响应数据:", error.response.data);
      }
    }

    console.log("");

    // 2. 测试trending API - 只显示作品
    console.log("2. 测试trending API (只显示作品)...");
    try {
      const response = await axios.get(
        `${BASE_URL}/api/trending?type=work&timePeriod=weekly`
      );
      if (response.data.success) {
        console.log("   作品数量:", response.data.data.items.length);
        if (response.data.data.items.length > 0) {
          console.log("   第一个作品:", {
            id: response.data.data.items[0].id,
            title: response.data.data.items[0].title,
            starsCount: response.data.data.items[0].starsCount,
          });
        }
      }
    } catch (error) {
      console.error("❌ 作品trending测试失败:", error.message);
    }

    console.log("");

    // 3. 测试trending API - 只显示演奏
    console.log("3. 测试trending API (只显示演奏)...");
    try {
      const response = await axios.get(
        `${BASE_URL}/api/trending?type=performance&timePeriod=weekly`
      );
      if (response.data.success) {
        console.log("   演奏数量:", response.data.data.items.length);
        if (response.data.data.items.length > 0) {
          console.log("   第一个演奏:", {
            id: response.data.data.items[0].id,
            title: response.data.data.items[0].title,
            likesCount: response.data.data.items[0].likesCount,
          });
        }
      }
    } catch (error) {
      console.error("❌ 演奏trending测试失败:", error.message);
    }

    console.log("");

    // 4. 测试不同时间周期
    console.log("4. 测试不同时间周期...");
    const timePeriods = ["all", "daily", "weekly", "monthly"];
    for (const period of timePeriods) {
      try {
        const response = await axios.get(
          `${BASE_URL}/api/trending?timePeriod=${period}`
        );
        if (response.data.success) {
          console.log(
            `   ${period}: ${response.data.data.items.length} 个项目`
          );
        }
      } catch (error) {
        console.error(`   ❌ ${period}测试失败:`, error.message);
      }
    }

    console.log("");

    // 5. 直接检查数据库数据
    console.log("5. 检查基础API数据...");

    // 检查作品数据
    try {
      const worksResponse = await axios.get(`${BASE_URL}/api/works?limit=5`);
      if (worksResponse.data.success) {
        console.log("   作品总数:", worksResponse.data.data.total);
        console.log("   返回作品数:", worksResponse.data.data.items.length);
        if (worksResponse.data.data.items.length > 0) {
          const work = worksResponse.data.data.items[0];
          console.log("   第一个作品详情:", {
            id: work.id,
            title: work.title,
            starsCount: work.starsCount,
            isPublic: work.isPublic,
            createdAt: work.createdAt,
          });
        }
      }
    } catch (error) {
      console.error("❌ 作品API检查失败:", error.message);
    }

    // 检查演奏数据
    try {
      const performancesResponse = await axios.get(
        `${BASE_URL}/api/performances?limit=5`
      );
      if (performancesResponse.data.success) {
        console.log("   演奏总数:", performancesResponse.data.data.total);
        console.log(
          "   返回演奏数:",
          performancesResponse.data.data.items.length
        );
        if (performancesResponse.data.data.items.length > 0) {
          const performance = performancesResponse.data.data.items[0];
          console.log("   第一个演奏详情:", {
            id: performance.id,
            title: performance.title,
            likesCount: performance.likesCount,
            isPublic: performance.isPublic,
            createdAt: performance.createdAt,
          });
        }
      }
    } catch (error) {
      console.error("❌ 演奏API检查失败:", error.message);
    }

    console.log("\n🎉 Trending API测试完成！");
  } catch (error) {
    console.error("❌ 测试过程中发生错误:", error.message);
    process.exit(1);
  }
}

// 运行测试
testTrendingAPI();
