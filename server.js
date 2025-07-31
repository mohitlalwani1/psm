import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/user.js";
import programRoutes from "./routes/program.js";
import projectRoutes from "./routes/project.js";
import taskRoutes from "./routes/task.js";
import riskRoutes from "./routes/risk.js";
import documentRoutes from "./routes/document.js";
import notificationRoutes from "./routes/notification.js";
import budgetRoutes from "./routes/budget.js";
import expenseRoutes from "./routes/expense.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/programs", programRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/risks", riskRoutes);
app.use("/api/documents", documentRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/budgets", budgetRoutes);
app.use("/api/expenses", expenseRoutes);

app.get("/", (req, res) => {
  res.send("Project Management API is running.");
});

mongoose
  .connect(process.env.MONGO_URI || "mongodb://localhost:27017/projectmgmt", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    const PORT = process.env.PORT || 1200;
    app.listen(PORT, () => {
      console.log(`Backend API running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });
