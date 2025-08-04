import express from "express"
import { verifyToken } from "../utils/verifyToken.js";
import { createPost, deletePost, updatePost } from "../controllers/post.controller.js";

const router = express.Router();

router.post("/", verifyToken, createPost);
router.put("/:id", verifyToken, updatePost);
router.delete("/:id", verifyToken, deletePost);

export default router;