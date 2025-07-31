import express from "express";
import Program from "../models/Program.js";
import { auth, requireRole } from "../middleware/auth.js";

const router = express.Router();

// Get all programs
router.get("/", auth, async (req, res) => {
  const programs = await Program.find()
    .populate("manager", "name")
    .populate("projects")
    .populate("risks");
  res.json(programs);
});

// Create program (admin/manager)
router.post("/", auth, requireRole("admin"), async (req, res) => {
  const program = await Program.create(req.body);
  res.status(201).json(program);
});

// Get program by ID
router.get("/:id", auth, async (req, res) => {
  const program = await Program.findById(req.params.id).populate(
    "manager projects risks"
  );
  if (!program) return res.status(404).json({ message: "Not found" });
  res.json(program);
});

// Update program
router.put("/:id", auth, requireRole("admin"), async (req, res) => {
  const program = await Program.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.json(program);
});

// Delete program
router.delete("/:id", auth, requireRole("admin"), async (req, res) => {
  await Program.findByIdAndDelete(req.params.id);
  res.json({ message: "Program deleted" });
});

export default router;
