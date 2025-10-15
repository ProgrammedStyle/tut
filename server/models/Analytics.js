import mongoose from "mongoose";

const analyticsSchema = new mongoose.Schema(
    {
        pageView: {
            path: {
                type: String,
                required: true
            },
            userAgent: String,
            ip: String,
            referrer: String
        },
        sessionId: {
            type: String,
            required: true
        },
        timestamp: {
            type: Date,
            default: Date.now
        }
    },
    {
        timestamps: true
    }
);

const Analytics = mongoose.model("Analytics", analyticsSchema);

export default Analytics;
