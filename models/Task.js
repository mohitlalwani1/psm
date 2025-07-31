import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: String,
    status: {
      type: String,
      enum: ["todo", "in-progress", "review", "completed"],
      default: "todo",
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high", "critical"],
      default: "medium",
    },
    assignee: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    reporter: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    project: { type: mongoose.Schema.Types.ObjectId, ref: "Project" },
    startDate: Date,
    dueDate: Date,
    estimatedHours: Number,
    actualHours: Number,
    dependencies: [{ type: mongoose.Schema.Types.ObjectId, ref: "Task" }],
    tags: [String],
  },
  { timestamps: true }
);

export default mongoose.model("Task", taskSchema);
