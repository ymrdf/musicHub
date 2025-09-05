import { NextRequest, NextResponse } from "next/server";
import { User, Feedback } from "@/lib/models";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// Update feedback status
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const { status } = await req.json();

    // Validate status value
    if (!["pending", "reviewed", "resolved"].includes(status)) {
      return NextResponse.json(
        { error: "Invalid status value" },
        { status: 400 }
      );
    }

    // Verify user is logged in and is admin
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized access" },
        { status: 401 }
      );
    }

    // Check if user is admin
    const userId = session.user.id;
    const adminUser = await User.findOne({
      where: { id: userId },
      attributes: ["role"],
    });

    if (!adminUser || adminUser.get("role") !== "admin") {
      return NextResponse.json(
        { error: "No admin privileges" },
        { status: 403 }
      );
    }

    // Update feedback status
    await Feedback.update({ status }, { where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating feedback status:", error);
    return NextResponse.json(
      { error: "Server error, please try again later" },
      { status: 500 }
    );
  }
}

// Get single feedback details
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;

    // Verify user is logged in and is admin
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized access" },
        { status: 401 }
      );
    }

    // Check if user is admin
    const userId = session.user.id;
    const adminUser = await User.findOne({
      where: { id: userId },
      attributes: ["role"],
    });

    if (!adminUser || adminUser.get("role") !== "admin") {
      return NextResponse.json(
        { error: "No admin privileges" },
        { status: 403 }
      );
    }

    // Get feedback details
    const feedback = await Feedback.findByPk(id);

    if (!feedback) {
      return NextResponse.json(
        { error: "Feedback not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ feedback });
  } catch (error) {
    console.error("Error getting feedback details:", error);
    return NextResponse.json(
      { error: "Server error, please try again later" },
      { status: 500 }
    );
  }
}
