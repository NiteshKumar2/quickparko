// models/dbConfig.js
import mongoose from "mongoose";

let isConnected = false;

export async function connect() {
  if (isConnected) return;

  try {
    const { user, password } = process.env;
    if (!user || !password) {
      throw new Error(
        "MongoDB user and password must be defined in env variables."
      );
    }

    const connectionStr = `mongodb+srv://${user}:${password}@cluster0.3f7rq.mongodb.net/parkingDB?retryWrites=true&w=majority&appName=Cluster0`;

    const db = await mongoose.connect(connectionStr, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    isConnected = db.connections[0].readyState === 1;
    console.log("✅ MongoDB connected successfully");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    throw error;
  }
}
