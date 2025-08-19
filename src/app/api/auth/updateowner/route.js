import { NextResponse } from "next/server";
import { connect } from "@/models/dbConfig";
import { Owner } from "@/models/ownerModel";

export async function GET(request) {
  try {
    // 1️⃣ Connect to DB
    await connect();

    // 2️⃣ Extract email from query params
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");

    // 3️⃣ Validate input
    if (!email) {
      return NextResponse.json(
        { success: false, error: "Email is required" },
        { status: 400 }
      );
    }

    // 4️⃣ Find owner by email
    const owner = await Owner.findOne({ email }).select("-password -__v");

    // 5️⃣ Handle not found
    if (!owner) {
      return NextResponse.json(
        { success: false, error: "Owner not found" },
        { status: 404 }
      );
    }

    // 6️⃣ Return success
    return NextResponse.json({ success: true, owner }, { status: 200 });
  } catch (error) {
    console.error("Error fetching owner:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    // 1️⃣ Connect to the database
    await connect();

    // 2️⃣ Parse request body
    const reqBody = await request.json();
    const { email, ...updateFields } = reqBody;

    // 3️⃣ Validate required fields
    if (!email) {
      return NextResponse.json(
        { success: false, error: "Email is required to update user" },
        { status: 400 }
      );
    }

    // 4️⃣ Remove undefined fields so we don’t overwrite accidentally
    Object.keys(updateFields).forEach((key) => {
      if (updateFields[key] === undefined) delete updateFields[key];
    });

    // 5️⃣ Perform update
    const updatedUser = await Owner.findOneAndUpdate({ email }, updateFields, {
      new: true,
      runValidators: true,
    }).select("-password -__v"); // hide sensitive fields

    // 6️⃣ Handle user not found
    if (!updatedUser) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    // 7️⃣ Return success response
    return NextResponse.json(
      {
        success: true,
        message: "User updated successfully",
        user: updatedUser,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error during user update:", error);

    return NextResponse.json(
      {
        success: false,
        error: error.message || "Internal server error",
      },
      { status: 500 }
    );
  }
}
