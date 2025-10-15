import express from 'express';
import submitContactForm from '../controllers/contact/submit.js';

const router = express.Router();

// POST /api/contact - Submit contact form
router.post('/', submitContactForm);

export default router;

