import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../../models/User.js";
import passwordSchema from "../../../modules/userValidation_password.js";

const resetPassword = async (req, res) => {
    try {
        const { token, password, confirmPassword } = req.body;

        console.log("Password reset attempt");

        if (!token) {
            return res.status(400).json({ message: "Reset token is required" });
        }

        // Verify token
        let decoded;
        try {
            decoded = jwt.verify(token, process.env.EMAIL_VERIFY_JWT_SECRET);
            console.log("Token verified for user:", decoded.email);
        } catch (error) {
            console.log("Invalid or expired token");
            return res.status(400).json({ message: "Invalid or expired reset link" });
        }

        // Validate password
        const passwordParsedData = await passwordSchema.safeParseAsync({ 
            password, 
            confirmPassword 
        });

        if (!passwordParsedData.success) {
            console.log("Password validation failed:", passwordParsedData.error.errors);
            return res.status(400).json({ 
                message: passwordParsedData.error.errors[0].message 
            });
        }

        // Find user
        const user = await User.findById(decoded.userId);
        
        if (!user) {
            console.log("User not found:", decoded.userId);
            return res.status(404).json({ message: "User not found" });
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Update password and timestamp
        user.password = hashedPassword;
        user.passwordChangedAt = new Date(); // Update password change timestamp
        await user.save();

        console.log("Password reset successful for user:", user.email);

        res.status(200).json({
            success: true,
            message: "Password has been reset successfully"
        });

    } catch (error) {
        console.error("Reset password error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to reset password. Please try again.",
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

export default resetPassword;
