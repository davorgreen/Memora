import express from "express"
import { addFriend, getUser, getUsers, removeFriend } from "../controllers/user.controller.js"
import { verifyToken } from "../utils/verifyToken.js";


const router = express.Router();

//getUser
router.get('/:id', getUser);
//getUsers
router.get("/", verifyToken, getUsers);
//add friend
router.post('/add-friend', verifyToken, addFriend);
//remove friend
router.post('/remove-friend', verifyToken, removeFriend);
export default router;