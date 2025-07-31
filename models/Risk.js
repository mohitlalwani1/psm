import mongoose from "mongoose";

const riskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: String,
    category: String,
    probability: { type: String, enum: ["low", "medium", "high"] },
    impact: { type: String, enum: ["low", "medium", "high"] },
    status: {
      type: String,
      enum: ["identified", "assessed", "mitigated", "closed"],
      default: "identified",
    },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    mitigation: String,
    project: { type: mongoose.Schema.Types.ObjectId, ref: "Project" },
    program: { type: mongoose.Schema.Types.ObjectId, ref: "Program" },
  },
  { timestamps: true }
);

export default mongoose.model("Risk", riskSchema);
