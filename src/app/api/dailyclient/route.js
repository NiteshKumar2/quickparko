import { NextResponse } from "next/server";
import { connect } from "@/models/dbConfig";
import { Daily } from "@/models/dailyModel";

// Helper to remove undefined fields
function cleanObject(obj) {
  Object.keys(obj).forEach((key) => {
    if (obj[key] === undefined) delete obj[key];
  });
  return obj;
}

// 📌 Create Daily Record
export async function POST(request) {
  try {
    await connect();

    const { email, vehicle, token, status } = await request.json();

    // Validate required fields
    if (!email || !vehicle || !token || !status) {
      return NextResponse.json(
        { success: false, error: "All fields are required" },
        { status: 400 }
      );
    }

    // Create and save in one step
    const savedUser = await Daily.create({ email, vehicle, token, status });

    return NextResponse.json(
      {
        success: true,
        message: "Daily record created successfully",
        user: { id: savedUser._id },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating daily record:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

// 📌 Update Daily Record
export async function PUT(request) {
  try {
    await connect();

    const reqBody = await request.json();
    const { email, ...updateFields } = reqBody;

    if (!email) {
      return NextResponse.json(
        { success: false, error: "Email is required to update daily record" },
        { status: 400 }
      );
    }

    // Clean undefined fields
    const cleanedFields = cleanObject(updateFields);

    const updatedUser = await Daily.findOneAndUpdate({ email }, cleanedFields, {
      new: true,
      runValidators: true,
    });

    if (!updatedUser) {
      return NextResponse.json(
        { success: false, error: "Daily record not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Daily record updated successfully",
        user: updatedUser,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating daily record:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
