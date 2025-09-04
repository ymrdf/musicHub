import { NextRequest, NextResponse } from "next/server";
import { User, Feedback } from "@/lib/models";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// 更新反馈状态
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const { status } = await req.json();

    // 验证状态值
    if (!["pending", "reviewed", "resolved"].includes(status)) {
      return NextResponse.json({ error: "无效的状态值" }, { status: 400 });
    }

    // 验证用户是否已登录且是管理员
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "未授权访问" }, { status: 401 });
    }

    // 检查用户是否是管理员
    const userId = session.user.id;
    const adminUser = await User.findOne({
      where: { id: userId },
      attributes: ["role"],
    });

    if (!adminUser || adminUser.get("role") !== "admin") {
      return NextResponse.json({ error: "没有管理员权限" }, { status: 403 });
    }

    // 更新反馈状态
    await Feedback.update({ status }, { where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("更新反馈状态时出错:", error);
    return NextResponse.json(
      { error: "服务器错误，请稍后再试" },
      { status: 500 }
    );
  }
}

// 获取单个反馈详情
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;

    // 验证用户是否已登录且是管理员
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "未授权访问" }, { status: 401 });
    }

    // 检查用户是否是管理员
    const userId = session.user.id;
    const adminUser = await User.findOne({
      where: { id: userId },
      attributes: ["role"],
    });

    if (!adminUser || adminUser.get("role") !== "admin") {
      return NextResponse.json({ error: "没有管理员权限" }, { status: 403 });
    }

    // 获取反馈详情
    const feedback = await Feedback.findByPk(id);

    if (!feedback) {
      return NextResponse.json({ error: "找不到指定的反馈" }, { status: 404 });
    }

    return NextResponse.json({ feedback });
  } catch (error) {
    console.error("获取反馈详情时出错:", error);
    return NextResponse.json(
      { error: "服务器错误，请稍后再试" },
      { status: 500 }
    );
  }
}
