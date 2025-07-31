import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String }, // Optional for Google OAuth users
    googleId: { type: String, sparse: true }, // For Google OAuth
    avatar: { type: String }, // Profile picture URL
    role: {
      type: String,
      enum: ["admin", "manager", "member"],
      default: "member",
    },
    department: String,
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
