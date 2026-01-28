import { Router } from "express";
import userRoutes from "./userRoutes.js";

const router = Router();

// Health check endpoint
router.get("/health", (req, res) => {
  res.json({ status: "✅ Backend OK" });
});

// User routes
router.use("/", userRoutes);

export default router;
