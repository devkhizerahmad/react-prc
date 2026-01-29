import { PostService } from "../services/postService.js";

const sendResponse = (res, status, success, message, data = null, error = null) => {
    const response = { success, message };
    if (data) response.data = data;
    if (error && process.env.NODE_ENV === "development") response.error = error;
    return res.status(status).json(response);
};

export const createPost = async (req, res) => {
    try {
        const { id: userId } = req.user;
        const postData = req.body;
        const post = await PostService.createPost(userId, postData);
        return sendResponse(res, 201, true, "Post created successfully", { post });
    } catch (error) {
        if (error.message.includes("at least")) {
            return sendResponse(res, 400, false, error.message);
        }
        return sendResponse(res, 500, false, "Failed to create post", null, error.message);
    }
};

export const getAllPosts = async (req, res) => {
    try {
        const posts = await PostService.getAllPosts();
        return sendResponse(res, 200, true, "Posts fetched successfully", { posts });
    } catch (error) {
        return sendResponse(res, 500, false, "Failed to fetch posts", null, error.message);
    }
};

export const getPostById = async (req, res) => {
    try {
        const { id } = req.params;
        const post = await PostService.getPostById(id);
        return sendResponse(res, 200, true, "Post fetched successfully", { post });
    } catch (error) {
        if (error.message === "Post not found") {
            return sendResponse(res, 404, false, error.message);
        }
        return sendResponse(res, 500, false, "Failed to fetch post", null, error.message);
    }
};

export const updatePost = async (req, res) => {
    try {
        const { id: userId } = req.user;
        const { id: postId } = req.params;
        const updateData = req.body;
        const post = await PostService.updatePost(userId, postId, updateData);
        return sendResponse(res, 200, true, "Post updated successfully", { post });
    } catch (error) {
        if (error.message === "Post not found") {
            return sendResponse(res, 404, false, error.message);
        }
        if (error.message.includes("Unauthorized")) {
            return sendResponse(res, 403, false, error.message);
        }
        return sendResponse(res, 500, false, "Failed to update post", null, error.message);
    }
};

export const deletePost = async (req, res) => {
    try {
        const { id: userId } = req.user;
        const { id: postId } = req.params;
        const result = await PostService.deletePost(userId, postId);
        return sendResponse(res, 200, true, result.message);
    } catch (error) {
        if (error.message === "Post not found") {
            return sendResponse(res, 404, false, error.message);
        }
        if (error.message.includes("Unauthorized")) {
            return sendResponse(res, 403, false, error.message);
        }
        return sendResponse(res, 500, false, "Failed to delete post", null, error.message);
    }
};

export const getMyPosts = async (req, res) => {
    try {
        const { id: userId } = req.user;
        const posts = await PostService.getPostsByAuthor(userId);
        return sendResponse(res, 200, true, "Your posts fetched successfully", { posts });
    } catch (error) {
        return sendResponse(res, 500, false, "Failed to fetch your posts", null, error.message);
    }
};
