import express from "express";
import getTranslations from "../../controllers/translations/get.js";
import updateTranslations from "../../controllers/translations/update.js";
import getAllTranslations from "../../controllers/translations/getAll.js";
import requireAdmin from "../../middleware/requireAdmin.js";

const router = express.Router();

// Get all translations (all languages) - public
router.get("/", getAllTranslations);

// Get translations for a specific language - public
router.get("/:languageCode", getTranslations);

// Update translations for a specific language - admin only
router.put("/:languageCode", requireAdmin, updateTranslations);

export default router;

