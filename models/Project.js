import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: String,
    status: {
      type: String,
      enum: ["planning", "in-progress", "completed", "archived"],
      default: "planning",
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high", "critical"],
      default: "medium",
    },
    startDate: Date,
    endDate: Date,
    budget: Number,
    spent: { type: Number, default: 0 },
    progress: { type: Number, default: 0 },
    manager: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    team: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Task" }],
    program: { type: mongoose.Schema.Types.ObjectId, ref: "Program" },
    risks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Risk" }],
    documents: [{ type: mongoose.Schema.Types.ObjectId, ref: "Document" }],
  },
  { timestamps: true }
);

export default mongoose.model("Project", projectSchema);
