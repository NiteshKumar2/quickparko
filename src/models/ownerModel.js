const { default: mongoose } = require("mongoose");

const ownerSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Please provide a username"],
      trim: true,
      minlength: [3, "Username must be at least 3 characters long"],
      maxlength: [50, "Username cannot be more than 50 characters long"],
    },
    email: {
      type: String,
      required: [true, "Please provide an email"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/.+@.+\..+/, "Please provide a valid email address"],
    },
    password: {
      type: String,
      required: [true, "Please provide a password"],
      minlength: [6, "Password must be at least 6 characters long"],
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    phone: {
      type: String,
      trim: true,
      match: [/^\d{10}$/, "Please provide a valid 10-digit phone number"], // Only allows 10 digits
    },
    address: {
      type: String,
      trim: true,
    },
    termCondition: {
      type: String,
      trim: true,
    },
    dailyMonthly: {
      type: String,
      enum: ["daily", "monthly"],
    },
    price: {
      type: Number,
      min: [0, "Price must be a positive number"],
    },
  },
  { timestamps: true }
);

export const Owner =
  mongoose.models.Owner || mongoose.model("Owner", ownerSchema);
