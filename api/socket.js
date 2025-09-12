import { Server } from "socket.io";

let io;
export const users = new Map();

export const initSocket = (server) => {
    io = new Server(server, {
        cors: {
            origin: ['http://localhost:5173', 'http://localhost:5174'],
            methods: ["GET", "POST"]
        }
    });
    return io;
};

export const getSocket = () => {
    if (!io) throw new Error("Socket.io not initialized!");
    return io;
};