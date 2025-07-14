import express from "express"
import { getUser, getUsers } from "../controllers/user.controller.js"

const router = express.Router();

//getUser
router.get('/:id', getUser);
//getUsers
router.get("/", getUsers);

export default router;