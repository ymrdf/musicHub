import { NextRequest, NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";
import { existsSync } from "fs";

export async function GET(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  try {
    const filePath = path.join(process.cwd(), "uploads", ...params.path);

    // 检查文件是否存在
    if (!existsSync(filePath)) {
      return new NextResponse("File not found", { status: 404 });
    }

    // 读取文件
    const fileBuffer = await readFile(filePath);

    // 根据文件扩展名设置 Content-Type
    const ext = path.extname(filePath).toLowerCase();
    let contentType = "application/octet-stream";

    const mimeTypes: { [key: string]: string } = {
      ".pdf": "application/pdf",
      ".mid": "audio/midi",
      ".midi": "audio/midi",
      ".mp3": "audio/mpeg",
      ".wav": "audio/wav",
      ".jpg": "image/jpeg",
      ".jpeg": "image/jpeg",
      ".png": "image/png",
      ".gif": "image/gif",
      ".webp": "image/webp",
    };

    if (mimeTypes[ext]) {
      contentType = mimeTypes[ext];
    }

    // 设置响应头
    const headers = new Headers();
    headers.set("Content-Type", contentType);
    headers.set("Cache-Control", "public, max-age=31536000"); // 缓存一年

    // 如果是下载请求，设置下载头
    const download = request.nextUrl.searchParams.get("download");
    if (download === "true") {
      const filename = path.basename(filePath);
      headers.set("Content-Disposition", `attachment; filename="${filename}"`);
    }

    return new NextResponse(fileBuffer, { headers });
  } catch (error) {
    console.error("文件服务错误:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
