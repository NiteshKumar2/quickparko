import { NextResponse } from "next/server";
import { connect } from "@/models/dbConfig";
import { Monthly } from "@/models/monthlyModel";

export async function PUT(request) {
  try {
    await connect();

    const { email, vehicle, action } = await request.json();

    if (!email || !vehicle) {
      return NextResponse.json(
        { success: false, error: "Email and vehicle are required" },
        { status: 400 }
      );
    }

    if (!["in", "out"].includes(action)) {
      return NextResponse.json(
        { success: false, error: "Action must be 'in' or 'out'" },
        { status: 400 }
      );
    }

    let updatedRecord;

    if (action === "in") {
      // Push new in-time record
      updatedRecord = await Monthly.findOneAndUpdate(
        { email, vehicle },
        { $push: { timing: { inTime: new Date(), outTime: null } } },
        { new: true, runValidators: true }
      );
    } else {
      // Update last record's outTime
      updatedRecord = await Monthly.findOneAndUpdate(
        { email, vehicle, "timing.outTime": null },
        { $set: { "timing.$.outTime": new Date() } },
        { new: true, runValidators: true }
      );
    }

    if (!updatedRecord) {
      return NextResponse.json(
        {
          success: false,
          error: "Monthly record not found or no open session to close",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: `Vehicle ${
          action === "in" ? "entry" : "exit"
        } time recorded successfully`,
        data: updatedRecord,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating timing:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
