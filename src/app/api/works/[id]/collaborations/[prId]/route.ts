import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/auth";
import sequelize, { QueryTypes } from "@/lib/database";

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string; prId: string } }
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
    const prId = parseInt(params.prId);

    if (isNaN(workId) || isNaN(prId)) {
      return NextResponse.json(
        { success: false, error: "无效的ID" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { action, reviewComment } = body; // action: 'approve' | 'reject'

    if (!["approve", "reject"].includes(action)) {
      return NextResponse.json(
        { success: false, error: "无效的操作" },
        { status: 400 }
      );
    }

    // 检查作品是否存在且用户是所有者
    const work = await sequelize.query(
      "SELECT id, user_id, title FROM works WHERE id = ?",
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

    if (workData.user_id !== user.id) {
      return NextResponse.json(
        { success: false, error: "只有作品所有者可以处理协作请求" },
        { status: 403 }
      );
    }

    // 检查协作请求是否存在
    const pr = await sequelize.query(
      `
      SELECT 
        pr.id,
        pr.status,
        pr.version_id,
        wv.midi_file_path,
        wv.midi_file_size,
        wv.commit_message
      FROM pull_requests pr
      JOIN work_versions wv ON pr.version_id = wv.id
      WHERE pr.id = ? AND pr.work_id = ?
    `,
      {
        replacements: [prId, workId],
        type: QueryTypes.SELECT,
      }
    );

    if ((pr as any[]).length === 0) {
      return NextResponse.json(
        { success: false, error: "协作请求不存在" },
        { status: 404 }
      );
    }

    const prData = pr[0] as any;

    if (prData.status !== "pending") {
      return NextResponse.json(
        { success: false, error: "该协作请求已被处理" },
        { status: 400 }
      );
    }

    // 开始数据库事务
    const transaction = await sequelize.transaction();

    try {
      const newStatus = action === "approve" ? "approved" : "rejected";
      const mergedAt = action === "approve" ? new Date() : null;

      // 更新协作请求状态
      await sequelize.query(
        `
        UPDATE pull_requests 
        SET status = ?, reviewed_by = ?, reviewed_at = ?, review_comment = ?, updated_at = NOW()
        WHERE id = ?
      `,
        {
          replacements: [
            newStatus,
            user.id,
            mergedAt,
            reviewComment || "",
            prId,
          ],
          type: QueryTypes.UPDATE,
          transaction,
        }
      );

      if (action === "approve") {
        // 如果接受，更新作品版本
        await sequelize.query(
          `
          UPDATE work_versions 
          SET is_merged = TRUE, merged_at = NOW(), merged_by = ?
          WHERE id = ?
        `,
          {
            replacements: [user.id, prData.version_id],
            type: QueryTypes.UPDATE,
            transaction,
          }
        );

        // 更新作品的MIDI文件（使用新版本的文件）
        await sequelize.query(
          `
          UPDATE works 
          SET midi_file_path = ?, midi_file_size = ?, updated_at = NOW()
          WHERE id = ?
        `,
          {
            replacements: [
              prData.midi_file_path,
              prData.midi_file_size,
              workId,
            ],
            type: QueryTypes.UPDATE,
            transaction,
          }
        );
      }

      await transaction.commit();

      return NextResponse.json({
        success: true,
        data: {
          message: action === "approve" ? "协作请求已接受" : "协作请求已拒绝",
          status: newStatus,
        },
      });
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  } catch (error) {
    console.error("处理协作请求失败:", error);
    return NextResponse.json(
      { success: false, error: "处理协作请求失败" },
      { status: 500 }
    );
  }
}
