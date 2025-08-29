import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import path from "path";
import { getUserFromRequest } from "@/lib/auth";
import type { ApiResponse } from "@/types";

export async function POST(request: NextRequest) {
  try {
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

    const formData = await request.formData();
    const file = formData.get("file") as File;
    const fileType = formData.get("type") as string;

    if (!file) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: "请选择要上传的文件",
        },
        { status: 400 }
      );
    }

    // 验证文件类型
    const allowedTypes: { [key: string]: string[] } = {
      pdf: ["application/pdf"],
      midi: ["audio/midi", "audio/x-midi", "application/x-midi"],
      audio: [
        "audio/mpeg",
        "audio/mp3",
        "audio/wav",
        "audio/wave",
        "audio/x-wav",
        "audio/aac",
        "audio/ogg",
        "audio/webm",
        "audio/mp4",
      ],
      image: [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/gif",
        "image/webp",
      ],
    };

    if (!fileType || !allowedTypes[fileType]) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: "无效的文件类型",
        },
        { status: 400 }
      );
    }

    if (!allowedTypes[fileType].includes(file.type)) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: `不支持的文件格式: ${file.type}`,
        },
        { status: 400 }
      );
    }

    // 验证文件大小
    const maxSizes: { [key: string]: number } = {
      pdf: 20 * 1024 * 1024, // 20MB
      midi: 5 * 1024 * 1024, // 5MB
      audio: 50 * 1024 * 1024, // 50MB
      image: 5 * 1024 * 1024, // 5MB
    };

    if (file.size > maxSizes[fileType]) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: `文件大小不能超过 ${maxSizes[fileType] / 1024 / 1024}MB`,
        },
        { status: 400 }
      );
    }

    // 创建上传目录
    const uploadDir = path.join(process.cwd(), "uploads", fileType);
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    // 生成唯一文件名
    const timestamp = Date.now();
    const randomSuffix = Math.random().toString(36).substring(2, 15);
    const extension = path.extname(file.name);
    const fileName = `${timestamp}_${randomSuffix}${extension}`;
    const filePath = path.join(uploadDir, fileName);

    // 保存文件
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filePath, buffer);

    // 生成访问URL
    const fileUrl = `/uploads/${fileType}/${fileName}`;

    return NextResponse.json<ApiResponse>({
      success: true,
      data: {
        filename: fileName,
        originalName: file.name,
        path: fileUrl, // 返回相对路径而不是绝对路径
        url: fileUrl,
        size: file.size,
        type: file.type,
      },
      message: "文件上传成功",
    });
  } catch (error) {
    console.error("文件上传失败:", error);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: "文件上传失败",
      },
      { status: 500 }
    );
  }
}
