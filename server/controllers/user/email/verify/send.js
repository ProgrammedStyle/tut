import jwt from "jsonwebtoken";
import { sendEmailVerification } from "../../../../services/emailService.js";

const send = async (req, res) => {
    try {
        console.log("Email send request received:", { email: req.body.email });
        
        // Validate email input
        if (!req.body.email) {
            return res.status(400).json({ message: "Email is required" });
        }

        // Check environment variables
        console.log("Environment check:", {
            SMTP_USER: process.env.SMTP_USER ? "Set" : "Not set",
            SMTP_PASS: process.env.SMTP_PASS ? "Set" : "Not set",
            EMAIL_VERIFY_JWT_SECRET: process.env.EMAIL_VERIFY_JWT_SECRET ? "Set" : "Not set",
            CLIENT_URL: process.env.CLIENT_URL || "Not set"
        });

        // Generate JWT token
        const token = jwt.sign({
            email: req.body.email
        }, process.env.EMAIL_VERIFY_JWT_SECRET, { expiresIn: "15m" });

        console.log("Generated verify token:", token.substring(0, 20) + "...");

        // Send email using the new email service
        console.log("Sending email verification...");
        const result = await sendEmailVerification(req.body.email, token);
        
        console.log("Email sent successfully via:", result.method);

        res.status(201).json({
            message: "Check your email and click the link to verify"
        });

    } catch (error) {
        console.error("Email sending error details:", {
            message: error.message,
            code: error.code,
            command: error.command,
            response: error.response,
            stack: error.stack
        });
        
        res.status(500).json({
            message: "Failed to send verification email",
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

export default send;