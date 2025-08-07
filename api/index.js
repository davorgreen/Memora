import express from 'express'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import authRoute from './routes/auth.js'
import usersRoute from './routes/users.js'
import postsRoute from "./routes/post.js"
import cookieParser from 'cookie-parser'
import cors from "cors";

const app = express();
dotenv.config();

const allowedOrigins = ['http://localhost:5173', 'http://localhost:5174']

const connect = async () => {
    try {
        await mongoose.connect(process.env.MONGO);
        console.log("Connected to mongoDB");
    } catch (error) {
        throw error;
    }
}

//middlewares
app.use(cors({
    origin: allowedOrigins,
    credentials: true,
}));
app.use(cookieParser());
app.use(express.json());


app.use("/api/auth", authRoute);
app.use("/api/users", usersRoute);
app.use("/api/posts", postsRoute);

app.use((err, req, res, next) => {
    const errorStatus = err.status || 500
    const errorMessage = err.message || "Something went wrong"
    return res.status(errorStatus).json({
        success: false,
        status: errorStatus,
        message: errorMessage,
        stack: err.stack
    });
})

mongoose.connection.on("disconnected", () => {
    console.log("mongoDB disconnected!");
})

app.listen(3000, () => {
    connect();
    console.log('Connected to backend!');
})