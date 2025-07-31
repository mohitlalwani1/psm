import express from "express";
import Risk from "../models/Risk.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

router.get("/", auth, async (req, res) => {
  const risks = await Risk.find().populate("owner project program");
  res.json(risks);
});

router.post("/", auth, async (req, res) => {
  const risk = await Risk.create(req.body);
  res.status(201).json(risk);
});

router.get("/:id", auth, async (req, res) => {
  const risk = await Risk.findById(req.params.id).populate(
    "owner project program"
  );
  if (!risk) return res.status(404).json({ message: "Not found" });
  res.json(risk);
});

router.put("/:id", auth, async (req, res) => {
  const risk = await Risk.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.json(risk);
});

router.delete("/:id", auth, async (req, res) => {
  await Risk.findByIdAndDelete(req.params.id);
  res.json({ message: "Risk deleted" });
});

export default router;
