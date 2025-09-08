import { NextRequest, NextResponse } from "next/server";
import type { ApiResponse } from "@/types";
import { User } from "@/lib/models";
import { hashPassword, verifyToken } from "@/lib/auth";
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
    const { token, password, confirmPassword } = body;

    if (!token || !password || !confirmPassword) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: "Please fill in all required fields",
        },
        { status: 400 }
      );
    }

    // Verify password match
    if (password !== confirmPassword) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: "Passwords do not match",
        },
        { status: 400 }
      );
    }

    // Validate password strength
    if (password.length < 8) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: "Password must be at least 8 characters long",
        },
        { status: 400 }
      );
    }

    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error:
            "Password must contain uppercase letters, lowercase letters, and numbers",
        },
        { status: 400 }
      );
    }

    // Verify reset token
    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: "Reset link is invalid or has expired",
        },
        { status: 400 }
      );
    }

    // Find user
    const user = await User.findByPk(decoded.userId);
    if (!user || !user.isActive) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: "User not found or account has been disabled",
        },
        { status: 404 }
      );
    }

    // Update password
    const passwordHash = await hashPassword(password);
    await user.update({ passwordHash });

    return NextResponse.json<ApiResponse>({
      success: true,
      message: "Password reset successful. Please login with your new password",
    });
  } catch (error) {
    console.error("Password reset failed:", error);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 }
    );
  }
}
