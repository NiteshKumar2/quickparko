import { NextResponse } from "next/server";
import { connect } from "@/models/dbConfig";
import { Monthly } from "@/models/monthlyModel";

export async function GET(request) {
  try {
    await connect();

    // Get query params
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");
    const days = parseInt(searchParams.get("day"), 10);

    if (!email || isNaN(days)) {
      return NextResponse.json(
        { success: false, error: "Email and day are required" },
        { status: 400 }
      );
    }

    // Calculate date range
    const now = new Date();
    const futureDate = new Date();
    futureDate.setDate(now.getDate() + days);

    // ✅ Find expired plans
    const expired = await Monthly.find({
      email,
      planExpire: { $lt: now },
    }).lean();

    // ✅ Find upcoming expiring plans
    const upcoming = await Monthly.find({
      email,
      planExpire: { $gte: now, $lte: futureDate },
    }).lean();

    return NextResponse.json(
      {
        success: true,
        expiredCount: expired.length,
        upcomingCount: upcoming.length,
        expired,
        upcoming,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in plan expire GET API:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
