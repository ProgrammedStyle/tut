import express from "express";
import getTranslations from "../../controllers/translations/get.js";
import updateTranslations from "../../controllers/translations/update.js";
import getAllTranslations from "../../controllers/translations/getAll.js";

const router = express.Router();

// Get all translations (all languages)
router.get("/", getAllTranslations);

// Get translations for a specific language
router.get("/:languageCode", getTranslations);

// Update translations for a specific language
router.put("/:languageCode", updateTranslations);

export default router;

