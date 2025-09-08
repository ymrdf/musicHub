import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/auth";
import type { ApiResponse } from "@/types";

// 强制动态渲染
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const currentUser = await getUserFromRequest(request);

    return NextResponse.json<ApiResponse>({
      success: true,
      data: {
        message: "API 正常工作",
        timestamp: new Date().toISOString(),
        user: currentUser
          ? {
              id: currentUser.id,
              username: currentUser.username,
              email: currentUser.email,
            }
          : null,
      },
    });
  } catch (error) {
    console.error("测试API错误:", error);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: "测试API失败",
      },
      { status: 500 }
    );
  }
}
