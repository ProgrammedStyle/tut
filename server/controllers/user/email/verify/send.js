import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";

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

        // Create transporter
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.SMTP_USER || "programmedstyle@gmail.com",
                pass: process.env.SMTP_PASS || "brao ywhw gzux rhib"
            }
        });

        // Verify transporter connection
        console.log("Verifying transporter connection...");
        await transporter.verify();
        console.log("Transporter verified successfully");

        // Generate JWT token
        const token = jwt.sign({
            email: req.body.email
        }, process.env.EMAIL_VERIFY_JWT_SECRET, { expiresIn: "15m" });

        const verifyURL = `${process.env.CLIENT_URL}/CreateAccount/VerifyEmail/Check/?token=${token}`;
        console.log("Generated verify URL:", verifyURL);

        // Send email
        console.log("Sending email...");
        const info = await transporter.sendMail({
            from: process.env.SMTP_USER || "programmedstyle@gmail.com",
            to: req.body.email,
            subject: "Please verify your email",
            html: `
                <div>
                    <h2>Email Verification</h2>
                    <p>Click <a href="${verifyURL}">here</a> to verify your email</p>
                    <p>This link will expire in 15 minutes.</p>
                </div>
            `
        });

        console.log("Email sent successfully:", info.messageId);

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