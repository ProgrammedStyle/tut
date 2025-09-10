import dotenv from "dotenv";

dotenv.config();

import express from "express";
import connectDB from "./config/db.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRoute from "./routes/user/index.js";

const app = express();

app.use(cookieParser());

app.use(cors({
    origin: "http://localhost:3000",
    credentials: true
}));

connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/user", userRoute);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log("Server running successfuly");
});