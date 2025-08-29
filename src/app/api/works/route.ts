import { NextRequest, NextResponse } from "next/server";
import { Work, User, Category, Tag } from "@/lib/models";
import { getUserFromRequest } from "@/lib/auth";
import { testConnection } from "@/lib/database";
import { workSchema } from "@/utils/validation";
import type { ApiResponse, PaginatedResponse } from "@/types";
import sequelize from "@/lib/database";
import { Op } from "sequelize";

// 获取作品列表
export async function GET(request: NextRequest) {
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

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = Math.min(parseInt(searchParams.get("limit") || "20"), 100);
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = searchParams.get("sortOrder") || "desc";
    const search = searchParams.get("search");
    const genreId = searchParams.get("genreId");
    const instrumentId = searchParams.get("instrumentId");
    const userId = searchParams.get("userId");

    // 构建查询条件
    const whereClause: any = { isPublic: true };

    if (search) {
      whereClause[Op.or] = [
        { title: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } },
      ];
    }

    if (genreId) {
      whereClause.genreId = parseInt(genreId);
    }

    if (instrumentId) {
      whereClause.instrumentId = parseInt(instrumentId);
    }

    if (userId) {
      whereClause.userId = parseInt(userId);
    }

    // 计算偏移量
    const offset = (page - 1) * limit;

    // 查询作品
    const { count, rows: works } = await Work.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "username", "avatarUrl", "isVerified"],
        },
        {
          model: Category,
          as: "genre",
          attributes: ["id", "name"],
        },
        {
          model: Category,
          as: "instrument",
          attributes: ["id", "name"],
        },
        {
          model: Category,
          as: "purpose",
          attributes: ["id", "name"],
        },
      ],
      order: [[sortBy, sortOrder.toUpperCase()]],
      limit,
      offset,
    });

    // 格式化数据
    const formattedWorks = works.map((work) => ({
      id: work.id,
      title: work.title,
      description: work.description,
      pdfFilePath: work.pdfFilePath,
      midiFilePath: work.midiFilePath,
      starsCount: work.starsCount,
      performancesCount: work.performancesCount,
      commentsCount: work.commentsCount,
      viewsCount: work.viewsCount,
      license: work.license,
      createdAt: work.createdAt,
      updatedAt: work.updatedAt,
      user: work.user,
      genre: work.genre,
      instrument: work.instrument,
      purpose: work.purpose,
    }));

    const response: PaginatedResponse<(typeof formattedWorks)[0]> = {
      items: formattedWorks,
      total: count,
      page,
      limit,
      totalPages: Math.ceil(count / limit),
    };

    return NextResponse.json<ApiResponse>({
      success: true,
      data: response,
    });
  } catch (error) {
    console.error("获取作品列表失败:", error);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: "服务器内部错误",
      },
      { status: 500 }
    );
  }
}

// 创建作品
export async function POST(request: NextRequest) {
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

    const body = await request.json();

    // 验证请求数据
    const { error, value } = workSchema.validate(body);
    if (error) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: error.details[0].message,
        },
        { status: 400 }
      );
    }

    const {
      title,
      description,
      pdfFilePath,
      midiFilePath,
      genreId,
      instrumentId,
      purposeId,
      tags = [],
      isPublic = true,
      allowCollaboration = true,
      license = "CC BY-SA 4.0",
    } = value;

    // 开始事务
    const transaction = await sequelize.transaction();

    try {
      // 创建作品
      const work = await Work.create(
        {
          title,
          description,
          userId: currentUser.id,
          pdfFilePath,
          midiFilePath,
          genreId,
          instrumentId,
          purposeId,
          isPublic,
          allowCollaboration,
          license,
          starsCount: 0,
          performancesCount: 0,
          commentsCount: 0,
          viewsCount: 0,
        },
        { transaction }
      );

      // 处理标签
      if (tags.length > 0) {
        for (const tagName of tags) {
          // 查找或创建标签
          let [tag] = await Tag.findOrCreate({
            where: { name: tagName.trim() },
            defaults: {
              name: tagName.trim(),
              usageCount: 0,
              color: "#007bff",
            },
            transaction,
          });

          // 创建作品标签关联
          await sequelize.query(
            "INSERT INTO work_tags (work_id, tag_id) VALUES (?, ?)",
            {
              replacements: [work.id, tag.id],
              transaction,
            }
          );

          // 更新标签使用次数
          await tag.increment("usageCount", { transaction });
        }
      }

      // 更新用户作品数
      await currentUser.increment("worksCount", { transaction });

      // 获取完整的作品信息（在事务提交之前）
      const completeWork = await Work.findByPk(work.id, {
        include: [
          {
            model: User,
            as: "user",
            attributes: ["id", "username", "avatarUrl", "isVerified"],
          },
          {
            model: Category,
            as: "genre",
            attributes: ["id", "name"],
          },
          {
            model: Category,
            as: "instrument",
            attributes: ["id", "name"],
          },
          {
            model: Category,
            as: "purpose",
            attributes: ["id", "name"],
          },
        ],
        transaction,
      });

      // 提交事务
      await transaction.commit();

      return NextResponse.json<ApiResponse>(
        {
          success: true,
          data: completeWork,
          message: "作品创建成功",
        },
        { status: 201 }
      );
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  } catch (error) {
    console.error("创建作品失败:", error);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: "服务器内部错误",
      },
      { status: 500 }
    );
  }
}
