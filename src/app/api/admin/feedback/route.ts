import { NextRequest, NextResponse } from "next/server";
import { User, Feedback } from "@/lib/models";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// 获取所有反馈
export async function GET(req: NextRequest) {
  try {
    // 验证用户是否已登录且是管理员
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "未授权访问" }, { status: 401 });
    }

    // 检查用户是否是管理员
    // 这里应该根据你的系统实现具体的管理员检查逻辑
    const userId = session.user.id;
    const adminUser = await User.findOne({
      where: { id: userId },
      attributes: ["role"],
    });

    if (!adminUser || adminUser.get("role") !== "admin") {
      return NextResponse.json({ error: "没有管理员权限" }, { status: 403 });
    }

    // 获取所有反馈
    const feedbacks = await Feedback.findAll({
      order: [["createdAt", "DESC"]],
    });

    return NextResponse.json({ feedbacks });
  } catch (error) {
    console.error("获取反馈列表时出错:", error);
    return NextResponse.json(
      { error: "服务器错误，请稍后再试" },
      { status: 500 }
    );
  }
}
