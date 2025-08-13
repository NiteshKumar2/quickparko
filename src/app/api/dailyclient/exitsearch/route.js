import { NextResponse } from "next/server";
import { connect } from "@/models/dbConfig";
import { Daily } from "@/models/dailyModel";

export async function POST(request) {
  try {
    await connect();

    const { email, y } = await request.json();

    // Validate input
    if (!email || !y) {
      return NextResponse.json(
        {
          success: false,
          error: "Both email and search value (y) are required",
        },
        { status: 400 }
      );
    }

    // Create regex for partial match (case-insensitive)
    const regex = new RegExp(y, "i");

    // Search where email matches, and either token OR vehicle contains y
    const results = await Daily.find({
      email: email,
      $or: [{ token: { $regex: regex } }, { vehicle: { $regex: regex } }],
    }).lean();

    if (results.length === 0) {
      return NextResponse.json(
        { success: false, message: "No matching records found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, count: results.length, data: results },
      { status: 200 }
    );
  } catch (error) {
    console.error("[Search API] Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
