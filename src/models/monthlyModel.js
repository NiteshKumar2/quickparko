const { default: mongoose } = require("mongoose");

const monthlySchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Please provide an email"],
      lowercase: true,
      trim: true,
      match: [/.+@.+\..+/, "Please provide a valid email address"],
      index: true, // faster lookups
    },
    vehicle: {
      type: String,
      required: [true, "Please provide a vehicle number"],
      trim: true,
      uppercase: true, // makes searches consistent
      index: true,
    },
    phone: {
      type: String,
      trim: true,
      match: [/^\d{10}$/, "Please provide a valid 10-digit phone number"],
    },
    planExpire: {
      type: Date,
      default: null,
    },
    // Store all in/out sessions as an array
    timing: [
      {
        inTime: { type: Date, default: null },
        outTime: { type: Date, default: null },
      },
    ],
  },
  {
    timestamps: true,
    collection: "monthly",
    versionKey: false,
  }
);

// Compound index if needed
monthlySchema.index({ email: 1, vehicle: 1 }, { unique: true });

export const Monthly =
  mongoose.models.Monthly || mongoose.model("Monthly", monthlySchema);
