import { NextRequest, NextResponse } from "next/server";
import { Tag } from "@/lib/models";
import { testConnection } from "@/lib/database";
import { getUserFromRequest } from "@/lib/auth";
import type { ApiResponse } from "@/types";
import sequelize from "@/lib/database";
import { Op } from "sequelize";

// 获取标签列表
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
    const search = searchParams.get("search");
    const limit = parseInt(searchParams.get("limit") || "20");

    // 构建查询条件
    const whereClause: any = {};
    if (search) {
      whereClause.name = {
        [Op.like]: `%${search}%`,
      };
    }

    // 获取标签列表
    const tags = await Tag.findAll({
      where: whereClause,
      order: [
        ["usageCount", "DESC"],
        ["name", "ASC"],
      ],
      limit: Math.min(limit, 100),
    });

    const formattedTags = tags.map((tag) => ({
      id: tag.id,
      name: tag.name,
      usageCount: tag.usageCount,
      color: tag.color,
    }));

    return NextResponse.json<ApiResponse>({
      success: true,
      data: formattedTags,
    });
  } catch (error) {
    console.error("获取标签失败:", error);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: "服务器内部错误",
      },
      { status: 500 }
    );
  }
}

// 创建标签
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
    const { name, color = "#007bff" } = body;

    // 验证标签名称
    if (!name || name.trim().length === 0) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: "标签名称不能为空",
        },
        { status: 400 }
      );
    }

    if (name.length > 30) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: "标签名称不能超过30个字符",
        },
        { status: 400 }
      );
    }

    // 检查标签是否已存在
    const existingTag = await Tag.findOne({
      where: { name: name.trim() },
    });

    if (existingTag) {
      return NextResponse.json<ApiResponse>({
        success: true,
        data: {
          id: existingTag.id,
          name: existingTag.name,
          usageCount: existingTag.usageCount,
          color: existingTag.color,
        },
        message: "标签已存在",
      });
    }

    // 创建新标签
    const newTag = await Tag.create({
      name: name.trim(),
      color: color,
      usageCount: 0,
    });

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        data: {
          id: newTag.id,
          name: newTag.name,
          usageCount: newTag.usageCount,
          color: newTag.color,
        },
        message: "标签创建成功",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("创建标签失败:", error);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: "服务器内部错误",
      },
      { status: 500 }
    );
  }
}
