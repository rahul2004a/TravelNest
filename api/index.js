import express from "express";
const app = express();
import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import hotelsRoute from "./routes/hotels.js";
import authRoute from "./routes/auth.js";
import cookieParser from 'cookie-parser';

import usersRoute from "./routes/users.js";
import cors from "cors";

const connect = async () => {
    try {
        await mongoose.connect(process.env.MONGO);
        console.log("Connected to MongoDB");
    } catch (error) {
        throw error;
    }
};

mongoose.connection.on("disconnected", () => {
    console.log("mongoDB disconnected!");
});

app.use(cookieParser());
app.use(express.json());

app.use("/api/auth", authRoute);
app.use("/api/hotels", hotelsRoute);
app.use("/api/users", usersRoute);

app.use((err, req, res, next) => {
    const errorStatus = err.status || 500;
    const errorMessage = err.message || "Something went wrong!";
    return res.status(errorStatus).json({
        success: false,
        status: errorStatus,
        message: errorMessage,
        stack: err.stack,
    });
});


app.listen(8800, () => {
    connect();
    console.log("Server is running on port 8800");
})