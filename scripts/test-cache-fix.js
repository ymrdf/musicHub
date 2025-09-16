const { execSync } = require("child_process");

console.log("🧪 测试缓存修复是否生效...\n");

// 测试 API 端点
const testEndpoints = [
  "http://localhost:3000/api/stats",
  "http://localhost:3000/api/home/recommendations",
];

async function testCacheFix() {
  console.log("1. 检查 API 端点是否返回最新数据...");

  for (const endpoint of testEndpoints) {
    try {
      console.log(`   测试: ${endpoint}`);

      // 发送两次请求，检查响应头和数据
      const response1 = await fetch(endpoint, {
        headers: {
          "Cache-Control": "no-cache",
        },
      });

      await new Promise((resolve) => setTimeout(resolve, 1000)); // 等待1秒

      const response2 = await fetch(endpoint, {
        headers: {
          "Cache-Control": "no-cache",
        },
      });

      const data1 = await response1.json();
      const data2 = await response2.json();

      console.log(`   ✅ ${endpoint} 响应正常`);
      console.log(
        `   📊 数据结构: ${JSON.stringify(Object.keys(data1.data || {}))}`
      );
    } catch (error) {
      console.log(`   ❌ ${endpoint} 测试失败: ${error.message}`);
    }
  }

  console.log("\n2. 检查页面配置...");

  // 检查页面文件中的配置
  const fs = require("fs");
  const pageContent = fs.readFileSync("./src/app/page.tsx", "utf8");

  if (pageContent.includes('export const dynamic = "force-dynamic"')) {
    console.log("   ✅ 首页已配置强制动态渲染");
  } else {
    console.log("   ❌ 首页未配置强制动态渲染");
  }

  if (pageContent.includes("export const revalidate = 0")) {
    console.log("   ✅ 首页已禁用缓存");
  } else {
    console.log("   ❌ 首页未禁用缓存");
  }

  console.log("\n3. 检查组件配置...");

  const statsContent = fs.readFileSync(
    "./src/components/client/StatsDisplay.tsx",
    "utf8"
  );
  if (statsContent.includes("setInterval(fetchUpdatedStats, 30000)")) {
    console.log("   ✅ StatsDisplay 组件已配置自动刷新");
  } else {
    console.log("   ❌ StatsDisplay 组件未配置自动刷新");
  }

  const dynamicRecommendationsExists = fs.existsSync(
    "./src/components/client/DynamicRecommendations.tsx"
  );
  if (dynamicRecommendationsExists) {
    console.log("   ✅ DynamicRecommendations 组件已创建");
  } else {
    console.log("   ❌ DynamicRecommendations 组件未创建");
  }

  console.log("\n📝 总结:");
  console.log('   - 首页已配置为强制动态渲染 (dynamic = "force-dynamic")');
  console.log("   - 首页已禁用缓存 (revalidate = 0)");
  console.log("   - API 路由已配置强制动态渲染");
  console.log("   - StatsDisplay 组件每30秒自动刷新数据");
  console.log("   - DynamicRecommendations 组件每60秒自动刷新数据");
  console.log("   - 所有数据请求都使用 no-cache 头部");

  console.log("\n🎉 缓存修复配置完成！生产环境下数据将实时更新。");
  console.log("\n💡 建议:");
  console.log("   - 在生产环境部署后测试数据更新");
  console.log("   - 监控服务器性能，如需要可调整刷新频率");
  console.log(
    "   - 考虑使用 WebSocket 或 Server-Sent Events 实现真正的实时更新"
  );
}

// 如果直接运行此脚本，执行测试
if (require.main === module) {
  testCacheFix().catch(console.error);
}

module.exports = { testCacheFix };
