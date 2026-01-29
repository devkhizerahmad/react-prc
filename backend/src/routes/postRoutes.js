import { Router } from "express";
import {
    createPost,
    getAllPosts,
    getPostById,
    updatePost,
    deletePost,
    getMyPosts
} from "../controllers/postController.js";
import { authenticateToken } from "../middleware/auth.js";

const router = Router();

// Public routes
router.get("/", getAllPosts);
router.get("/:id", getPostById);

// Protected routes (require authentication)
router.use(authenticateToken); // Apply to all routes below

router.post("/", createPost);
router.get("/my/posts", getMyPosts);
router.put("/:id", updatePost);
router.delete("/:id", deletePost);

export default router;
