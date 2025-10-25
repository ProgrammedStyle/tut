import express from "express";
import getAnalyticsData from "../../controllers/analytics/getData.js";
import trackPageView from "../../controllers/analytics/track.js";
import authenticateUser from "../../middleware/auth.js";
import requireAdmin from "../../middleware/requireAdmin.js";

const router = express.Router();

// Track page views (public - anyone can track)
router.post("/track", trackPageView);

// Get analytics data (admin only)
router.get("/data", requireAdmin, getAnalyticsData);

export default router;
