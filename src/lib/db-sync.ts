import { sequelize } from "./models";
import { setupAssociations } from "./models";

// 同步数据库模型
export const syncDatabase = async (force: boolean = false) => {
  try {
    // 设置模型关联
    setupAssociations();

    // 同步所有模型到数据库
    await sequelize.sync({ force });

    console.log("数据库同步成功");
    return true;
  } catch (error) {
    console.error("数据库同步失败:", error);
    return false;
  }
};

// 测试数据库连接并同步
export const initializeDatabase = async () => {
  try {
    // 测试连接
    await sequelize.authenticate();
    console.log("数据库连接成功");

    // 同步模型（生产环境不要使用 force: true）
    const shouldForce = process.env.NODE_ENV === "development";
    await syncDatabase(shouldForce);

    return true;
  } catch (error) {
    console.error("数据库初始化失败:", error);
    return false;
  }
};

// 如果直接运行此脚本，执行数据库初始化
if (require.main === module) {
  initializeDatabase()
    .then(() => {
      console.log("数据库初始化完成");
      process.exit(0);
    })
    .catch((error) => {
      console.error("数据库初始化失败:", error);
      process.exit(1);
    });
}
