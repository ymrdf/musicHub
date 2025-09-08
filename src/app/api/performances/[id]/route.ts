import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/auth";
import { performanceSchema } from "@/utils/validation";
import type { ApiResponse } from "@/types";
import { User, Work, Performance, Comment } from "@/lib/models";

// Get performance details
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const performanceId = parseInt(params.id);

    if (isNaN(performanceId)) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: "Invalid performance ID",
        },
        { status: 400 }
      );
    }

    const performance = await Performance.findByPk(performanceId, {
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "username", "avatarUrl", "bio"],
        },
        {
          model: Work,
          as: "work",
          attributes: ["id", "title", "description"],
        },
      ],
    });

    if (!performance) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: "Performance not found",
        },
        { status: 404 }
      );
    }

    // Increment play count
    await performance.increment("playsCount");

    return NextResponse.json<ApiResponse>({
      success: true,
      data: performance,
    });
  } catch (error) {
    console.error("Failed to get performance details:", error);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: "Failed to get performance details",
      },
      { status: 500 }
    );
  }
}

// Update performance
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verify user identity
    const currentUser = await getUserFromRequest(request);
    if (!currentUser) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: "Please login first",
        },
        { status: 401 }
      );
    }

    const performanceId = parseInt(params.id);

    if (isNaN(performanceId)) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: "Invalid performance ID",
        },
        { status: 400 }
      );
    }

    // Find performance record
    const performance = await Performance.findByPk(performanceId);
    if (!performance) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: "Performance not found",
        },
        { status: 404 }
      );
    }

    // Check permissions (only performer can edit)
    if (performance.userId !== currentUser.id) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: "No permission to edit this performance",
        },
        { status: 403 }
      );
    }

    const body = await request.json();

    // Validate request data
    const { error } = performanceSchema.validate(body);
    if (error) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: error.details[0].message,
        },
        { status: 400 }
      );
    }

    // Update performance record
    await performance.update(body);

    // Return updated performance record
    const updatedPerformance = await Performance.findByPk(performanceId, {
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "username", "avatarUrl"],
        },
        {
          model: Work,
          as: "work",
          attributes: ["id", "title"],
        },
      ],
    });

    return NextResponse.json<ApiResponse>({
      success: true,
      data: updatedPerformance,
      message: "Performance updated successfully",
    });
  } catch (error) {
    console.error("Failed to update performance:", error);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: "Failed to update performance",
      },
      { status: 500 }
    );
  }
}

// Delete performance
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verify user identity
    const currentUser = await getUserFromRequest(request);
    if (!currentUser) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: "Please login first",
        },
        { status: 401 }
      );
    }

    const performanceId = parseInt(params.id);

    if (isNaN(performanceId)) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: "Invalid performance ID",
        },
        { status: 400 }
      );
    }

    // Find performance record
    const performance = await Performance.findByPk(performanceId, {
      include: [
        {
          model: Work,
          as: "work",
        },
      ],
    });

    if (!performance) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: "Performance not found",
        },
        { status: 404 }
      );
    }

    // Check permissions (only performer can delete)
    if (performance.userId !== currentUser.id) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: "No permission to delete this performance",
        },
        { status: 403 }
      );
    }

    // Delete performance record
    await performance.destroy();

    // Update work performances count
    if ((performance as any).work) {
      await (performance as any).work.decrement("performancesCount");
    }

    // Update user performances count
    await currentUser.decrement("performancesCount");

    return NextResponse.json<ApiResponse>({
      success: true,
      message: "Performance deleted successfully",
    });
  } catch (error) {
    console.error("Failed to delete performance:", error);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: "Failed to delete performance",
      },
      { status: 500 }
    );
  }
}
