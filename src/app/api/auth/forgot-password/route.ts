import { NextRequest, NextResponse } from "next/server";
import type { ApiResponse } from "@/types";
import { User } from "@/lib/models";
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

    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: "Please provide an email address",
        },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: "Please enter a valid email address",
        },
        { status: 400 }
      );
    }

    // Find user
    const user = await User.findOne({ where: { email } });
    if (!user) {
      // For security, return success even if user doesn't exist
      return NextResponse.json<ApiResponse>({
        success: true,
        message:
          "If this email is registered, you will receive a password reset link",
      });
    }

    // Check if account is active
    if (!user.isActive) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: "Account has been disabled. Please contact administrator",
        },
        { status: 403 }
      );
    }

    // Generate reset token (valid for 30 minutes)
    const resetToken = generateToken(user.id);

    // In a real project, you need to:
    // 1. Store reset token in database (with expiration time)
    // 2. Send email with reset link
    // 3. Here we just simulate returning success

    console.log(`Password reset token (user ${user.email}): ${resetToken}`);

    return NextResponse.json<ApiResponse>({
      success: true,
      message: "Password reset link has been sent to your email",
      // Only return token in development environment, should be removed in production
      ...(process.env.NODE_ENV === "development" && {
        data: { resetToken },
      }),
    });
  } catch (error) {
    console.error("Password reset request failed:", error);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 }
    );
  }
}
