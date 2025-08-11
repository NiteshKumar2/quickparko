import mongoose from "mongoose";
let isConnected;
export async function connect() {
  if (isConnected) {
    return;
  }
  try {
    const { user, password } = process.env;

    if (!user || !password) {
      throw new Error(
        "User and password must be defined in environment variables."
      );
    }

    const connectionStr = `mongodb+srv://${user}:${password}@cluster0.3f7rq.mongodb.net/parkingDB?retryWrites=true&w=majority&appName=Cluster0`;

    await mongoose.connect(connectionStr);
    isConnected = true;
    const connection = mongoose.connection;

    connection.on("connected", () => {
      console.log("MongoDB connected successfully");
    });

    connection.on("error", (err) => {
      console.error("MongoDB connection error:", err);
      process.exit(1); // Exit with failure
    });

    connection.on("disconnected", () => {
      console.warn("MongoDB disconnected");
    });

    connection.on("reconnected", () => {
      console.log("MongoDB reconnected");
    });
  } catch (error) {
    console.error("Something went wrong while connecting to MongoDB:", error);
    isConnected = false;
    process.exit(1); // Exit with failure
  }
}
