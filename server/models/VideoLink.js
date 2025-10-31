import mongoose from 'mongoose';

const videoLinkSchema = new mongoose.Schema({
    language: {
        type: String,
        required: true,
        enum: ['sa', 'de', 'gb', 'it', 'es', 'pk', 'tr', 'id', 'ru', 'in', 'cn', 'my'],  // All supported languages
        default: 'gb'
    },
    videoId: {
        type: String,
        required: true,
        trim: true,
        validate: {
            validator: function(v) {
                // Validate YouTube Video ID format (11 characters)
                return /^[a-zA-Z0-9_-]{11}$/.test(v);
            },
            message: 'Video ID must be exactly 11 characters (YouTube Video ID format)'
        }
    },
    videoUrl: {
        type: String,
        required: false,
        trim: true
    },
    title: {
        type: String,
        required: false,
        trim: true,
        default: 'Jerusalem Virtual Guide Video'
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

// Compound index to ensure one video per language
videoLinkSchema.index({ language: 1 }, { unique: true });

// Generate video URL from video ID
videoLinkSchema.pre('save', function(next) {
    if (this.videoId) {
        this.videoUrl = `https://www.youtube.com/embed/${this.videoId}?mute=0&showinfo=0&controls=0&start=0`;
    }
    next();
});

// Also generate video URL on findOneAndUpdate
videoLinkSchema.pre(['findOneAndUpdate', 'updateOne', 'updateMany'], function(next) {
    const update = this.getUpdate();
    if (update && update.videoId) {
        update.videoUrl = `https://www.youtube.com/embed/${update.videoId}?mute=0&showinfo=0&controls=0&start=0`;
    }
    next();
});

const VideoLink = mongoose.model('VideoLink', videoLinkSchema);

export default VideoLink;
