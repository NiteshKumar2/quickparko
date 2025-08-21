import { NextResponse } from "next/server";
import { connect } from "@/models/dbConfig";
import { Contact } from "@/models/contactModel";

/**
 * 🟡 UPDATE (PUT)
 * Update a contact by ID
 */
export async function PUT(req, { params }) {
  try {
    await connect();

    // ✅ await params
    const { id } = await params;

    const updates = await req.json();

    const updated = await Contact.findByIdAndUpdate(id, updates, {
      new: true, // return updated doc
      runValidators: true,
    });

    if (!updated) {
      return NextResponse.json(
        { success: false, message: "Contact not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Contact updated",
      data: updated,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

/**
 * 🔴 DELETE
 * Delete a contact by ID
 */

export async function DELETE(req, { params }) {
  try {
    await connect();

    // ✅ await params here
    const { id } = await params;

    const deleted = await Contact.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json(
        { success: false, message: "Contact not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, message: "Contact deleted" });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
