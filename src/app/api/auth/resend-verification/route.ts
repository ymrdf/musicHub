import { NextRequest, NextResponse } from "next/server";
import type { ApiResponse } from "@/types";
import { getUserFromRequest } from "@/lib/auth";
import { generateToken } from "@/lib/auth";
import { testConnection } from "@/lib/database";

export async function POST(request: NextRequest) {
  try {
    // Test database connection
    const isConnected = await testConnection();
    if (!isConnected) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: "Database connection failed",
        },
        { status: 500 }
      );
    }

    // Get current user
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: "Unauthorized access",
        },
        { status: 401 }
      );
    }

    // Check if user is already verified
    if (user.isVerified) {
      return NextResponse.json<ApiResponse>({
        success: true,
        message: "Email has already been verified",
      });
    }

    // Generate verification token
    const verificationToken = generateToken(user.id);

    // In a real project, you need to:
    // 1. Send email with verification link
    // 2. Here we just simulate returning success

    console.log(
      `Email verification token (user ${user.email}): ${verificationToken}`
    );

    return NextResponse.json<ApiResponse>({
      success: true,
      message: "Verification email has been resent to your email",
      // Only return token in development environment, should be removed in production
      ...(process.env.NODE_ENV === "development" && {
        data: { verificationToken },
      }),
    });
  } catch (error) {
    console.error("Failed to resend verification email:", error);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 }
    );
  }
}
