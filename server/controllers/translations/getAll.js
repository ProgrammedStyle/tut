import Translation from "../../models/Translation.js";

const getAllTranslations = async (req, res) => {
    try {
        const translations = await Translation.find({}).select('-__v');

        const translationsMap = {};
        translations.forEach(translation => {
            translationsMap[translation.languageCode] = {
                translations: Object.fromEntries(translation.translations),
                lastUpdated: translation.lastUpdated
            };
        });

        res.status(200).json({ 
            success: true,
            translations: translationsMap,
            count: translations.length
        });

    } catch (error) {
        console.error("Error fetching all translations:", error);
        res.status(500).json({ 
            success: false, 
            message: "Error fetching translations",
            error: error.message
        });
    }
};

export default getAllTranslations;

