import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        fromUserId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        read: { type: Boolean, default: false },
        message: { type: String, required: true },
    },
    { timestamps: true }
)

export default mongoose.model("Notification", notificationSchema);