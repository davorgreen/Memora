import Notification from "../models/Notification.js";

export const getNotifications = async (req, res, next) => {
    try {
        const { userId } = req.params;
        const notifications = await Notification.find({ userId }).sort({ createdAt: -1 });

        return res.status(200).json(notifications)
    } catch (error) {
        next(error)
    }
}
