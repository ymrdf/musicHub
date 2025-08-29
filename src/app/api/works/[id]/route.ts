import { NextRequest, NextResponse } from "next/server";
import { Work, User, Category, Tag } from "@/lib/models";
import { getUserFromRequest } from "@/lib/auth";
import { testConnection } from "@/lib/database";
import type { ApiResponse } from "@/types";
import sequelize from "@/lib/database";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // 测试数据库连接
    const isConnected = await testConnection();
    if (!isConnected) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: "数据库连接失败",
        },
        { status: 500 }
      );
    }

    const workId = parseInt(params.id);
    if (isNaN(workId)) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: "无效的作品ID",
        },
        { status: 400 }
      );
    }

    // 获取当前用户（如果已登录）
    const currentUser = await getUserFromRequest(request);

    // 查询作品详情
    const work = await Work.findByPk(workId, {
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "username", "avatarUrl", "isVerified", "bio"],
        },
        {
          model: Category,
          as: "genre",
          attributes: ["id", "name", "description"],
        },
        {
          model: Category,
          as: "instrument",
          attributes: ["id", "name", "description"],
        },
        {
          model: Category,
          as: "purpose",
          attributes: ["id", "name", "description"],
        },
      ],
    });

    if (!work) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: "作品不存在",
        },
        { status: 404 }
      );
    }

    // 检查访问权限
    if (!work.isPublic && (!currentUser || currentUser.id !== work.userId)) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: "无权访问此作品",
        },
        { status: 403 }
      );
    }

    // 获取作品标签
    const tags = await sequelize.query(
      `
      SELECT t.id, t.name, t.color 
      FROM tags t 
      INNER JOIN work_tags wt ON t.id = wt.tag_id 
      WHERE wt.work_id = ?
      ORDER BY t.name
      `,
      {
        replacements: [workId],
        type: sequelize.QueryTypes.SELECT,
      }
    );

    // 检查当前用户是否已收藏
    let isStarred = false;
    if (currentUser) {
      const [star] = await sequelize.query(
        "SELECT id FROM work_stars WHERE work_id = ? AND user_id = ?",
        {
          replacements: [workId, currentUser.id],
          type: sequelize.QueryTypes.SELECT,
        }
      );
      isStarred = !!star;
    }

    // 增加浏览次数（异步执行，不影响响应）
    work.increment("viewsCount").catch((error) => {
      console.error("更新浏览次数失败:", error);
    });

    // 构建响应数据
    const workData = {
      id: work.id,
      title: work.title,
      description: work.description,
      pdfFilePath: work.pdfFilePath,
      midiFilePath: work.midiFilePath,
      pdfFileSize: work.pdfFileSize,
      midiFileSize: work.midiFileSize,
      starsCount: work.starsCount,
      performancesCount: work.performancesCount,
      commentsCount: work.commentsCount,
      viewsCount: work.viewsCount + 1, // 包含本次浏览
      isPublic: work.isPublic,
      allowCollaboration: work.allowCollaboration,
      license: work.license,
      createdAt: work.createdAt,
      updatedAt: work.updatedAt,
      user: work.user,
      genre: work.genre,
      instrument: work.instrument,
      purpose: work.purpose,
      tags,
      isStarred,
      isOwner: currentUser?.id === work.userId,
    };

    return NextResponse.json<ApiResponse>({
      success: true,
      data: workData,
    });
  } catch (error) {
    console.error("获取作品详情失败:", error);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: "服务器内部错误",
      },
      { status: 500 }
    );
  }
}

// 更新作品
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // 测试数据库连接
    const isConnected = await testConnection();
    if (!isConnected) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: "数据库连接失败",
        },
        { status: 500 }
      );
    }

    // 验证用户身份
    const currentUser = await getUserFromRequest(request);
    if (!currentUser) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: "请先登录",
        },
        { status: 401 }
      );
    }

    const workId = parseInt(params.id);
    if (isNaN(workId)) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: "无效的作品ID",
        },
        { status: 400 }
      );
    }

    // 查找作品
    const work = await Work.findByPk(workId);
    if (!work) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: "作品不存在",
        },
        { status: 404 }
      );
    }

    // 检查权限
    if (work.userId !== currentUser.id) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: "无权修改此作品",
        },
        { status: 403 }
      );
    }

    const body = await request.json();
    const {
      title,
      description,
      genreId,
      instrumentId,
      purposeId,
      tags = [],
      isPublic,
      allowCollaboration,
      license,
    } = body;

    // 开始事务
    const transaction = await sequelize.transaction();

    try {
      // 更新作品信息
      await work.update(
        {
          title: title || work.title,
          description:
            description !== undefined ? description : work.description,
          genreId: genreId !== undefined ? genreId : work.genreId,
          instrumentId:
            instrumentId !== undefined ? instrumentId : work.instrumentId,
          purposeId: purposeId !== undefined ? purposeId : work.purposeId,
          isPublic: isPublic !== undefined ? isPublic : work.isPublic,
          allowCollaboration:
            allowCollaboration !== undefined
              ? allowCollaboration
              : work.allowCollaboration,
          license: license || work.license,
        },
        { transaction }
      );

      // 更新标签
      if (tags.length >= 0) {
        // 删除现有标签关联
        await sequelize.query("DELETE FROM work_tags WHERE work_id = ?", {
          replacements: [workId],
          transaction,
        });

        // 添加新标签
        for (const tagName of tags) {
          let [tag] = await Tag.findOrCreate({
            where: { name: tagName.trim() },
            defaults: {
              name: tagName.trim(),
              usageCount: 0,
              color: "#007bff",
            },
            transaction,
          });

          await sequelize.query(
            "INSERT INTO work_tags (work_id, tag_id) VALUES (?, ?)",
            {
              replacements: [workId, tag.id],
              transaction,
            }
          );

          await tag.increment("usageCount", { transaction });
        }
      }

      await transaction.commit();

      return NextResponse.json<ApiResponse>({
        success: true,
        message: "作品更新成功",
      });
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  } catch (error) {
    console.error("更新作品失败:", error);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: "服务器内部错误",
      },
      { status: 500 }
    );
  }
}

// 删除作品
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // 测试数据库连接
    const isConnected = await testConnection();
    if (!isConnected) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: "数据库连接失败",
        },
        { status: 500 }
      );
    }

    // 验证用户身份
    const currentUser = await getUserFromRequest(request);
    if (!currentUser) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: "请先登录",
        },
        { status: 401 }
      );
    }

    const workId = parseInt(params.id);
    if (isNaN(workId)) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: "无效的作品ID",
        },
        { status: 400 }
      );
    }

    // 查找作品
    const work = await Work.findByPk(workId);
    if (!work) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: "作品不存在",
        },
        { status: 404 }
      );
    }

    // 检查权限
    if (work.userId !== currentUser.id) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: "无权删除此作品",
        },
        { status: 403 }
      );
    }

    // 开始事务
    const transaction = await sequelize.transaction();

    try {
      // 删除作品（级联删除相关数据）
      await work.destroy({ transaction });

      // 更新用户作品数
      await currentUser.decrement("worksCount", { transaction });

      await transaction.commit();

      return NextResponse.json<ApiResponse>({
        success: true,
        message: "作品删除成功",
      });
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  } catch (error) {
    console.error("删除作品失败:", error);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: "服务器内部错误",
      },
      { status: 500 }
    );
  }
}
