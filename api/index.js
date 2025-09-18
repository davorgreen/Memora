import express from 'express'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import authRoute from './routes/auth.js'
import usersRoute from './routes/users.js'
import postsRoute from "./routes/post.js"
import notificationsRoute from "./routes/notification.js"
import cookieParser from 'cookie-parser'
import cors from "cors";
import http from "http"
import { Server } from "socket.io"
import { initSocket, users } from './socket.js';

const app = express();
dotenv.config();
const server = http.createServer(app);
const io = initSocket(server);

io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("register", (userId) => {
        if (!users.has(userId)) {
            users.set(userId, new Set())
        }
        users.get(userId).add(socket.id)
        console.log(`User ${userId} registered on socket ${socket.id}`);
    });

    /*  socket.on("send-like", ({ fromUserId, toUserId }) => {
          const receiverSocket = users.get(toUserId);
          if (receiverSocket) {
              io.to(receiverSocket).emit("like-notification", {
                  message: `User ${fromUserId} liked your post!`,
                  fromUserId,
              });
          }
      });
  
      socket.on("send-message", ({ fromUserId, toUserId, text }) => {
          const receiverSocket = users.get(toUserId);
          if (receiverSocket) {
              io.to(receiverSocket).emit("receive-message", {
                  fromUserId,
                  text,
              });
          }
      });*/

    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
        for (let [userId, socketIds] of users.entries()) {
            socketIds.delete(socket.id);
            if (socketIds.size === 0) {
                users.delete(userId)
            }
        }
    });
    socket.on("logout", (userId) => {
        users.delete(userId);
        console.log("User logged out:", userId);
        socket.disconnect();
    });
});

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
app.use("/api/notifications", notificationsRoute)

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

server.listen(3001, async () => {
    await connect();
    console.log('Server and Socket are running on port 3001');
});