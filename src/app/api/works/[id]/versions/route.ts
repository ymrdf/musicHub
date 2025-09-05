import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/auth";
import sequelize, { QueryTypes } from "@/lib/database";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getUserFromRequest(request);
    if (!user?.id) {
      return NextResponse.json(
        { success: false, error: "未授权访问" },
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

    // 检查作品是否存在
    const work = await sequelize.query(
      "SELECT id, user_id, allow_collaboration FROM works WHERE id = ?",
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

    // 检查用户是否有权限查看版本历史（作品所有者或作品允许协作）
    if (workData.user_id !== user.id && !workData.allow_collaboration) {
      return NextResponse.json(
        { success: false, error: "无权访问版本历史" },
        { status: 403 }
      );
    }

    // 获取版本历史列表
    const versions = await sequelize.query(
      `
      SELECT 
        wv.id,
        wv.version_number,
        wv.commit_message,
        wv.changes_summary,
        wv.midi_file_path,
        wv.midi_file_size,
        wv.is_merged,
        wv.merged_at,
        wv.created_at,
        submitter.id as submitter_id,
        submitter.username as submitter_username,
        submitter.avatar_url as submitter_avatar,
        merger.id as merger_id,
        merger.username as merger_username,
        pr.id as pr_id,
        pr.title as pr_title,
        pr.status as pr_status
      FROM work_versions wv
      JOIN users submitter ON wv.user_id = submitter.id
      LEFT JOIN users merger ON wv.merged_by = merger.id
      LEFT JOIN pull_requests pr ON wv.id = pr.version_id
      WHERE wv.work_id = ?
      ORDER BY wv.created_at DESC
    `,
      {
        replacements: [workId],
        type: QueryTypes.SELECT,
      }
    );

    return NextResponse.json({
      success: true,
      data: versions,
    });
  } catch (error) {
    console.error("获取版本历史失败:", error);
    return NextResponse.json(
      { success: false, error: "获取版本历史失败" },
      { status: 500 }
    );
  }
}
