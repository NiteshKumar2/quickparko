import { NextResponse } from "next/server";
import { connect } from "@/models/dbConfig";
import { Monthly } from "@/models/monthlyModel"; // your monthly collection

// Connect to DB
connect();

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email"); // get email from query params

    if (!email) {
      return NextResponse.json(
        { success: false, message: "Email is required" },
        { status: 400 }
      );
    }

    const today = new Date();

    // Count how many active plans exist for this email
    const activeClients = await Monthly.countDocuments({
      email: email.toLowerCase(),
      planExpire: { $gte: today },
    });

    return NextResponse.json({
      success: true,
      email: email,
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
