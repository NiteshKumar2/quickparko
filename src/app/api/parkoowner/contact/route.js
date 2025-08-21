import { NextResponse } from "next/server";
import { connect } from "@/models/dbConfig";
import { Contact } from "@/models/contactModel";

/**
 * 🟢 CREATE (POST)
 * Add a new contact
 */
export async function POST(req) {
  try {
    await connect();
    const body = await req.json();
    const { username, email, message } = body;

    if (!username || !email) {
      return NextResponse.json(
        { success: false, message: "Username and Email are required ❌" },
        { status: 400 }
      );
    }

    const contact = await Contact.create({ username, email, message });

    return NextResponse.json(
      { success: true, data: contact, message: "Contact created ✅" },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST error:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

/**
 * 🔵 READ (GET)
 * Get all contacts
 */
export async function GET() {
  try {
    await connect();
    const contacts = await Contact.find().sort({ createdAt: -1 });

    return NextResponse.json({ success: true, data: contacts });
  } catch (error) {
    console.error("GET error:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
