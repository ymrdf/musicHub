// Sequelize 数据库配置文件
// 这个文件可以被 Next.js 项目引用

module.exports = {
  development: {
    username: process.env.DB_USER || "admin",
    password: process.env.DB_PASSWORD || "ymrdf",
    database: process.env.DB_NAME || "musicHub",
    host: process.env.DB_HOST || "127.0.0.1",
    port: process.env.DB_PORT || 3306,
    dialect: "mysql",
    timezone: "+08:00", // 设置时区
    define: {
      charset: "utf8mb4",
      collate: "utf8mb4_unicode_ci",
      timestamps: true, // 自动添加 createdAt 和 updatedAt
      underscored: false, // 使用驼峰命名
      freezeTableName: true, // 禁止表名复数化
    },
    pool: {
      max: 10, // 连接池最大连接数
      min: 0, // 连接池最小连接数
      acquire: 30000, // 获取连接的最长时间
      idle: 10000, // 连接空闲的最长时间
    },
    logging: console.log, // 开发环境显示SQL日志
    dialectOptions: {
      charset: "utf8mb4",
      supportBigNumbers: true,
      bigNumberStrings: true,
      decimalNumbers: true,
    },
  },

  test: {
    username: process.env.DB_USER || "admin",
    password: process.env.DB_PASSWORD || "ymrdf",
    database: process.env.DB_NAME_TEST || "musicHub_test",
    host: process.env.DB_HOST || "127.0.0.1",
    port: process.env.DB_PORT || 3306,
    dialect: "mysql",
    timezone: "+08:00",
    define: {
      charset: "utf8mb4",
      collate: "utf8mb4_unicode_ci",
      timestamps: true,
      underscored: false,
      freezeTableName: true,
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    logging: false, // 测试环境关闭SQL日志
    dialectOptions: {
      charset: "utf8mb4",
      supportBigNumbers: true,
      bigNumberStrings: true,
      decimalNumbers: true,
    },
  },

  production: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306,
    dialect: "mysql",
    timezone: "+08:00",
    define: {
      charset: "utf8mb4",
      collate: "utf8mb4_unicode_ci",
      timestamps: true,
      underscored: false,
      freezeTableName: true,
    },
    pool: {
      max: 20, // 生产环境增加连接池大小
      min: 5,
      acquire: 30000,
      idle: 10000,
    },
    logging: false, // 生产环境关闭SQL日志
    dialectOptions: {
      charset: "utf8mb4",
      supportBigNumbers: true,
      bigNumberStrings: true,
      decimalNumbers: true,
      ssl:
        process.env.DB_SSL === "true"
          ? {
              require: true,
              rejectUnauthorized: false,
            }
          : false,
    },
  },
};
