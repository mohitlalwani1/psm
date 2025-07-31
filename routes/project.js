import express from "express";
import Project from "../models/Project.js";
import { auth, requireRole } from "../middleware/auth.js";

const router = express.Router();

router.get("/", auth, async (req, res) => {
  const projects = await Project.find().populate(
    "manager team program tasks risks documents"
  );
  res.json(projects);
});

router.post("/", auth, requireRole("admin"), async (req, res) => {
  const project = await Project.create(req.body);
  res.status(201).json(project);
});

router.get("/:id", auth, async (req, res) => {
  const project = await Project.findById(req.params.id).populate(
    "manager team program tasks risks documents"
  );
  if (!project) return res.status(404).json({ message: "Not found" });
  res.json(project);
});

router.put("/:id", auth, requireRole("admin"), async (req, res) => {
  const project = await Project.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.json(project);
});

router.delete("/:id", auth, requireRole("admin"), async (req, res) => {
  await Project.findByIdAndDelete(req.params.id);
  res.json({ message: "Project deleted" });
});

export default router;
