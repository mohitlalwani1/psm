import express from "express";
import { auth } from "../middleware/auth.js";

const router = express.Router();

// Get all budgets
router.get("/", auth, async (req, res) => {
  try {
    // Mock data - replace with actual database queries
    const budgets = [
      {
        _id: "1",
        name: "Project Alpha Budget",
        amount: 50000,
        spent: 25000,
        category: "Development",
        startDate: "2024-01-01",
        endDate: "2024-12-31",
        status: "active",
      },
      {
        _id: "2",
        name: "Marketing Budget",
        amount: 20000,
        spent: 15000,
        category: "Marketing",
        startDate: "2024-01-01",
        endDate: "2024-06-30",
        status: "active",
      },
    ];
    res.json(budgets);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Create new budget
router.post("/", auth, async (req, res) => {
  try {
    const budget = {
      _id: Date.now().toString(),
      ...req.body,
      spent: 0,
      status: "active",
    };
    res.status(201).json(budget);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Get budget by ID
router.get("/:id", auth, async (req, res) => {
  try {
    // Mock data - replace with actual database query
    const budget = {
      _id: req.params.id,
      name: "Sample Budget",
      amount: 50000,
      spent: 25000,
      category: "Development",
      startDate: "2024-01-01",
      endDate: "2024-12-31",
      status: "active",
    };
    res.json(budget);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Update budget
router.put("/:id", auth, async (req, res) => {
  try {
    const budget = {
      _id: req.params.id,
      ...req.body,
    };
    res.json(budget);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Delete budget
router.delete("/:id", auth, async (req, res) => {
  try {
    res.json({ message: "Budget deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
