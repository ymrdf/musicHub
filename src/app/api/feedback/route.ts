import { NextRequest, NextResponse } from "next/server";
import { Feedback } from "@/lib/models";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, subject, message } = body;

    // 验证必填字段
    if (!email || !subject || !message) {
      return NextResponse.json(
        { error: "邮箱、反馈类型和反馈内容为必填项" },
        { status: 400 }
      );
    }

    // 将反馈保存到数据库
    try {
      // 使用Sequelize模型创建记录
      await Feedback.create({
        name: name || "匿名用户",
        email,
        subject,
        message,
        status: "pending",
      });

      return NextResponse.json(
        { success: true, message: "反馈已成功提交" },
        { status: 200 }
      );
    } catch (dbError: any) {
      // 如果数据库操作失败，记录错误
      console.error("保存反馈到数据库失败:", dbError);
      // 记录到控制台
      console.log("收到新的反馈但保存失败:", { name, email, subject, message });

      // 返回错误响应
      return NextResponse.json(
        {
          success: false,
          message: "反馈提交失败，数据库错误",
          error: dbError.original?.sqlMessage || "数据库错误",
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("处理反馈提交时出错:", error);
    return NextResponse.json(
      { error: "服务器错误，请稍后再试" },
      { status: 500 }
    );
  }
}
