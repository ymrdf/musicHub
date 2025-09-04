import { Sequelize } from "sequelize";

// 数据库连接配置
const sequelize = new Sequelize({
  host: process.env.DB_HOST || "127.0.0.1",
  port: parseInt(process.env.DB_PORT || "3306"),
  username: process.env.DB_USER || "admin",
  password: process.env.DB_PASSWORD || "ymrdf",
  database: process.env.DB_NAME || "musicHub",
  dialect: "mysql",
  dialectModule: require("mysql2"), // 显式指定 mysql2 模块
  logging: process.env.NODE_ENV === "development" ? console.log : false,
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
  timezone: "+08:00",
  define: {
    timestamps: true,
    underscored: true,
    freezeTableName: true,
  },
});

// 测试数据库连接
export const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log("数据库连接成功");
    return true;
  } catch (error) {
    console.error("数据库连接失败:", error);
    return false;
  }
};

export default sequelize;
