import { NextResponse } from "next/server";
import { connect } from "@/models/dbConfig";
import { Daily } from "@/models/dailyModel";

// Connect to DB
connect();

export async function GET(request) {
  try {
    // Extract email from query params
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json(
        { success: false, message: "Email is required" },
        { status: 400 }
      );
    }

    // Get current date at 12:00 AM
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    // Current time (now)
    const now = new Date();

    // Count records between start of today and now for that email
    const count = await Daily.countDocuments({
      email: email,
      createdAt: { $gte: startOfDay, $lte: now },
    });

    return NextResponse.json({
      success: true,
      date: startOfDay.toISOString().split("T")[0],
      totalEntries: count,
    });
  } catch (error) {
    console.error("Error counting daily entries:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
