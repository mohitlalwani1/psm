import express from "express";
import Notification from "../models/Notification.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

router.get("/", auth, async (req, res) => {
  const notes = await Notification.find({ user: req.user.id });
  res.json(notes);
});

router.post("/", auth, async (req, res) => {
  const note = await Notification.create({ ...req.body, user: req.user.id });
  res.status(201).json(note);
});

router.patch("/:id/read", auth, async (req, res) => {
  const note = await Notification.findByIdAndUpdate(
    req.params.id,
    { read: true },
    { new: true }
  );
  res.json(note);
});

export default router;
