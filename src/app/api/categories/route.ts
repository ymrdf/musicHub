import { NextRequest, NextResponse } from "next/server";
import { Category } from "@/lib/models";
import { testConnection } from "@/lib/database";
import type { ApiResponse } from "@/types";

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
    const type = searchParams.get("type");

    // 构建查询条件
    const whereClause: any = { isActive: true };
    if (type && ["genre", "instrument", "purpose"].includes(type)) {
      whereClause.type = type;
    }

    // 获取分类列表
    const categories = await Category.findAll({
      where: whereClause,
      order: [
        ["sortOrder", "ASC"],
        ["name", "ASC"],
      ],
    });

    // 按类型分组
    const groupedCategories = categories.reduce((acc: any, category) => {
      if (!acc[category.type]) {
        acc[category.type] = [];
      }
      acc[category.type].push({
        id: category.id,
        name: category.name,
        description: category.description,
        sortOrder: category.sortOrder,
      });
      return acc;
    }, {});

    return NextResponse.json<ApiResponse>({
      success: true,
      data: type ? categories : groupedCategories,
    });
  } catch (error) {
    console.error("获取分类失败:", error);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: "服务器内部错误",
      },
      { status: 500 }
    );
  }
}
