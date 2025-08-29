#!/usr/bin/env ts-node

import { initializeDatabase } from "../src/lib/db-sync";

async function setupDatabase() {
  console.log("开始设置数据库...");

  const success = await initializeDatabase();

  if (success) {
    console.log("✅ 数据库设置完成");
  } else {
    console.log("❌ 数据库设置失败");
    process.exit(1);
  }
}

setupDatabase();
