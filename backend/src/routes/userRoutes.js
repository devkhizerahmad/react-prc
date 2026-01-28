import { Router } from "express";
import {
  signup,
  login,
  getAllUsers,
  getUserById,
  getUserByEmail,
  getProfile,
} from "../controllers/userController.js";
import {
  validateSignup,
  validateLogin,
  validateGetUserById,
  validateGetUserByEmail,
} from "../middleware/validation.js";
import { authenticateToken } from "../middleware/auth.js";

const router = Router();

// Public routes
router.post("/signup", validateSignup, signup);
router.post("/login", validateLogin, login);

// Protected routes (require authentication)
router.get("/users", authenticateToken, getAllUsers);
router.get("/profile", authenticateToken, getProfile);

// Routes with validation middleware
router.get("/users/:id", validateGetUserById, getUserById);
router.get("/users/email/:email", validateGetUserByEmail, getUserByEmail);

export default router;
