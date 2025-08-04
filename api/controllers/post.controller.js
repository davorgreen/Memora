import Post from "../models/Post.js"
import cloudinary from "../utils/cloudinary.js";
import uploadBase64Image from "../utils/cloudinary.js"

//create post
export const createPost = async (req, res, next) => {
    try {
        let image = null;
        if (req.body.image) {
            const result = await uploadBase64Image(req.body.image, "posts");
            image = {
                url: result.secure_url,
                public_id: result.public_id
            }
        }
        const newPost = new Post({
            userId: req.body.userId,
            description: req.body.description || "",
            image
        });
        const savedPost = await newPost.save();
        res.status(201).json(savedPost);
    } catch (error) {
        next(error);
    }
}

//update post
export const updatePost = async (req, res, next) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json("Post not found");
        if (post.userId !== req.body.userId) {
            return res.status(403).json({ message: "You can update only your own posts!" })
        }
        if (req.body.image && post.image?.public_id) {
            await cloudinary.uploader.destroy(post.image.public_id);
        }
        let updatedImage = post.image;
        if (req.body.image) {
            const result = await uploadBase64Image(req.body.image, "posts");
            updatedImage = {
                url: result.secure_url,
                public_id: result.public_id
            }
        }
        post.description = req.body.description || post.description;
        post.image = updatedImage;
        const updatedPost = await post.save();
        res.status(200).json(updatedPost);
    } catch (error) {
        next(error);
    }
}

//delete post
export const deletePost = async (req, res, next) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json("Post not found");
        if (post?.userId !== req.body.userId) {
            return res.status(403).json({ message: "You can delete only your own posts!" });
        }
        if (post.image?.public_id) {
            await cloudinary.uploader.destroy(post.image.public_id);
        }

        await Post.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Post deleted successfully!" });
    } catch (error) {
        next(error);
    }
}