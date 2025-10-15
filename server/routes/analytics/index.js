import express from "express";
import getAnalyticsData from "../../controllers/analytics/getData.js";
import trackPageView from "../../controllers/analytics/track.js";
import authenticateUser from "../../middleware/auth.js";

const router = express.Router();

// Track page views (public - anyone can track)
router.post("/track", trackPageView);

// Get analytics data (protected route)
router.get("/data", authenticateUser, getAnalyticsData);

export default router;
