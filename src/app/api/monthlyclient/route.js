import { NextResponse } from "next/server";
import { connect } from "@/models/dbConfig";
import { Monthly } from "@/models/monthlyModel";

// Helper to remove undefined fields
function cleanObject(obj) {
  Object.keys(obj).forEach((key) => {
    if (obj[key] === undefined) delete obj[key];
  });
  return obj;
}

// 📌 Create Monthly Record
export async function POST(request) {
  try {
    await connect();

    const { email, vehicle, phone, planExpire } = await request.json();

    // Validate required fields
    if (!email || !vehicle || !phone || !planExpire) {
      return NextResponse.json(
        { success: false, error: "All fields are required" },
        { status: 400 }
      );
    }

    // Create and save in one step
    const savedUser = await Monthly.create({
      email,
      vehicle,
      phone,
      planExpire,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Monthly record created successfully",
        user: { id: savedUser._id },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating monthly record:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    await connect();

    const reqBody = await request.json();
    const { email, vehicle, phone, planExpire } = reqBody;

    // ✅ Validate required keys
    if (!email || !vehicle) {
      return NextResponse.json(
        { success: false, error: "Email and vehicle are required" },
        { status: 400 }
      );
    }

    // ✅ Only allow phone and planExpire updates
    const updateFields = cleanObject({ phone, planExpire });

    if (Object.keys(updateFields).length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "No valid fields provided (phone, planExpire)",
        },
        { status: 400 }
      );
    }

    // ✅ Find and update record
    const updatedRecord = await Monthly.findOneAndUpdate(
      { email, vehicle },
      { $set: updateFields },
      { new: true, runValidators: true }
    );

    if (!updatedRecord) {
      return NextResponse.json(
        { success: false, error: "Monthly record not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Monthly record updated successfully",
        data: updatedRecord,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating Monthly record:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

// 📌 Get Monthly Record by email + vehicle
export async function GET(request) {
  try {
    await connect();

    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");
    const vehicle = searchParams.get("vehicle");

    if (!email || !vehicle) {
      return NextResponse.json(
        { success: false, error: "Email and vehicle are required" },
        { status: 400 }
      );
    }

    const record = await Monthly.findOne({ email, vehicle });

    if (!record) {
      return NextResponse.json(
        { success: false, error: "Monthly record not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: {
          vehicle: record.vehicle,
          phone: record.phone,
          planExpire: record.planExpire,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching Monthly record:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
