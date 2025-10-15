import mongoose from "mongoose";

const pageViewSchema = new mongoose.Schema(
    {
        page: {
            type: String,
            required: true
        },
        sessionId: {
            type: String,
            required: true
        },
        ipAddress: {
            type: String,
            required: false
        },
        userAgent: {
            type: String,
            required: false
        },
        referrer: {
            type: String,
            required: false
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

// Index for faster queries
pageViewSchema.index({ sessionId: 1 });
pageViewSchema.index({ timestamp: -1 });
pageViewSchema.index({ page: 1 });

const PageView = mongoose.model("PageView", pageViewSchema);

export default PageView;

