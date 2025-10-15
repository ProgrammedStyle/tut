import Translation from "../../models/Translation.js";

const updateTranslations = async (req, res) => {
    try {
        const { languageCode } = req.params;
        const { translations } = req.body;

        if (!languageCode) {
            return res.status(400).json({ 
                success: false, 
                message: "Language code is required" 
            });
        }

        if (!translations || typeof translations !== 'object') {
            return res.status(400).json({ 
                success: false, 
                message: "Translations object is required" 
            });
        }

        // Check if user is authenticated (optional - you can make this required)
        const userId = req.user?.id || null;

        // Find existing translation or create new one
        let translation = await Translation.findOne({ languageCode });

        if (translation) {
            // Update existing translations
            translation.translations = new Map(Object.entries(translations));
            translation.lastUpdated = new Date();
            if (userId) {
                translation.updatedBy = userId;
            }
            await translation.save();
        } else {
            // Create new translation document
            translation = new Translation({
                languageCode,
                translations: new Map(Object.entries(translations)),
                updatedBy: userId
            });
            await translation.save();
        }

        // Convert Map to plain object for response
        const translationsObject = Object.fromEntries(translation.translations);

        res.status(200).json({ 
            success: true,
            message: "Translations updated successfully",
            languageCode: translation.languageCode,
            translations: translationsObject,
            lastUpdated: translation.lastUpdated
        });

    } catch (error) {
        console.error("Error updating translations:", error);
        res.status(500).json({ 
            success: false, 
            message: "Error updating translations",
            error: error.message
        });
    }
};

export default updateTranslations;

