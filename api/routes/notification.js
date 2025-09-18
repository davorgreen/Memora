import express from "express"
import { getNotifications } from "../controllers/notification.controller.js"

const router = express.Router();

router.get("/:userId", getNotifications);

export default router;