import mongoose from "mongoose";

const programSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: String,
    status: {
      type: String,
      enum: ["planning", "active", "on-hold", "completed"],
      default: "planning",
    },
    startDate: Date,
    endDate: Date,
    budget: Number,
    spent: { type: Number, default: 0 },
    manager: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    projects: [{ type: mongoose.Schema.Types.ObjectId, ref: "Project" }],
    risks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Risk" }],
  },
  { timestamps: true }
);

export default mongoose.model("Program", programSchema);
