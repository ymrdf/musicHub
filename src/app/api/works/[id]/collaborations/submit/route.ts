import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/auth";
import sequelize, { QueryTypes } from "@/lib/database";
import { uploadFile } from "@/lib/upload";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getUserFromRequest(request);
    if (!user?.id) {
      return NextResponse.json(
        { success: false, error: "请先登录" },
        { status: 401 }
      );
    }

    const workId = parseInt(params.id);
    if (isNaN(workId)) {
      return NextResponse.json(
        { success: false, error: "无效的作品ID" },
        { status: 400 }
      );
    }

    // 检查作品是否存在且允许协作
    const work = await sequelize.query(
      "SELECT id, user_id, allow_collaboration, title FROM works WHERE id = ?",
      {
        replacements: [workId],
        type: QueryTypes.SELECT,
      }
    );

    if ((work as any[]).length === 0) {
      return NextResponse.json(
        { success: false, error: "作品不存在" },
        { status: 404 }
      );
    }

    const workData = work[0] as any;

    if (!workData.allow_collaboration) {
      return NextResponse.json(
        { success: false, error: "该作品不允许协作" },
        { status: 403 }
      );
    }

    if (workData.user_id === user.id) {
      return NextResponse.json(
        { success: false, error: "不能对自己的作品提交协作请求" },
        { status: 400 }
      );
    }

    const formData = await request.formData();
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const commitMessage = formData.get("commitMessage") as string;
    const changesSummary = formData.get("changesSummary") as string;
    const midiFile = formData.get("midiFile") as File;

    // 验证必填字段
    if (!title || !commitMessage || !midiFile) {
      return NextResponse.json(
        { success: false, error: "请填写所有必填字段并上传MIDI文件" },
        { status: 400 }
      );
    }

    // 验证文件类型
    if (!midiFile.name.toLowerCase().endsWith(".mid")) {
      return NextResponse.json(
        { success: false, error: "只支持MIDI文件格式" },
        { status: 400 }
      );
    }

    // 验证文件大小（限制为10MB）
    if (midiFile.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { success: false, error: "文件大小不能超过10MB" },
        { status: 400 }
      );
    }

    // 上传MIDI文件
    const uploadResult = await uploadFile(midiFile, "midi");
    if (!uploadResult.success) {
      return NextResponse.json(
        { success: false, error: uploadResult.error || "文件上传失败" },
        { status: 500 }
      );
    }

    // 生成版本号
    const timestamp = Date.now();
    const versionNumber = `v1.${timestamp}`;

    // 开始数据库事务
    const transaction = await sequelize.transaction();

    try {
      // 创建版本记录
      const versionResult = await sequelize.query(
        `
        INSERT INTO work_versions (
          work_id, version_number, user_id, commit_message, 
          midi_file_path, midi_file_size, changes_summary
        ) VALUES (?, ?, ?, ?, ?, ?, ?)
      `,
        {
          replacements: [
            workId,
            versionNumber,
            user.id,
            commitMessage,
            uploadResult.filePath,
            midiFile.size,
            changesSummary || "",
          ],
          type: QueryTypes.INSERT,
          transaction,
        }
      );

      const versionId = (versionResult as any)[0];

      // 创建协作请求
      const prResult = await sequelize.query(
        `
        INSERT INTO pull_requests (
          work_id, version_id, requester_id, title, description
        ) VALUES (?, ?, ?, ?, ?)
      `,
        {
          replacements: [workId, versionId, user.id, title, description || ""],
          type: QueryTypes.INSERT,
          transaction,
        }
      );

      await transaction.commit();

      return NextResponse.json({
        success: true,
        data: {
          id: (prResult as any)[0],
          versionNumber,
          message: "协作请求提交成功",
        },
      });
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  } catch (error) {
    console.error("提交协作请求失败:", error);
    return NextResponse.json(
      { success: false, error: "提交协作请求失败" },
      { status: 500 }
    );
  }
}
