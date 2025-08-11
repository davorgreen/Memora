import User from "../models/User.js";

//getUser
export const getUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);
        res.status(200).json(user);
    } catch (error) {
        next(error);
    }
}

//getUsers
export const getUsers = async (req, res, next) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        next(error);
    }
}

//add friend
export const addFriend = async (req, res, next) => {
    const userId = req.user.id;
    const friendId = req.body.friendId;

    if (userId === friendId) return res.status(400).json({ message: "You can't add yourself!" });
    try {
        const user = await User.findById(userId);
        if (user.friends.includes(friendId)) {
            return res.status(400).json({ message: "He's already a friend!" });
        }
        user.friends.push(friendId);
        await user.save();
        const populatedUser = await User.findById(userId).populate('friends');
        res.status(200).json({ friends: populatedUser.friends });
    } catch (err) {
        next(err);
    }
}

//remove friend
export const removeFriend = async (req, res, next) => {
    const userId = req.user.id;
    const friendId = req.body.friendId;
    try {
        const user = await User.findById(userId);
        user.friends = user.friends.filter(id => id.toString() !== friendId);
        await user.save();
        res.status(200).json({ message: "Friend removed!" });
    } catch (err) {
        next(err);
    }
};

export const getAllFriends = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id).populate('friends');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user.friends);
    } catch (err) {
        next(err);
    }
};

