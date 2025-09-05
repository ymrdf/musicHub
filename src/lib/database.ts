import { Sequelize, QueryTypes } from "sequelize";

// Database connection configuration
const sequelize = new Sequelize({
  host: process.env.DB_HOST || "127.0.0.1",
  port: parseInt(process.env.DB_PORT || "3306"),
  username: process.env.DB_USER || "admin",
  password: process.env.DB_PASSWORD || "ymrdf",
  database: process.env.DB_NAME || "MusicEmit",
  dialect: "mysql",
  dialectModule: require("mysql2"), // Explicitly specify mysql2 module
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

// Test database connection
export const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connection successful");
    return true;
  } catch (error) {
    console.error("Database connection failed:", error);
    return false;
  }
};

export default sequelize;
export { QueryTypes };
