import Translation from "../../models/Translation.js";

const getTranslations = async (req, res) => {
    try {
        const { languageCode } = req.params;

        if (!languageCode) {
            return res.status(400).json({ 
                success: false, 
                message: "Language code is required" 
            });
        }

        const translation = await Translation.findOne({ languageCode });

        if (!translation) {
            return res.status(404).json({ 
                success: false, 
                message: "No translations found for this language",
                translations: {}
            });
        }

        // Convert Map to plain object
        const translationsObject = Object.fromEntries(translation.translations);

        res.status(200).json({ 
            success: true,
            languageCode: translation.languageCode,
            translations: translationsObject,
            lastUpdated: translation.lastUpdated
        });

    } catch (error) {
        console.error("Error fetching translations:", error);
        res.status(500).json({ 
            success: false, 
            message: "Error fetching translations",
            error: error.message
        });
    }
};

export default getTranslations;

