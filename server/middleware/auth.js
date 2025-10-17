import jwt from "jsonwebtoken";
import User from "../models/User.js";

const authenticateUser = async (req, res, next) => {
    try {
        // Get token from cookie OR Authorization header
        let token = req.cookies.token;
        
        // If no cookie token, try Authorization header
        if (!token && req.headers.authorization) {
            const authHeader = req.headers.authorization;
            console.log('🔍 Authorization header received:', authHeader ? 'YES' : 'NO');
            console.log('🔍 Auth header value:', authHeader ? authHeader.substring(0, 20) + '...' : 'none');
            if (authHeader.startsWith('Bearer ')) {
                token = authHeader.substring(7); // Remove 'Bearer ' prefix
                console.log('🔑 Using token from Authorization header');
            }
        }
        
        if (!token) {
            return res.status(401).json({ 
                success: false,
                message: "Access denied. No token provided." 
            });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Get user from database (include password field to check if user has one, but don't include token)
        const user = await User.findById(decoded.id).select('-emailVerifyToken');
        
        console.log('Auth middleware - Looking for user ID:', decoded.id);
        console.log('Auth middleware - User found:', user ? 'YES' : 'NO (DELETED FROM DATABASE)');
        
        if (!user) {
            console.log('⚠️ User has valid JWT but account deleted from database - logging them out!');
            // Clear the cookie
            res.clearCookie('token');
            return res.status(401).json({ 
                success: false,
                message: "Your account has been deleted. Please contact support.",
                accountDeleted: true
            });
        }

        // Add full user object to request (password field is needed to check if user has password)
        req.user = user;
        
        next();
        
    } catch (error) {
        console.error("Authentication error:", error);
        
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ 
                success: false,
                message: "Token expired. Please log in again." 
            });
        }
        
        return res.status(401).json({ 
            success: false,
            message: "Invalid token." 
        });
    }
};

export default authenticateUser;