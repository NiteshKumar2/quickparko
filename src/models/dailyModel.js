const { default: mongoose } = require("mongoose");

const dailySchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Please provide an email"],
      lowercase: true,
      trim: true,
      match: [/.+@.+\..+/, "Please provide a valid email address"],
    },
    vehicle: {
      type: String,
      required: [true, "Please provide a vehicle number"],
      trim: true,
    },
    token: {
      type: String,
      required: [true, "Please provide a token"],
      unique: true, // prevents duplicates
      trim: true,
    },
    status: {
      type: String,
      enum: {
        values: ["in", "out"],
        message: "Status must be either 'in' or 'out'",
      },
      default: "in", // default entry status
    },
  },
  { timestamps: true }
);

// Optional: Improve query performance
dailySchema.index({ email: 1, token: 1 });

export const Daily =
  mongoose.models.Daily || mongoose.model("Daily", dailySchema);
