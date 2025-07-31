import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    type: String,
    title: String,
    message: String,
    read: { type: Boolean, default: false },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    actionUrl: String,
  },
  { timestamps: true }
);

export default mongoose.model("Notification", notificationSchema);
