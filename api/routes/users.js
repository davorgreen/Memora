import express from "express"
import { addFriend, getAllFriends, getFollowers, getUser, getUsers, removeFriend } from "../controllers/user.controller.js"
import { verifyToken } from "../utils/verifyToken.js";


const router = express.Router();


router.get('/followers', verifyToken, getFollowers);
router.get('/:id/friends', verifyToken, getAllFriends);
router.get('/:id', getUser);
router.get("/", verifyToken, getUsers);
router.post('/add-friend', verifyToken, addFriend);
router.post('/remove-friend', verifyToken, removeFriend);

export default router;