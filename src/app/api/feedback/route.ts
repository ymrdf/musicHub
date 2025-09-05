import { NextRequest, NextResponse } from "next/server";
import { Feedback } from "@/lib/models";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, subject, message } = body;

    // Validate required fields
    if (!email || !subject || !message) {
      return NextResponse.json(
        { error: "Email, feedback type and feedback content are required" },
        { status: 400 }
      );
    }

    // Save feedback to database
    try {
      // Use Sequelize model to create record
      await Feedback.create({
        name: name || "Anonymous User",
        email,
        subject,
        message,
        status: "pending",
      });

      return NextResponse.json(
        { success: true, message: "Feedback submitted successfully" },
        { status: 200 }
      );
    } catch (dbError: any) {
      // If database operation fails, log error
      console.error("Failed to save feedback to database:", dbError);
      // Log to console
      console.log("Received new feedback but save failed:", {
        name,
        email,
        subject,
        message,
      });

      // Return error response
      return NextResponse.json(
        {
          success: false,
          message: "Feedback submission failed, database error",
          error: dbError.original?.sqlMessage || "Database error",
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error processing feedback submission:", error);
    return NextResponse.json(
      { error: "Server error, please try again later" },
      { status: 500 }
    );
  }
}
