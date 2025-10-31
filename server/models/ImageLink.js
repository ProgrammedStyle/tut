import mongoose from 'mongoose';

const imageLinkSchema = new mongoose.Schema({
    imageId: {
        type: Number,
        required: true,
        min: 1,
        max: 10,
        unique: false  // Allow multiple entries per image (one per language)
    },
    language: {
        type: String,
        required: true,
        enum: ['sa', 'de', 'gb', 'it', 'es', 'pk', 'tr', 'id', 'ru', 'in', 'cn', 'my'],  // All supported languages from header
        default: 'gb'
    },
    link: {
        type: String,
        default: null,  // null means no link (image not clickable)
        trim: true
    },
    titleText: {
        type: String,
        default: null,  // null means use default from routes array
        trim: true
    },
    subtitleText: {
        type: String,
        default: null,  // null means use default from routes array
        trim: true
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

// Compound index to ensure one entry per image per language
imageLinkSchema.index({ imageId: 1, language: 1 }, { unique: true });

const ImageLink = mongoose.model('ImageLink', imageLinkSchema);

export default ImageLink;

