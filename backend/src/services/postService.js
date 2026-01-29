import { prisma } from "../lib/prisma.js";

export class PostService {
    // Create a new post
    static async createPost(authorId, postData) {
        try {
            // Check if user profile is complete
            const user = await prisma.user.findUnique({
                where: { id: authorId },
                select: {
                    bio: true,
                    avatar: true,
                    dateOfBirth: true
                }
            });

            if (!user) {
                throw new Error("User not found");
            }

            if (!user.bio || !user.avatar || !user.dateOfBirth) {
                throw new Error("Please complete your profile (bio, avatar, and date of birth) before creating a post");
            }

            const { title, content, img } = postData;

            if (!title || title.trim().length < 3) {
                throw new Error("Title must be at least 3 characters long");
            }

            if (!content || content.trim().length < 10) {
                throw new Error("Content must be at least 10 characters long");
            }

            const post = await prisma.post.create({
                data: {
                    title: title.trim(),
                    content: content.trim(),
                    img: img || null,
                    authorId,
                },
                include: {
                    author: {
                        select: {
                            id: true,
                            name: true,
                            avatar: true,
                        },
                    },
                },
            });

            return post;
        } catch (error) {
            console.error("PostService - Create post error:", error.message);
            throw error;
        }
    }

    // Get all posts (with author info)
    static async getAllPosts() {
        try {
            const posts = await prisma.post.findMany({
                include: {
                    author: {
                        select: {
                            id: true,
                            name: true,
                            avatar: true,
                        },
                    },
                },
                orderBy: {
                    createdAt: "desc",
                },
            });

            return posts;
        } catch (error) {
            console.error("PostService - Get all posts error:", error.message);
            throw error;
        }
    }

    // Get post by ID
    static async getPostById(postId) {
        try {
            const post = await prisma.post.findUnique({
                where: { id: postId },
                include: {
                    author: {
                        select: {
                            id: true,
                            name: true,
                            avatar: true,
                        },
                    },
                },
            });

            if (!post) {
                throw new Error("Post not found");
            }

            return post;
        } catch (error) {
            console.error("PostService - Get post by ID error:", error.message);
            throw error;
        }
    }

    // Update a post
    static async updatePost(authorId, postId, updateData) {
        try {
            // Find post first to check ownership
            const existingPost = await prisma.post.findUnique({
                where: { id: postId },
            });

            if (!existingPost) {
                throw new Error("Post not found");
            }

            if (existingPost.authorId !== authorId) {
                throw new Error("Unauthorized: You can only update your own posts");
            }

            const post = await prisma.post.update({
                where: { id: postId },
                data: {
                    title: updateData.title ? updateData.title.trim() : existingPost.title,
                    content: updateData.content ? updateData.content.trim() : existingPost.content,
                    img: updateData.img !== undefined ? updateData.img : existingPost.img,
                    updatedAt: new Date(),
                },
                include: {
                    author: {
                        select: {
                            id: true,
                            name: true,
                            avatar: true,
                        },
                    },
                },
            });

            return post;
        } catch (error) {
            console.error("PostService - Update post error:", error.message);
            throw error;
        }
    }

    // Delete a post
    static async deletePost(authorId, postId) {
        try {
            const existingPost = await prisma.post.findUnique({
                where: { id: postId },
            });

            if (!existingPost) {
                throw new Error("Post not found");
            }

            if (existingPost.authorId !== authorId) {
                throw new Error("Unauthorized: You can only delete your own posts");
            }

            await prisma.post.delete({
                where: { id: postId },
            });

            return { success: true, message: "Post deleted successfully" };
        } catch (error) {
            console.error("PostService - Delete post error:", error.message);
            throw error;
        }
    }

    // Get posts by user (author)
    static async getPostsByAuthor(authorId) {
        try {
            const posts = await prisma.post.findMany({
                where: { authorId },
                orderBy: {
                    createdAt: "desc",
                },
            });

            return posts;
        } catch (error) {
            console.error("PostService - Get author posts error:", error.message);
            throw error;
        }
    }
}
