import User from "../models/User.js"
import bcrypt from "bcryptjs";
import { createError } from "../utils/error.js";
import jwt from 'jsonwebtoken'

export const register = async (req, res, next) => {
    try {
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(req.body.password, salt);

        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: hash,
        })
        await newUser.save()
        res.status(201).send("User has been created!");
    } catch (error) {
        next(error)
    }
}

export const login = async (req, res, next) => {
    try {
        const user = await User.findOne({ username: req.body.username });
        if (!user) return next(createError(404, "User not found!"));

        const isPasswordCorrect = await bcrypt.compare(req.body.password, user.password);
        if (!isPasswordCorrect) return next(createError(400, "Wrong password or username!"));

        const token = jwt.sign(
            { id: user._id, isAdmin: user.isAdmin },
            process.env.JWT_ACCESS_SECRET,
            { expiresIn: '2m' });

        const refreshToken = jwt.sign(
            { id: user._id, isAdmin: user.isAdmin },
            process.env.JWT_REFRESH_SECRET,
            { expiresIn: '7d' }
        );

        const { password, isAdmin, ...otherDetails } = user._doc;

        res
            .cookie('access_token', token, {
                httpOnly: true,
                maxAge: 2 * 60 * 1000,
            })
            .cookie('refresh_token', refreshToken, {
                httpOnly: true,
                maxAge: 7 * 24 * 60 * 60 * 1000,
            })
            .status(200)
            .json({ details: { ...otherDetails }, isAdmin });
    } catch (error) {
        next(error)
    }
}

export const logout = (req, res) => {
    res
        .clearCookie('access_token', {
            httpOnly: true,
        })
        .clearCookie('refresh_token', {
            httpOnly: true,
        })
        .status(200).json({ message: 'Logged out successfully' });
}

export const refreshToken = (req, res, next) => {
    const refreshToken = req.cookies.refresh_token;

    if (!refreshToken) {
        return next(createError(401, 'Refresh token missing!'));
    }

    jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (err, user) => {
        if (err) {
            return next(createError(403, "Refresh token invalid or expired"));
        }

        const newAccessToken = jwt.sign(
            { id: user.id, isAdmin: user.isAdmin },
            process.env.JWT_ACCESS_SECRET,
            { expiresIn: '15m' }
        );

        const newRefreshToken = jwt.sign(
            { id: user.id, isAdmin: user.isAdmin },
            process.env.JWT_REFRESH_SECRET,
            { expiresIn: '7d' }
        );

        res
            .cookie('access_token', newAccessToken, {
                httpOnly: true,
                maxAge: 15 * 60 * 1000,
            })
            .cookie('refresh_token', newRefreshToken, {
                httpOnly: true,
                maxAge: 7 * 24 * 60 * 60 * 1000,
            })
            .status(200)
            .json({ message: "Access token refreshed" });
    });
};

