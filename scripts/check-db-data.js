const mysql = require("mysql2/promise");

// 数据库配置
const dbConfig = {
  host: "127.0.0.1",
  user: "admin",
  password: "ymrdf",
  database: "musicHub",
};

async function checkDatabaseData() {
  let connection;

  try {
    console.log("🔍 开始检查数据库数据...\n");

    // 连接数据库
    connection = await mysql.createConnection(dbConfig);
    console.log("✅ 数据库连接成功\n");

    // 1. 检查作品数据
    console.log("1. 检查作品数据...");
    const [works] = await connection.execute(`
      SELECT 
        w.id,
        w.title,
        w.is_public,
        w.stars_count,
        w.performances_count,
        w.comments_count,
        w.views_count,
        w.created_at,
        u.username
      FROM works w
      LEFT JOIN users u ON w.user_id = u.id
      ORDER BY w.created_at DESC
      LIMIT 10
    `);

    console.log(`   作品总数: ${works.length}`);
    if (works.length > 0) {
      console.log("   最近的作品:");
      works.forEach((work, index) => {
        console.log(
          `     ${index + 1}. ID: ${work.id}, 标题: ${work.title}, 公开: ${
            work.is_public
          }, 收藏数: ${work.stars_count}, 创建时间: ${work.created_at}, 作者: ${
            work.username
          }`
        );
      });
    } else {
      console.log("   ⚠️ 没有找到任何作品");
    }

    console.log("");

    // 2. 检查演奏数据
    console.log("2. 检查演奏数据...");
    const [performances] = await connection.execute(`
      SELECT 
        p.id,
        p.title,
        p.is_public,
        p.likes_count,
        p.comments_count,
        p.plays_count,
        p.created_at,
        u.username
      FROM performances p
      LEFT JOIN users u ON p.user_id = u.id
      ORDER BY p.created_at DESC
      LIMIT 10
    `);

    console.log(`   演奏总数: ${performances.length}`);
    if (performances.length > 0) {
      console.log("   最近的演奏:");
      performances.forEach((performance, index) => {
        console.log(
          `     ${index + 1}. ID: ${performance.id}, 标题: ${
            performance.title
          }, 公开: ${performance.is_public}, 点赞数: ${
            performance.likes_count
          }, 创建时间: ${performance.created_at}, 作者: ${performance.username}`
        );
      });
    } else {
      console.log("   ⚠️ 没有找到任何演奏");
    }

    console.log("");

    // 3. 检查用户数据
    console.log("3. 检查用户数据...");
    const [users] = await connection.execute(`
      SELECT id, username, email, is_active
      FROM users
      ORDER BY created_at DESC
      LIMIT 5
    `);

    console.log(`   用户总数: ${users.length}`);
    if (users.length > 0) {
      console.log("   最近的用户:");
      users.forEach((user, index) => {
        console.log(
          `     ${index + 1}. ID: ${user.id}, 用户名: ${user.username}, 邮箱: ${
            user.email
          }, 激活: ${user.is_active}`
        );
      });
    }

    console.log("");

    // 4. 检查收藏数据
    console.log("4. 检查收藏数据...");
    const [stars] = await connection.execute(`
      SELECT 
        ws.id,
        ws.work_id,
        ws.user_id,
        ws.created_at,
        w.title as work_title,
        u.username
      FROM work_stars ws
      LEFT JOIN works w ON ws.work_id = w.id
      LEFT JOIN users u ON ws.user_id = u.id
      ORDER BY ws.created_at DESC
      LIMIT 10
    `);

    console.log(`   收藏总数: ${stars.length}`);
    if (stars.length > 0) {
      console.log("   最近的收藏:");
      stars.forEach((star, index) => {
        console.log(
          `     ${index + 1}. 作品: ${star.work_title}, 用户: ${
            star.username
          }, 收藏时间: ${star.created_at}`
        );
      });
    } else {
      console.log("   ⚠️ 没有找到任何收藏记录");
    }

    console.log("");

    // 5. 检查时间筛选条件
    console.log("5. 检查时间筛选条件...");
    const [currentTime] = await connection.execute(
      "SELECT NOW() as current_time, CURDATE() as current_date"
    );
    console.log(`   当前时间: ${currentTime[0].current_time}`);
    console.log(`   当前日期: ${currentTime[0].current_date}`);

    // 检查本周的作品
    const [weeklyWorks] = await connection.execute(`
      SELECT COUNT(*) as count
      FROM works 
      WHERE YEARWEEK(created_at) = YEARWEEK(CURDATE())
    `);
    console.log(`   本周作品数: ${weeklyWorks[0].count}`);

    // 检查本月的作品
    const [monthlyWorks] = await connection.execute(`
      SELECT COUNT(*) as count
      FROM works 
      WHERE YEAR(created_at) = YEAR(CURDATE()) AND MONTH(created_at) = MONTH(CURDATE())
    `);
    console.log(`   本月作品数: ${monthlyWorks[0].count}`);

    // 检查今天的作品
    const [dailyWorks] = await connection.execute(`
      SELECT COUNT(*) as count
      FROM works 
      WHERE DATE(created_at) = CURDATE()
    `);
    console.log(`   今日作品数: ${dailyWorks[0].count}`);

    console.log("\n🎉 数据库检查完成！");
  } catch (error) {
    console.error("❌ 数据库检查失败:", error.message);
    if (error.code === "ECONNREFUSED") {
      console.error("   请确保MySQL服务正在运行");
    } else if (error.code === "ER_ACCESS_DENIED_ERROR") {
      console.error("   请检查数据库用户名和密码");
    }
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// 运行检查
checkDatabaseData();
