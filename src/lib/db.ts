// 导入sequelize实例
import sequelize from "./database";
import { Model } from "sequelize";

// 获取所有已定义的模型
const models = sequelize.models;

// 导出数据库对象
export const db = {
  ...models,
};

export default db;
