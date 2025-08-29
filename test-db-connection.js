#!/usr/bin/env node

// 简单的数据库连接测试
const { Sequelize } = require("sequelize");

const sequelize = new Sequelize({
  host: process.env.DB_HOST || "127.0.0.1",
  port: parseInt(process.env.DB_PORT || "3306"),
  username: process.env.DB_USER || "admin",
  password: process.env.DB_PASSWORD || "ymrdf",
  database: process.env.DB_NAME || "musicHub",
  dialect: "mysql",
  logging: console.log,
});

async function testConnection() {
  try {
    console.log("🔍 正在测试数据库连接...");
    await sequelize.authenticate();
    console.log("✅ 数据库连接成功!");
    await sequelize.close();
    process.exit(0);
  } catch (error) {
    console.error("❌ 数据库连接失败:", error.message);
    console.error("详细错误:", error);
    process.exit(1);
  }
}

testConnection();
