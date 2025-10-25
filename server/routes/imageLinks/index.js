import express from 'express';
import getAllImageLinks from '../../controllers/imageLinks/getAll.js';
import updateImageLink from '../../controllers/imageLinks/update.js';
import deleteImageLink from '../../controllers/imageLinks/delete.js';
import authenticateUser from '../../middleware/auth.js';
import requireAdmin from '../../middleware/requireAdmin.js';

const router = express.Router();

// Public route - get all image links (filtered by language if provided)
router.get('/', getAllImageLinks);

// Admin-only routes - require admin role
router.put('/', requireAdmin, updateImageLink);
router.delete('/', requireAdmin, deleteImageLink);

export default router;

