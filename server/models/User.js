import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: false,
            unique: true,
            lowercase: true
        },
        password: {
            type: String,
            required: false
        },
        googleIDD: {
            type: String,
            required: false
        },
        facebookIDD: {
            type: String,
            required: false
        },
        role: {
            type: String,
            required: false
        },
        pendingEmail: {
            type: String,
            required: false
        },
        emailVerifyToken: {
            type: String,
            required: false
        },
        status: {
            type: String,
            enum: ['active', 'inactive'],
            default: 'active'
        },
        securitySettings: {
            twoFactor: { type: Boolean, default: false },
            loginNotifications: { type: Boolean, default: true },
            passwordExpiry: { type: Boolean, default: false },
            passwordExpiryMinutes: { type: Number, default: 129600 }, // 90 days in minutes
            sessionTimeout: { type: Boolean, default: true },
            loginHistory: { type: Boolean, default: true }
        },
        passwordChangedAt: {
            type: Date,
            default: Date.now
        }
    },
    {
        timestamps: true
    }
);

const User = mongoose.model("User", userSchema);

export default User;