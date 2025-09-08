import { NextRequest, NextResponse } from "next/server";
import type { ApiResponse } from "@/types";
import { User } from "@/lib/models";
import { verifyToken } from "@/lib/auth";
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
    const { token } = body;

    if (!token) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: "Verification token cannot be empty",
        },
        { status: 400 }
      );
    }

    // Verify token
    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: "Verification link is invalid or has expired",
        },
        { status: 400 }
      );
    }

    // Find user
    const user = await User.findByPk(decoded.userId);
    if (!user) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: "User not found",
        },
        { status: 404 }
      );
    }

    // Check if user is already verified
    if (user.isVerified) {
      return NextResponse.json<ApiResponse>({
        success: true,
        message: "Email has already been verified",
      });
    }

    // Update user verification status
    await user.update({ isVerified: true });

    return NextResponse.json<ApiResponse>({
      success: true,
      message: "Email verification successful!",
    });
  } catch (error) {
    console.error("Email verification failed:", error);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 }
    );
  }
}
