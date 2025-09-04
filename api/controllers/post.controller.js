import Post from "../models/Post.js"
import User from "../models/User.js"
import cloudinary, { uploadBase64Image } from "../utils/cloudinary.js";


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
        if (post.userId.toString() !== req.body.userId) {
            return res.status(403).json({ message: "You can update only your own posts!" });
        }
        post.description = req.body.description || post.description;
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
        if (post.userId.toString() !== req.user.id) {
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

//get me all my posts and my friends' posts
export const getPosts = async (req, res, next) => {
    try {
        const userId = req.params.userId;

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found!" });

        const feedUserIds = [user._id, ...user.friends];

        const posts = await Post.find({ userId: { $in: feedUserIds } })
            .sort({ createdAt: -1 })
            .populate("userId", "username");

        const validPosts = posts.filter(post => post.userId != null);

        const uniquePosts = validPosts.filter(
            (post, index, self) =>
                index === self.findIndex((p) => p._id.toString() === post._id.toString())
        );

        res.status(200).json(uniquePosts);
    } catch (error) {
        next(error)
    }
}

//get UserPost 
export const getMyPosts = async (req, res, next) => {
    try {
        const userId = req.params.userId;

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found!" });

        const posts = await Post.find({ userId })
            .sort({ createdAt: -1 })
            .populate("userId", "username");

        return res.status(200).json(posts);
    } catch (error) {
        next(error)
    }
}

//like post
export const handleLikePost = async (req, res, next) => {
    try {
        const { postId } = req.params;
        const userId = req.user.id;

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        if (post.likes.includes(userId)) {
            await Post.findByIdAndUpdate(
                postId,
                { $pull: { likes: userId } },
                { new: true }
            )
            return res.status(200).json({ message: "Like removed" });
        }

        const updatedPost = await Post.findByIdAndUpdate(
            postId,
            { $addToSet: { likes: userId } },
            { new: true }
        )
        return res.status(200).json({
            message: "Like added",
            likesCount: updatedPost.likes.length,
            likes: updatedPost.likes,
        });
    } catch (error) {
        next(error);
    }
}

//add comment
export const addComment = async (req, res, next) => {
    try {
        const { postId } = req.params;
        const { comment } = req.body;
        const userId = req.user.id;

        if (!comment || comment.trim() === '') {
            return res.status(400).json({ message: "Comment cannot be empty!" });
        }

        const post = await Post.findByIdAndUpdate(
            postId,
            {
                $push: {
                    comments: {
                        userId, comment, createdAt: new Date(),
                    }
                }
            },
            { new: true }
        ).populate("comments.userId", "username")
        res.status(201).json({
            message: "Comment added",
            comments: post.comments
        })
        if (!post) {
            return res.status(400).json({ message: "Post not found" });
        }
    } catch (error) {
        next(error);
    }
}

//delete comment
export const deleteComment = async (req, res, next) => {
    try {
        const { postId, commentId } = req.params;
        const userId = req.user.id;

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        const comment = post.comments.id(commentId);
        if (!comment) {
            return res.status(404).json({ message: "Comment not found" });
        }

        if (comment.userId.toString() !== userId) {
            return res.status(403).json({ message: "Not authorized" })
        }
        comment.deleteOne();
        await post.save();
        res.status(200).json({
            message: "Comment deleted",
            comments: post.comments,
        });
    } catch (error) {
        next(error);
    }
}