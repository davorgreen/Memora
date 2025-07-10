import express from 'express'
import { login, register } from '../controllers/auth.controller.js';

const router = express.Router();

router.post("/register", register);

router.post("/login", login);

router.get("/user", (req, res) => {
    res.send("get user");
})

router.post("/logout", (req, res) => {
    res.send("logout");
})

export default router; 