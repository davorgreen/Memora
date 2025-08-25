import express from "express"
import { addFriend, getAllFriends, getFollowers, getUser, getUsers, removeFriend } from "../controllers/user.controller.js"
import { verifyToken } from "../utils/verifyToken.js";


const router = express.Router();

//getFollowers
router.get('/followers', verifyToken, getFollowers)
//getUser
router.get('/:id', getUser);
//getUsers
router.get("/", verifyToken, getUsers);
//add friend
router.post('/add-friend', verifyToken, addFriend);
//remove friend
router.post('/remove-friend', verifyToken, removeFriend);
//getAllFriends
router.get('/:id/friends', verifyToken, getAllFriends);

export default router;