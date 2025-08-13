import { NextResponse } from "next/server";
import { connect } from "@/models/dbConfig";
import { Daily } from "@/models/dailyModel";
import { Monthly } from "@/models/monthlyModel";
import { Owner } from "@/models/ownerModel";

// Connect to DB
connect();

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const vehicle = searchParams.get("vehicle");

    if (!vehicle) {
      return NextResponse.json(
        { success: false, message: "Vehicle number is required" },
        { status: 400 }
      );
    }

    // Check Daily parking first
    let vehicleData = await Daily.findOne({ vehicle });

    // If not in Daily, check Monthly
    if (!vehicleData) {
      vehicleData = await Monthly.findOne({ vehicle });
    }

    if (!vehicleData) {
      return NextResponse.json(
        { success: false, message: "Vehicle not found" },
        { status: 404 }
      );
    }

    // Get owner details from email
    const ownerData = await Owner.findOne({ email: vehicleData.email });

    return NextResponse.json({
      success: true,
      vehicleDetails: vehicleData,
      ownerDetails: ownerData || {},
    });
  } catch (error) {
    console.error("Error fetching vehicle details:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
