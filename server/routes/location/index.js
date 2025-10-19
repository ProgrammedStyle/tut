import express from "express";
import axios from "axios";

const router = express.Router();

// REAL IP-based location endpoint that detects YOUR actual location
router.get("/ip", async (req, res) => {
  try {
    console.log("🌐 Fetching YOUR REAL IP-based location...");
    
    // Get client IP address
    const clientIP = req.ip || req.connection.remoteAddress || req.headers['x-forwarded-for'] || '127.0.0.1';
    console.log(`📍 Your IP: ${clientIP}`);
    
    // Try real IP geolocation services to get YOUR actual location
    try {
      console.log("🔍 Getting YOUR real location from IP...");
      const response = await axios.get(`https://ipapi.co/${clientIP}/json/`, { timeout: 5000 });
      
      if (response.data && response.data.latitude && response.data.longitude) {
        const yourRealLocation = {
          latitude: parseFloat(response.data.latitude),
          longitude: parseFloat(response.data.longitude),
          city: response.data.city || 'Unknown',
          country: response.data.country_name || 'Unknown',
          accuracy: 1000,
          method: "Real IP Geolocation",
          note: "This is YOUR actual location based on your IP address"
        };
        
        console.log(`✅ SUCCESS: Found YOUR REAL location: ${yourRealLocation.latitude}, ${yourRealLocation.longitude} (${yourRealLocation.city}, ${yourRealLocation.country})`);
        
        res.json({
          success: true,
          latitude: yourRealLocation.latitude,
          longitude: yourRealLocation.longitude,
          city: yourRealLocation.city,
          country: yourRealLocation.country,
          accuracy: yourRealLocation.accuracy,
          method: yourRealLocation.method,
          note: yourRealLocation.note
        });
        return;
      }
    } catch (ipError) {
      console.log("❌ Real IP geolocation failed:", ipError.message);
    }
    
    // Fallback to emergency location if real IP detection fails
    console.log("⚠️ Real IP detection failed, using emergency fallback");
    const emergencyLocation = {
      latitude: 31.7767,
      longitude: 35.2344,
      city: "Jerusalem Old City",
      country: "Israel/Palestine",
      accuracy: 100,
      method: "Emergency fallback",
      note: "Real IP detection failed - using emergency location"
    };
    
    res.json({
      success: true,
      latitude: emergencyLocation.latitude,
      longitude: emergencyLocation.longitude,
      city: emergencyLocation.city,
      country: emergencyLocation.country,
      accuracy: emergencyLocation.accuracy,
      method: emergencyLocation.method,
      note: emergencyLocation.note
    });

  } catch (error) {
    console.error("❌ IP location endpoint error:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error",
      details: error.message
    });
  }
});

export default router;
