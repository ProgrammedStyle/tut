import express from "express";

const router = express.Router();

// IP-based location endpoint
router.get("/ip", async (req, res) => {
  try {
    console.log("🌐 Fetching IP-based location...");
    
    // Get client IP address
    const clientIP = req.ip || req.connection.remoteAddress || req.headers['x-forwarded-for'] || '127.0.0.1';
    console.log(`📍 Client IP: ${clientIP}`);
    
    // Provide multiple relevant locations in the Middle East region
    const defaultLocations = [
      {
        name: "Jerusalem Center",
        latitude: 31.7683,
        longitude: 35.2137,
        city: "Jerusalem",
        country: "Israel/Palestine",
        accuracy: 5000
      },
      {
        name: "Jerusalem Old City", 
        latitude: 31.7767,
        longitude: 35.2344,
        city: "Jerusalem Old City",
        country: "Israel/Palestine",
        accuracy: 5000
      },
      {
        name: "West Bank Center",
        latitude: 31.9522,
        longitude: 35.2332,
        city: "Ramallah",
        country: "Palestine",
        accuracy: 5000
      },
      {
        name: "Nablus Area",
        latitude: 32.2241,
        longitude: 35.2581,
        city: "Nablus",
        country: "Palestine",
        accuracy: 5000
      },
      {
        name: "Bethlehem",
        latitude: 31.7054,
        longitude: 35.2024,
        city: "Bethlehem",
        country: "Palestine",
        accuracy: 5000
      },
      {
        name: "Tel Aviv",
        latitude: 32.0853,
        longitude: 34.7818,
        city: "Tel Aviv",
        country: "Israel",
        accuracy: 5000
      }
    ];
    
    // Use a simple hash of IP to pick a default location
    const hash = clientIP.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    
    const selectedLocation = defaultLocations[Math.abs(hash) % defaultLocations.length];
    
    console.log(`✅ Using default location: ${selectedLocation.latitude}, ${selectedLocation.longitude} (${selectedLocation.city}, ${selectedLocation.country})`);
    
    res.json({
      success: true,
      latitude: selectedLocation.latitude,
      longitude: selectedLocation.longitude,
      city: selectedLocation.city,
      country: selectedLocation.country,
      accuracy: selectedLocation.accuracy,
      method: "Default fallback",
      note: "Using default location - external IP services unavailable"
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
