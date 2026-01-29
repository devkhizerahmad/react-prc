import { Router } from "express";
import userRoutes from "./userRoutes.js";
import userProfileRoutes from "./userProfileRoutes.js";
import postRoutes from "./postRoutes.js";

const router = Router();

// Health check endpoint
router.get("/health", (req, res) => {
  res.json({ status: "✅ Backend OK" });
});

// User routes
router.use("/", userRoutes);

// User Profile routes
router.use("/", userProfileRoutes);

// Post routes
router.use("/posts", postRoutes);

export default router;
