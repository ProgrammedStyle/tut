import dotenv from "dotenv";
import path from "path";
import fs from "fs";
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

// IMPORTANT: Static file serving MUST be defined BEFORE helmet middleware
// Static file serving for _html5 directory
app.use('/_html5', express.static(path.join(__dirname, '..', '_html5'), {
    setHeaders: (res, path) => {
        // Set CORS headers for all static files
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
        res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
        res.setHeader('Cross-Origin-Embedder-Policy', 'unsafe-none');
        
        // Set cache headers for better performance
        res.setHeader('Cache-Control', 'public, max-age=31536000'); // 1 year
        
        // Set appropriate content type for HTML files
        if (path.endsWith('.html')) {
            res.setHeader('Content-Type', 'text/html; charset=utf-8');
        }
    }
}));

// Static file serving for uploaded homepage images
app.use('/', express.static(path.join(__dirname, '..', 'client', 'public'), {
    setHeaders: (res, path) => {
        // Set CORS headers for all static files
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        res.setHeader('Access-Control-Allow-Credentials', 'true');
        res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
        res.setHeader('Cross-Origin-Embedder-Policy', 'unsafe-none');
        
        // Set cache headers for better performance
        res.setHeader('Cache-Control', 'public, max-age=31536000'); // 1 year
    }
}));

// Security middleware
app.use(helmet({
    crossOriginEmbedderPolicy: false, // Allow cross-origin requests for OAuth
    contentSecurityPolicy: false, // Disable CSP for OAuth redirects
}));

// Override CORS headers for image files after helmet
app.use((req, res, next) => {
    if (req.path.match(/\.(jpg|jpeg|png|gif|webp|bmp)$/)) {
        res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
        res.setHeader('Cross-Origin-Embedder-Policy', 'unsafe-none');
    }
    next();
});

// Rate limiting (disable globally in development)
if (process.env.NODE_ENV === 'production') {
    const limiter = rateLimit({
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 1000, // Limit each IP to 1000 requests per windowMs
        message: "Too many requests from this IP, please try again later.",
        standardHeaders: true,
        legacyHeaders: false,
    });
    app.use(limiter);
}

// Stricter rate limiting for auth endpoints (disabled in development)
if (process.env.NODE_ENV === 'production') {
    const authLimiter = rateLimit({
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 1000, // Limit each IP to 1000 auth requests per windowMs
        message: "Too many authentication attempts, please try again later.",
        skipSuccessfulRequests: true,
    });
    app.use("/api/user/create", authLimiter);
    app.use("/api/user/signin", authLimiter);
    app.use("/api/user/facebook", authLimiter);
    app.use("/api/user/google", authLimiter);
}

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
        else if (origin === process.env.CLIENT_URL) {
            console.log('✅ CORS: Allowing frontend domain');
            callback(null, true);
        }
        // Allow requests from Render frontend domains (fallback for deployment)
        else if (origin && origin.includes('onrender.com')) {
            console.log('✅ CORS: Allowing Render frontend domain');
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

// Test routes (must be before any middleware that might interfere)
app.get("/api/test", (req, res) => {
    res.json({ message: "Server is working!" });
});

app.get("/api/test-html5", (req, res) => {
    const html5Path = path.join(__dirname, '..', '_html5');
    
    try {
        const files = fs.readdirSync(html5Path);
        res.json({ 
            message: "_html5 static serving is working!", 
            html5Path: html5Path,
            files: files.slice(0, 10) // Show first 10 files
        });
    } catch (error) {
        res.json({ 
            message: "_html5 directory not found", 
            error: error.message,
            html5Path: html5Path
        });
    }
});

import userRoute from "./routes/user/index.js";
import analyticsRoute from "./routes/analytics/index.js";
import translationsRoute from "./routes/translations/index.js";
import contactRoute from "./routes/contact.js";
import locationRoute from "./routes/location/index.js";
import imageLinksRoute from "./routes/imageLinks/index.js";
import homepageImagesRoute from "./routes/homepageImages/index.js";
import videoLinksRoute from "./routes/videoLinks.js";
import checkPasswordExpiry from "./middleware/passwordExpiry.js";

app.use("/api/user", userRoute);
app.use("/api/analytics", analyticsRoute);
app.use("/api/translations", translationsRoute);
app.use("/api/contact", contactRoute);
app.use("/api/location", locationRoute);
app.use("/api/image-links", imageLinksRoute);
app.use("/api/homepage-images", homepageImagesRoute);
app.use("/api/video-links", videoLinksRoute);

// Apply password expiry check to all protected routes
app.use(checkPasswordExpiry);

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