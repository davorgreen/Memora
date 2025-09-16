import express from "express"
import { getNotifications } from "../controllers/Notification.js"

const router = express.Router();

router.get("/:userId", getNotifications);

export default router;