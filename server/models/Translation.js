import mongoose from "mongoose";

const translationSchema = new mongoose.Schema(
    {
        languageCode: {
            type: String,
            required: true,
            index: true
        },
        translations: {
            type: Map,
            of: String,
            required: true
        },
        lastUpdated: {
            type: Date,
            default: Date.now
        },
        updatedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: false
        }
    },
    {
        timestamps: true
    }
);

// Create a unique index on languageCode to ensure only one document per language
translationSchema.index({ languageCode: 1 }, { unique: true });

const Translation = mongoose.model("Translation", translationSchema);

export default Translation;

