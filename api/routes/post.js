import express from "express"
import { verifyToken } from "../utils/verifyToken.js";
import { createPost, deletePost, getPosts, updatePost } from "../controllers/post.controller.js";

const router = express.Router();

router.post("/create-post", verifyToken, createPost);
router.put("/:id", verifyToken, updatePost);
router.delete("/:id", verifyToken, deletePost);
router.get("/feed/:userId", verifyToken, getPosts)

export default router;