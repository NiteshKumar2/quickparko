import { NextResponse } from "next/server";
import { connect } from "@/models/dbConfig";
import { Owner } from "@/models/ownerModel";

// 🔹 GET owner by email
export async function GET(request) {
  try {
    await connect();

    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json(
        { success: false, error: "Email is required" },
        { status: 400 }
      );
    }

    const owner = await Owner.findOne({ email }).select("-password -__v");

    if (!owner) {
      return NextResponse.json(
        { success: false, error: "Owner not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, owner }, { status: 200 });
  } catch (error) {
    console.error("Error fetching owner:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

// 🔹 Update owner by email
export async function PUT(request) {
  try {
    await connect();

    const reqBody = await request.json();
    const { email, ...updateFields } = reqBody;

    if (!email) {
      return NextResponse.json(
        { success: false, error: "Email is required to update owner" },
        { status: 400 }
      );
    }

    // remove undefined fields
    Object.keys(updateFields).forEach((key) => {
      if (updateFields[key] === undefined) delete updateFields[key];
    });

    const updatedOwner = await Owner.findOneAndUpdate({ email }, updateFields, {
      new: true,
      runValidators: true,
    }).select("-password -__v");

    if (!updatedOwner) {
      return NextResponse.json(
        { success: false, error: "Owner not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Owner updated successfully",
        owner: updatedOwner,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating owner:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
