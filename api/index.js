import express from 'express'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import authRoute from './routes/auth.js'
const app = express();
dotenv.config();

const connect = async () => {
    try {
        await mongoose.connect(process.env.MONGO);
        console.log("Connected to mongoDB");
    } catch (error) {
        throw error;
    }
}

//middlewares
app.use(express.json());
app.use("/auth", authRoute);

mongoose.connection.on("disconnected", () => {
    console.log("mongoDB disconnected!");
})

app.listen(3000, () => {
    connect();
    console.log('Connected to backend!');
})