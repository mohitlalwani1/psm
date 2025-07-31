import express from "express";
import Task from "../models/Task.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

router.get("/", auth, async (req, res) => {
  const tasks = await Task.find().populate(
    "assignee reporter project dependencies"
  );
  res.json(tasks);
});

router.post("/", auth, async (req, res) => {
  const task = await Task.create(req.body);
  res.status(201).json(task);
});

router.get("/:id", auth, async (req, res) => {
  const task = await Task.findById(req.params.id).populate(
    "assignee reporter project dependencies"
  );
  if (!task) return res.status(404).json({ message: "Not found" });
  res.json(task);
});

router.put("/:id", auth, async (req, res) => {
  const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.json(task);
});

router.delete("/:id", auth, async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.json({ message: "Task deleted" });
});

export default router;
