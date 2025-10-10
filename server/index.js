import dotenv from "dotenv";

dotenv.config();

import express from "express";
import connectDB from "./config/db.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import passport from 'passport';

const app = express();

app.use(cookieParser());

// Global, permissive CORS (reflect origin and allow credentials)
const corsOptions = {
    origin: (origin, callback) => {
        // Reflect the request origin in CORS headers
        callback(null, true);
    },
    credentials: true,
    methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
    allowedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Accept", "Authorization"],
    exposedHeaders: ["Set-Cookie"]
};

app.use(cors(corsOptions));
// Enable preflight for all routes
app.options("*", cors(corsOptions));

connectDB();

import "./config/passport.js";
import userRoute from "./routes/user/index.js";

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(passport.initialize());

app.use("/api/user", userRoute);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log("Server running successfuly");
});