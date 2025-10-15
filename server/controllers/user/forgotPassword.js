import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
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

        // Send email
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS
            }
        });

        console.log("Verifying transporter connection...");
        await transporter.verify();
        console.log("Transporter verified successfully");

        console.log("Sending password reset email...");
        const info = await transporter.sendMail({
            from: process.env.SMTP_USER,
            to: email,
            subject: "Password Reset Request",
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px;">
                    <h2 style="color: #2196F3;">Password Reset Request</h2>
                    <p>You requested to reset your password. Click the link below to create a new password:</p>
                    <div style="margin: 30px 0; text-align: center;">
                        <a href="${resetURL}" 
                           style="background-color: #2196F3; color: white; padding: 12px 30px; 
                                  text-decoration: none; border-radius: 5px; display: inline-block;">
                            Reset Password
                        </a>
                    </div>
                    <p style="color: #666; font-size: 14px;">This link will expire in 15 minutes.</p>
                    <p style="color: #666; font-size: 14px;">
                        If you didn't request this, please ignore this email and your password will remain unchanged.
                    </p>
                    <hr style="margin: 20px 0; border: none; border-top: 1px solid #eee;">
                    <p style="color: #999; font-size: 12px;">
                        If the button doesn't work, copy and paste this link into your browser:<br>
                        ${resetURL}
                    </p>
                </div>
            `
        });

        console.log("Password reset email sent successfully:", info.messageId);

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
