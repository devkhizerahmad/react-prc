import { Router } from "express";
import {
  updateUserProfile,
  completeUserProfile,
  getUserProfile,
  getPublicProfile,
} from "../controllers/userProfileController.js";
import {
  validateUpdateProfile,
  validateGetPublicProfile,
} from "../middleware/validation.js";
import { authenticateToken } from "../middleware/auth.js";

const router = Router();

// Protected routes (require authentication)
router.put(
  "/profile",
  authenticateToken,
  validateUpdateProfile,
  updateUserProfile
);

router.post(
  "/profile/complete",
  authenticateToken,
  validateUpdateProfile,
  completeUserProfile
);

router.get("/profile", authenticateToken, getUserProfile);

// Public route to get another user's public profile
router.get("/profile/public/:id", validateGetPublicProfile, getPublicProfile);

export default router;
