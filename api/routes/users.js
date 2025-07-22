import express from "express"
import { getUser, getUsers } from "../controllers/user.controller.js"
import { verifyToken } from "../utils/verifyToken.js";


const router = express.Router();

//getUser
router.get('/:id', getUser);
//getUsers
router.get("/", verifyToken, getUsers);

export default router;