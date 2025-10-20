import express from 'express';
import getAllImageLinks from '../../controllers/imageLinks/getAll.js';
import updateImageLink from '../../controllers/imageLinks/update.js';
import deleteImageLink from '../../controllers/imageLinks/delete.js';
import authenticateUser from '../../middleware/auth.js';

const router = express.Router();

// Public route - get all image links (filtered by language if provided)
router.get('/', getAllImageLinks);

// Protected routes - require authentication
router.put('/', authenticateUser, updateImageLink);
router.delete('/', authenticateUser, deleteImageLink);

export default router;

