import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../../models/User.js";

const signin = async (req, res) => {
    try {
        const { email, password } = req.body;

        console.log("Sign in attempt for email:", email);

        // Validate input
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        // Find user by email
        const user = await User.findOne({ email });
        
        if (!user) {
            console.log("User not found:", email);
            return res.status(401).json({ message: "Invalid email or password" });
        }

        // Check if user has a password (not a social login account)
        if (!user.password) {
            console.log("User has no password (social login):", email);
            return res.status(401).json({ message: "Please sign in with Google or Facebook" });
        }

        // Verify password
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        
        if (!isPasswordCorrect) {
            console.log("Invalid password for user:", email);
            return res.status(401).json({ message: "Invalid email or password" });
        }

        // Generate JWT token
        const token = jwt.sign(
            {
                id: user._id,
                email: user.email
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "7d" // 7 days
            }
        );

        // Set cookie
        res.cookie("token", token, {
            httpOnly: true,
            secure: false, // Set to true in production with HTTPS
            sameSite: "lax",
            maxAge: 1000 * 60 * 60 * 24 * 7 // 7 days
        });

        console.log("Sign in successful for:", email);

        res.status(200).json({
            success: true,
            user: {
                id: user._id,
                email: user.email,
                role: user.role,
                hasPassword: !!user.password
            },
            message: "Signed in successfully"
        });

    } catch (error) {
        console.error("Sign in error:", error);
        res.status(500).json({
            success: false,
            message: "An error occurred during sign in",
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

export default signin;
