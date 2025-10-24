import express from 'express';
import getAllVideoLinks from '../controllers/videoLinks/getAll.js';
import updateVideoLink from '../controllers/videoLinks/update.js';

const router = express.Router();

// GET /api/video-links - Get all video links or for specific language
router.get('/', getAllVideoLinks);

// PUT /api/video-links - Update video link for a language
router.put('/', updateVideoLink);

export default router;
