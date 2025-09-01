const { sequelize } = require("../src/lib/models");
const { Comment, CommentLike } = require("../src/lib/models");

async function createTables() {
  try {
    // 同步 Comment 模型到数据库
    await Comment.sync({ alter: true });
    console.log("Comments 表创建/更新成功");

    // 同步 CommentLike 模型到数据库
    await CommentLike.sync({ alter: true });
    console.log("CommentLikes 表创建/更新成功");

    console.log("所有表创建/更新完成");
    process.exit(0);
  } catch (error) {
    console.error("创建/更新表时出错:", error);
    process.exit(1);
  }
}

createTables();
