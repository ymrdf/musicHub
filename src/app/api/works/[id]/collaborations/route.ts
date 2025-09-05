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

    // 检查用户是否有权限查看协作请求（作品所有者或作品允许协作）
    if (workData.user_id !== user.id && !workData.allow_collaboration) {
      return NextResponse.json(
        { success: false, error: "无权访问协作信息" },
        { status: 403 }
      );
    }

    // 获取协作请求列表
    const pullRequests = await sequelize.query(
      `
      SELECT 
        pr.id,
        pr.title,
        pr.description,
        pr.status,
        pr.created_at,
        pr.updated_at,
        pr.review_comment,
        pr.reviewed_at,
        wv.version_number,
        wv.commit_message,
        wv.changes_summary,
        wv.midi_file_path,
        wv.midi_file_size,
        requester.id as requester_id,
        requester.username as requester_username,
        requester.avatar_url as requester_avatar,
        reviewer.id as reviewer_id,
        reviewer.username as reviewer_username
      FROM pull_requests pr
      JOIN work_versions wv ON pr.version_id = wv.id
      JOIN users requester ON pr.requester_id = requester.id
      LEFT JOIN users reviewer ON pr.reviewed_by = reviewer.id
      WHERE pr.work_id = ?
      ORDER BY pr.created_at DESC
    `,
      {
        replacements: [workId],
        type: QueryTypes.SELECT,
      }
    );

    return NextResponse.json({
      success: true,
      data: pullRequests,
    });
  } catch (error) {
    console.error("获取协作请求失败:", error);
    return NextResponse.json(
      { success: false, error: "获取协作请求失败" },
      { status: 500 }
    );
  }
}
