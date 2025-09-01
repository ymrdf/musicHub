const fs = require("fs");
const path = require("path");
const mysql = require("mysql2/promise");
const dotenv = require("dotenv");

// 加载环境变量
dotenv.config();

// 数据库配置
const dbConfig = {
  host: process.env.DB_HOST || "127.0.0.1",
  port: parseInt(process.env.DB_PORT || "3306"),
  user: process.env.DB_USER || "admin",
  password: process.env.DB_PASSWORD || "ymrdf",
  database: process.env.DB_NAME || "musicHub",
  multipleStatements: true,
};

async function runMigration() {
  try {
    // 创建数据库连接
    const connection = await mysql.createConnection(dbConfig);
    console.log("数据库连接成功");

    // 读取迁移文件
    const migrationsDir = path.join(__dirname, "../database/migrations");
    const files = fs.readdirSync(migrationsDir);

    // 按文件名排序
    files.sort();

    for (const file of files) {
      if (file.endsWith(".sql")) {
        console.log(`执行迁移: ${file}`);
        const sql = fs.readFileSync(path.join(migrationsDir, file), "utf8");
        await connection.query(sql);
        console.log(`迁移完成: ${file}`);
      }
    }

    await connection.end();
    console.log("所有迁移执行完成");
  } catch (error) {
    console.error("执行迁移时出错:", error);
    process.exit(1);
  }
}

runMigration();
