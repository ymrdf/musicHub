import { NextRequest, NextResponse } from "next/server";
import { Category, Tag } from "@/lib/models";
import { testConnection } from "@/lib/database";
import type { ApiResponse } from "@/types";

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

    // 检查是否已经初始化过
    const existingCategories = await Category.count();
    if (existingCategories > 0) {
      return NextResponse.json<ApiResponse>({
        success: true,
        message: "数据已经初始化过了",
      });
    }

    // 初始化分类数据
    const categories = [
      // 曲种分类
      {
        name: "古典音乐",
        type: "genre" as const,
        description: "包括交响乐、协奏曲、奏鸣曲等古典作品",
        sortOrder: 1,
      },
      {
        name: "流行音乐",
        type: "genre" as const,
        description: "现代流行音乐作品",
        sortOrder: 2,
      },
      {
        name: "摇滚音乐",
        type: "genre" as const,
        description: "摇滚风格的音乐作品",
        sortOrder: 3,
      },
      {
        name: "爵士音乐",
        type: "genre" as const,
        description: "爵士风格的音乐作品",
        sortOrder: 4,
      },
      {
        name: "民族音乐",
        type: "genre" as const,
        description: "各民族传统音乐",
        sortOrder: 5,
      },

      // 乐器分类
      {
        name: "钢琴",
        type: "instrument" as const,
        description: "钢琴独奏或钢琴为主的作品",
        sortOrder: 1,
      },
      {
        name: "吉他",
        type: "instrument" as const,
        description: "古典吉他、民谣吉他、电吉他",
        sortOrder: 2,
      },
      {
        name: "小提琴",
        type: "instrument" as const,
        description: "小提琴独奏或小提琴为主的作品",
        sortOrder: 3,
      },
      {
        name: "大提琴",
        type: "instrument" as const,
        description: "大提琴独奏或大提琴为主的作品",
        sortOrder: 4,
      },
      {
        name: "长笛",
        type: "instrument" as const,
        description: "长笛独奏或长笛为主的作品",
        sortOrder: 5,
      },

      // 用途分类
      {
        name: "练习曲",
        type: "purpose" as const,
        description: "用于技巧练习的作品",
        sortOrder: 1,
      },
      {
        name: "表演曲",
        type: "purpose" as const,
        description: "适合舞台表演的作品",
        sortOrder: 2,
      },
      {
        name: "教学曲",
        type: "purpose" as const,
        description: "用于音乐教学的作品",
        sortOrder: 3,
      },
      {
        name: "考级曲",
        type: "purpose" as const,
        description: "音乐考级使用的作品",
        sortOrder: 4,
      },
      {
        name: "背景音乐",
        type: "purpose" as const,
        description: "适合作为背景音乐的作品",
        sortOrder: 5,
      },
    ];

    await Category.bulkCreate(categories);

    // 初始化常用标签
    const tags = [
      { name: "原创", color: "#007bff" },
      { name: "改编", color: "#28a745" },
      { name: "初学者", color: "#ffc107" },
      { name: "中级", color: "#fd7e14" },
      { name: "高级", color: "#dc3545" },
      { name: "温柔", color: "#e83e8c" },
      { name: "激昂", color: "#20c997" },
      { name: "忧伤", color: "#6f42c1" },
      { name: "欢快", color: "#17a2b8" },
      { name: "浪漫", color: "#f8f9fa" },
    ];

    await Tag.bulkCreate(tags);

    return NextResponse.json<ApiResponse>({
      success: true,
      message: "初始数据创建成功",
    });
  } catch (error) {
    console.error("初始化数据失败:", error);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: "服务器内部错误",
      },
      { status: 500 }
    );
  }
}
