const mysql = require("mysql2/promise");

// 数据库配置
const dbConfig = {
  host: "127.0.0.1",
  user: "admin",
  password: "ymrdf",
  database: "musicHub",
};

async function initTestData() {
  let connection;

  try {
    console.log("🚀 开始初始化测试数据...\n");

    // 连接数据库
    connection = await mysql.createConnection(dbConfig);
    console.log("✅ 数据库连接成功\n");

    // 1. 检查并创建测试用户
    console.log("1. 创建测试用户...");
    const [existingUsers] = await connection.execute(`
      SELECT id FROM users WHERE email = 'test@example.com'
    `);

    let testUserId;
    if (existingUsers.length === 0) {
      const [result] = await connection.execute(`
        INSERT INTO users (username, email, password_hash, is_verified, is_active)
        VALUES ('testuser', 'test@example.com', '$2b$10$test', 1, 1)
      `);
      testUserId = result.insertId;
      console.log(`   创建测试用户，ID: ${testUserId}`);
    } else {
      testUserId = existingUsers[0].id;
      console.log(`   测试用户已存在，ID: ${testUserId}`);
    }

    // 2. 检查并创建分类数据
    console.log("\n2. 创建分类数据...");
    const categories = [
      { name: "流行", type: "genre" },
      { name: "古典", type: "genre" },
      { name: "钢琴", type: "instrument" },
      { name: "吉他", type: "instrument" },
      { name: "练习", type: "purpose" },
      { name: "表演", type: "purpose" },
    ];

    for (const category of categories) {
      const [existing] = await connection.execute(
        `
        SELECT id FROM categories WHERE name = ? AND type = ?
      `,
        [category.name, category.type]
      );

      if (existing.length === 0) {
        await connection.execute(
          `
          INSERT INTO categories (name, type, description)
          VALUES (?, ?, ?)
        `,
          [category.name, category.type, `${category.name}分类`]
        );
        console.log(`   创建分类: ${category.name} (${category.type})`);
      } else {
        console.log(`   分类已存在: ${category.name} (${category.type})`);
      }
    }

    // 3. 获取分类ID
    const [genreResult] = await connection.execute(
      `SELECT id FROM categories WHERE name = '流行' AND type = 'genre' LIMIT 1`
    );
    const [instrumentResult] = await connection.execute(
      `SELECT id FROM categories WHERE name = '钢琴' AND type = 'instrument' LIMIT 1`
    );
    const [purposeResult] = await connection.execute(
      `SELECT id FROM categories WHERE name = '练习' AND type = 'purpose' LIMIT 1`
    );

    const genreId = genreResult[0]?.id;
    const instrumentId = instrumentResult[0]?.id;
    const purposeId = purposeResult[0]?.id;

    // 4. 创建测试作品
    console.log("\n3. 创建测试作品...");
    const [existingWorks] = await connection.execute(
      `
      SELECT COUNT(*) as count FROM works WHERE user_id = ?
    `,
      [testUserId]
    );

    if (existingWorks[0].count === 0) {
      const works = [
        {
          title: "测试作品1",
          description: "这是一个测试作品",
          stars_count: 5,
          performances_count: 2,
          comments_count: 3,
          views_count: 100,
        },
        {
          title: "测试作品2",
          description: "另一个测试作品",
          stars_count: 3,
          performances_count: 1,
          comments_count: 1,
          views_count: 50,
        },
        {
          title: "测试作品3",
          description: "第三个测试作品",
          stars_count: 8,
          performances_count: 4,
          comments_count: 6,
          views_count: 200,
        },
      ];

      for (const work of works) {
        const [result] = await connection.execute(
          `
          INSERT INTO works (
            title, description, user_id, genre_id, instrument_id, purpose_id,
            stars_count, performances_count, comments_count, views_count,
            is_public, allow_collaboration, license
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, 1, 'CC BY-SA 4.0')
        `,
          [
            work.title,
            work.description,
            testUserId,
            genreId,
            instrumentId,
            purposeId,
            work.stars_count,
            work.performances_count,
            work.comments_count,
            work.views_count,
          ]
        );
        console.log(`   创建作品: ${work.title} (ID: ${result.insertId})`);
      }
    } else {
      console.log(`   已有 ${existingWorks[0].count} 个作品`);
    }

    // 5. 创建测试演奏
    console.log("\n4. 创建测试演奏...");
    const [works] = await connection.execute(
      `SELECT id FROM works WHERE user_id = ? LIMIT 1`,
      [testUserId]
    );

    if (works.length > 0) {
      const workId = works[0].id;
      const [existingPerformances] = await connection.execute(
        `
        SELECT COUNT(*) as count FROM performances WHERE user_id = ?
      `,
        [testUserId]
      );

      if (existingPerformances[0].count === 0) {
        const performances = [
          {
            title: "测试演奏1",
            description: "这是一个测试演奏",
            likes_count: 10,
            comments_count: 2,
            plays_count: 150,
          },
          {
            title: "测试演奏2",
            description: "另一个测试演奏",
            likes_count: 7,
            comments_count: 1,
            plays_count: 80,
          },
        ];

        for (const performance of performances) {
          const [result] = await connection.execute(
            `
            INSERT INTO performances (
              work_id, user_id, title, description, audio_file_path,
              likes_count, comments_count, plays_count, type, is_public
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'instrumental', 1)
          `,
            [
              workId,
              testUserId,
              performance.title,
              performance.description,
              "/uploads/audio/test.mp3",
              performance.likes_count,
              performance.comments_count,
              performance.plays_count,
            ]
          );
          console.log(
            `   创建演奏: ${performance.title} (ID: ${result.insertId})`
          );
        }
      } else {
        console.log(`   已有 ${existingPerformances[0].count} 个演奏`);
      }
    }

    // 6. 创建测试收藏
    console.log("\n5. 创建测试收藏...");
    const [existingStars] = await connection.execute(
      `
      SELECT COUNT(*) as count FROM work_stars WHERE user_id = ?
    `,
      [testUserId]
    );

    if (existingStars[0].count === 0) {
      const [allWorks] = await connection.execute(
        `SELECT id FROM works LIMIT 3`
      );

      for (const work of allWorks) {
        await connection.execute(
          `
          INSERT INTO work_stars (work_id, user_id)
          VALUES (?, ?)
        `,
          [work.id, testUserId]
        );
        console.log(`   创建收藏: 作品ID ${work.id}`);
      }
    } else {
      console.log(`   已有 ${existingStars[0].count} 个收藏`);
    }

    console.log("\n🎉 测试数据初始化完成！");
    console.log("\n现在可以测试trending页面了。");
  } catch (error) {
    console.error("❌ 初始化测试数据失败:", error.message);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// 运行初始化
initTestData();
