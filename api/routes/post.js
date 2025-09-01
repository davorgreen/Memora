import express from "express"
import { verifyToken } from "../utils/verifyToken.js";
import { createPost, deletePost, getMyPosts, getPosts, handleLikePost, updatePost } from "../controllers/post.controller.js";

const router = express.Router();

// POST
router.post("/create-post", verifyToken, createPost);
// GET
router.get("/feed/:userId", verifyToken, getPosts);
router.get("/user/:userId", verifyToken, getMyPosts);
// PUT
router.put("/:id", verifyToken, updatePost);
// DELETE
router.delete("/:id", verifyToken, deletePost);
//LIKE
router.post("/:postId/like", verifyToken, handleLikePost)

export default router;