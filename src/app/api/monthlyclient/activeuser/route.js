import { NextResponse } from "next/server";
import { connect } from "@/models/dbConfig";
import { Monthly } from "@/models/monthlyModel"; // your monthly collection

// Connect to DB
connect();

export async function GET() {
  try {
    const today = new Date();

    // Count how many have planExpire in the future (still active)
    const activeClients = await Monthly.countDocuments({
      planExpire: { $gte: today },
    });

    return NextResponse.json({
      success: true,
      date: today.toISOString().split("T")[0],
      activeClients: activeClients,
    });
  } catch (error) {
    console.error("Error counting active monthly clients:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
