import express from "express";
import axios from "axios";

const router = express.Router();

// IP-based location endpoint
router.get("/ip", async (req, res) => {
  try {
    console.log("🌐 Fetching IP-based location...");
    
    // Try multiple IP geolocation services for better reliability
    const services = [
      {
        name: "ipapi.co",
        url: "https://ipapi.co/json/",
        parser: (data) => ({
          latitude: data.latitude,
          longitude: data.longitude,
          city: data.city,
          country: data.country_name,
          accuracy: 5000 // IP location typically 1-5km accuracy
        })
      },
      {
        name: "ip-api.com",
        url: "http://ip-api.com/json/",
        parser: (data) => ({
          latitude: data.lat,
          longitude: data.lon,
          city: data.city,
          country: data.country,
          accuracy: 5000
        })
      }
    ];

    let locationData = null;
    let lastError = null;

    // Try each service until one succeeds
    for (const service of services) {
      try {
        console.log(`📍 Trying ${service.name}...`);
        const response = await axios.get(service.url, { timeout: 5000 });
        
        if (response.data && response.data.latitude && response.data.longitude) {
          locationData = service.parser(response.data);
          console.log(`✅ ${service.name} succeeded: ${locationData.latitude}, ${locationData.longitude} (${locationData.city}, ${locationData.country})`);
          break;
        } else {
          console.log(`❌ ${service.name} returned invalid data`);
        }
      } catch (error) {
        console.log(`❌ ${service.name} failed:`, error.message);
        lastError = error;
      }
    }

    if (locationData) {
      res.json({
        success: true,
        latitude: locationData.latitude,
        longitude: locationData.longitude,
        city: locationData.city,
        country: locationData.country,
        accuracy: locationData.accuracy,
        method: "IP-based"
      });
    } else {
      console.log("❌ All IP location services failed");
      res.status(500).json({
        success: false,
        error: "Unable to determine location from IP address",
        details: lastError ? lastError.message : "All services failed"
      });
    }

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
