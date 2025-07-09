import express from 'express'

const router = express.Router();

router.post("/register", (req, res) => {
    res.send("Hello, this is register endpoint");
})

router.post("/login", (req, res) => {
    res.send("Hello, this is login endpoint");
})

router.get("/user", (req, res) => {
    res.send("get user");
})

router.post("/logout", (req, res) => {
    res.send("logout");
})

export default router; 