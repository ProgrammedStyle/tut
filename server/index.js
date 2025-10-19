import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Try loading .env from server directory first, then parent directory
dotenv.config({ path: path.join(__dirname, '.env') });
dotenv.config({ path: path.join(__dirname, '..', '.env') });

console.log('Environment variables loaded:');
console.log('- GOOGLE_CLIENT_ID:', process.env.GOOGLE_CLIENT_ID ? 'SET ✓' : 'NOT SET ✗');
console.log('- GOOGLE_CLIENT_SECRET:', process.env.GOOGLE_CLIENT_SECRET ? 'SET ✓' : 'NOT SET ✗');
console.log('- FACEBOOK_CLIENT_ID:', process.env.FACEBOOK_CLIENT_ID ? 'SET ✓' : 'NOT SET ✗');
console.log('- FACEBOOK_CLIENT_SECRET:', process.env.FACEBOOK_CLIENT_SECRET ? 'SET ✓' : 'NOT SET ✗');

import express from "express";
import connectDB from "./config/db.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import passport from 'passport';

const app = express();

// Security middleware
app.use(helmet({
    crossOriginEmbedderPolicy: false, // Allow cross-origin requests for OAuth
    contentSecurityPolicy: false, // Disable CSP for OAuth redirects
}));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: "Too many requests from this IP, please try again later.",
    standardHeaders: true,
    legacyHeaders: false,
});
app.use(limiter);

// Stricter rate limiting for auth endpoints
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Limit each IP to 5 auth requests per windowMs
    message: "Too many authentication attempts, please try again later.",
    skipSuccessfulRequests: true,
});
app.use("/api/user/create", authLimiter);
app.use("/api/user/signin", authLimiter);
app.use("/api/user/facebook", authLimiter);
app.use("/api/user/google", authLimiter);

app.use(cookieParser());

const corsOptions = {
    origin: (origin, callback) => {
        console.log('🌐 CORS check - Origin:', origin);
        console.log('🌐 CORS check - CLIENT_URL:', process.env.CLIENT_URL);
        
        // Allow requests from localhost during development
        if (!origin || origin.includes('localhost') || origin.includes('127.0.0.1')) {
            console.log('✅ CORS: Allowing localhost');
            callback(null, true);
        } 
        // Allow requests from your frontend domain
        else if (origin === 'https://tut-2-64sz.onrender.com') {
            console.log('✅ CORS: Allowing frontend domain');
            callback(null, true);
        }
        // Allow requests from CLIENT_URL if set
        else if (process.env.CLIENT_URL && origin === process.env.CLIENT_URL) {
            console.log('✅ CORS: Allowing CLIENT_URL');
            callback(null, true);
        } else {
            console.log('❌ CORS: Blocking origin:', origin);
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ["GET", "PUT", "POST", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
};

app.use(cors(corsOptions));

connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(passport.initialize());

// Load passport config AFTER environment variables are set
await import("./config/passport.js");
console.log('✓ Passport configuration loaded');

import userRoute from "./routes/user/index.js";
import analyticsRoute from "./routes/analytics/index.js";
import translationsRoute from "./routes/translations/index.js";
import contactRoute from "./routes/contact.js";
import checkPasswordExpiry from "./middleware/passwordExpiry.js";

app.use("/api/user", userRoute);
app.use("/api/analytics", analyticsRoute);
app.use("/api/translations", translationsRoute);
app.use("/api/contact", contactRoute);

// Apply password expiry check to all protected routes
app.use(checkPasswordExpiry);

// Test route to verify server is working
app.get("/api/test", (req, res) => {
    res.json({ message: "Server is working!" });
});

// Debug route to check all registered routes
app.get("/api/debug/routes", (req, res) => {
    const routes = [];
    app._router.stack.forEach((middleware) => {
        if (middleware.route) {
            routes.push({
                path: middleware.route.path,
                methods: Object.keys(middleware.route.methods)
            });
        }
    });
    res.json({ routes });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log("Server running successfuly, Port: " + PORT);
});