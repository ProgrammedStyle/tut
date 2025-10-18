import User from "../../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { sendProfileEmailVerification } from "../../../services/emailService.js";

const updateProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const { email, password, currentPassword } = req.body;

        // Get current user
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        const updates = {};

        // Update email if provided
        if (email && email !== user.email) {
            // Check if email is already taken by another user
            const existingUser = await User.findOne({ 
                email, 
                _id: { $ne: userId } 
            });
            
            if (existingUser) {
                return res.status(400).json({
                    success: false,
                    message: "Email is already taken by another user"
                });
            }

            // Generate email verification token
            const emailVerifyToken = jwt.sign(
                { userId, newEmail: email },
                process.env.EMAIL_VERIFY_JWT_SECRET,
                { expiresIn: "15m" }
            );

            // Send verification email to NEW email address
            try {
                console.log('📧 Sending profile email verification to:', email);
                const result = await sendProfileEmailVerification(email, emailVerifyToken);
                console.log('✅ Profile email verification sent via:', result.method);
                
            } catch (err) {
                console.error('❌ Failed to send profile email verification:', err.message);
                return res.status(500).json({
                    success: false,
                    message: "Failed to send verification email. Please try again."
                });
            }

            // Store pending email and token (email NOT changed yet until verified)
            updates.pendingEmail = email;
            updates.emailVerifyToken = emailVerifyToken;
        }

        // Update password if provided
        if (password) {
            console.log('=== PASSWORD UPDATE DEBUG ===');
            console.log('User email:', user.email);
            console.log('User has password?', !!user.password);
            console.log('Current password provided?', !!currentPassword);
            
            // If user has an existing password, they must provide current password
            if (user.password) {
                console.log('User has existing password - requiring current password');
                // User has a password - verify current password is provided
                if (!currentPassword) {
                    return res.status(400).json({
                        success: false,
                        message: "Current password is required to change password"
                    });
                }

                // Verify current password is correct
                const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
                if (!isCurrentPasswordValid) {
                    return res.status(400).json({
                        success: false,
                        message: "Current password is incorrect"
                    });
                }
            }
            // If user doesn't have a password (social login), they can set one without current password

            // Hash new password
            const hashedPassword = await bcrypt.hash(password, 12);
            updates.password = hashedPassword;
            updates.passwordChangedAt = new Date(); // Update password change timestamp
        }

        // Update user
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            updates,
            { new: true, select: '-password -emailVerifyToken' }
        );

        // Check if user now has a password (either had one before or just set one)
        const hasPassword = !!user.password || !!updates.password;

        const responseData = {
            success: true,
            message: email !== user.email 
                ? "Profile updated successfully. Please check your new email for verification link."
                : "Profile updated successfully",
            user: {
                id: updatedUser._id,
                email: updatedUser.email,
                pendingEmail: updatedUser.pendingEmail,
                hasPassword: hasPassword
            }
        };
        
        console.log('=== PROFILE UPDATE RESPONSE ===');
        console.log('Current email (should be old):', updatedUser.email);
        console.log('Pending email (new, unverified):', updatedUser.pendingEmail);
        console.log('Response user object:', responseData.user);
        
        res.status(200).json(responseData);

    } catch (error) {
        console.error('=== PROFILE UPDATE ERROR ===');
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
        res.status(500).json({
            success: false,
            message: "Failed to update profile",
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

const verifyNewEmail = async (req, res) => {
    try {
        const { token } = req.body;

        if (!token) {
            return res.status(400).json({
                success: false,
                message: "Verification token is required"
            });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.EMAIL_VERIFY_JWT_SECRET);
        const { userId, newEmail } = decoded;

        // Update user email
        const user = await User.findByIdAndUpdate(
            userId,
            { 
                email: newEmail,
                $unset: { 
                    pendingEmail: 1,
                    emailVerifyToken: 1 
                }
            },
            { new: true, select: '-password -emailVerifyToken' }
        );

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Email address verified successfully",
            user: {
                id: user._id,
                email: user.email,
                hasPassword: !!user.password
            }
        });

    } catch (error) {
        console.error('Email verification error:', error);
        
        if (error.name === 'TokenExpiredError') {
            return res.status(400).json({
                success: false,
                message: "Verification link has expired. Please request a new one."
            });
        }

        res.status(500).json({
            success: false,
            message: "Failed to verify email address",
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

export { updateProfile, verifyNewEmail };
