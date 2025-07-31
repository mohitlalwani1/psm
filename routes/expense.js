import express from "express";
import { auth } from "../middleware/auth.js";

const router = express.Router();

// Get all expenses
router.get("/", auth, async (req, res) => {
  try {
    // Mock data - replace with actual database queries
    const expenses = [
      {
        _id: "1",
        description: "Software licenses",
        amount: 5000,
        category: "Software",
        date: "2024-01-15",
        budgetId: "1",
      },
      {
        _id: "2",
        description: "Marketing materials",
        amount: 3000,
        category: "Marketing",
        date: "2024-01-20",
        budgetId: "2",
      },
      {
        _id: "3",
        description: "Team training",
        amount: 8000,
        category: "Training",
        date: "2024-02-01",
        budgetId: "1",
      },
    ];
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Create new expense
router.post("/", auth, async (req, res) => {
  try {
    const expense = {
      _id: Date.now().toString(),
      ...req.body,
    };
    res.status(201).json(expense);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Get expense by ID
router.get("/:id", auth, async (req, res) => {
  try {
    // Mock data - replace with actual database query
    const expense = {
      _id: req.params.id,
      description: "Sample Expense",
      amount: 5000,
      category: "Software",
      date: "2024-01-15",
      budgetId: "1",
    };
    res.json(expense);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Update expense
router.put("/:id", auth, async (req, res) => {
  try {
    const expense = {
      _id: req.params.id,
      ...req.body,
    };
    res.json(expense);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Delete expense
router.delete("/:id", auth, async (req, res) => {
  try {
    res.json({ message: "Expense deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
