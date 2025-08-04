import mongoose from "mongoose";

const PostSchema = new mongoose.Schema({
    userId: {
        type: String, required: true
    },
    image: {
        url: { type: String },
        public_id: { type: String },
    },
    description: { type: String },
    likes: {
        type: [String]
    },
    comments: [
        {
            userId: { type: String, required: true },
            comment: { type: String, required: true },
            createdAt: { type: Date, default: Date.now },
        },
    ]
}, { timestamps: true })

export default mongoose.model("Post", PostSchema);