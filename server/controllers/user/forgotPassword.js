import jwt from "jsonwebtoken";
import { sendPasswordReset } from "../../services/emailService.js";
import User from "../../models/User.js";

const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        console.log("Forgot password request for email:", email);

        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }

        // Check if user exists
        const user = await User.findOne({ email });
        
        if (!user) {
            // For security, don't reveal if email exists or not, but DON'T send email
            console.log("⚠️ User not found for email:", email, "- NOT sending email but showing success message");
            return res.status(200).json({ 
                success: true,
                message: "If an account with that email exists, a password reset link has been sent." 
            });
        }
        
        console.log("✓ User found:", email, "- Proceeding to send reset email");

        // Check if user has a password (not a social login account)
        if (!user.password) {
            console.log("User has no password (social login):", email);
            return res.status(400).json({ 
                message: "This account uses social login. Please sign in with Google or Facebook." 
            });
        }

        // Generate reset token (expires in 15 minutes)
        const resetToken = jwt.sign(
            {
                userId: user._id,
                email: user.email
            },
            process.env.EMAIL_VERIFY_JWT_SECRET,
            { expiresIn: "15m" }
        );

        const resetURL = `${process.env.CLIENT_URL}/ResetPassword?token=${resetToken}`;

        console.log("Generated reset URL:", resetURL);

        // Send email using the new email service
        console.log("Sending password reset email...");
        const result = await sendPasswordReset(email, resetToken);
        
        console.log("Password reset email sent successfully via:", result.method);

        res.status(200).json({
            success: true,
            message: "Password reset link has been sent to your email"
        });

    } catch (error) {
        console.error("Forgot password error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to send reset email. Please try again later.",
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

export default forgotPassword;
