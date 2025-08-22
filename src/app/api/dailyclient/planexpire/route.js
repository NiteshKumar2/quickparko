import { NextResponse } from "next/server";
import { connect } from "@/models/dbConfig";
import { Daily } from "@/models/dailyModel";

export async function GET(request) {
  try {
    await connect();

    // Get email and hours from query params
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");
    const hoursParam = searchParams.get("hours");
    const hours = hoursParam ? parseInt(hoursParam, 10) : 24; // default 24 hours

    if (!email) {
      return NextResponse.json(
        { success: false, error: "Email is required" },
        { status: 400 }
      );
    }

    if (isNaN(hours) || hours <= 0) {
      return NextResponse.json(
        { success: false, error: "Hours must be a positive number" },
        { status: 400 }
      );
    }

    // Calculate cutoff date (older than given hours)
    const cutoffTime = new Date();
    cutoffTime.setHours(cutoffTime.getHours() - hours);

    // Query DB
    const results = await Daily.find({
      email: email,
      status: "in", // ✅ filter by status
      createdAt: { $lt: cutoffTime },
    }).lean();

    if (results.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: `No records older than ${hours} hours found`,
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, count: results.length, data: results },
      { status: 200 }
    );
  } catch (error) {
    console.error("[Old Records GET API] Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
