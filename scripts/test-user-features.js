const { User, Work, UserFollow, WorkStar } = require("../src/lib/models");
const { testConnection } = require("../src/lib/database");

async function testUserFeatures() {
  try {
    console.log("测试数据库连接...");
    const isConnected = await testConnection();
    if (!isConnected) {
      console.error("数据库连接失败");
      return;
    }
    console.log("数据库连接成功");

    // 测试获取用户
    console.log("\n测试获取用户...");
    const users = await User.findAll({ limit: 5 });
    console.log(`找到 ${users.length} 个用户`);

    if (users.length > 0) {
      const testUser = users[0];
      console.log(`测试用户: ${testUser.username} (ID: ${testUser.id})`);

      // 测试获取用户的作品
      console.log("\n测试获取用户作品...");
      const works = await Work.findAll({
        where: { userId: testUser.id },
        limit: 5,
      });
      console.log(`用户有 ${works.length} 个作品`);

      // 测试获取用户的关注关系
      console.log("\n测试获取用户关注关系...");
      const following = await UserFollow.findAll({
        where: { followerId: testUser.id },
        limit: 5,
      });
      console.log(`用户关注了 ${following.length} 个人`);

      const followers = await UserFollow.findAll({
        where: { followingId: testUser.id },
        limit: 5,
      });
      console.log(`用户有 ${followers.length} 个粉丝`);

      // 测试获取用户的收藏
      console.log("\n测试获取用户收藏...");
      const starredWorks = await WorkStar.findAll({
        where: { userId: testUser.id },
        limit: 5,
      });
      console.log(`用户收藏了 ${starredWorks.length} 个作品`);
    }

    console.log("\n测试完成");
  } catch (error) {
    console.error("测试失败:", error);
  } finally {
    process.exit(0);
  }
}

testUserFeatures();

