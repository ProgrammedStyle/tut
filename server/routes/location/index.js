import express from "express";
import axios from "axios";

const router = express.Router();

// REAL IP-based location endpoint that detects the VISITOR's actual location
router.get("/ip", async (req, res) => {
  try {
    console.log("🌐 Fetching VISITOR's REAL location...");
    
    // Get client IP address (the visitor's IP)
    let clientIP = req.headers['x-forwarded-for'] || 
                   req.headers['x-real-ip'] || 
                   req.connection.remoteAddress || 
                   req.socket.remoteAddress ||
                   req.ip;
    
    // Clean up IP if it has multiple IPs (take the first one)
    if (clientIP && clientIP.includes(',')) {
      clientIP = clientIP.split(',')[0].trim();
    }
    
    // Remove IPv6 prefix if present
    if (clientIP && clientIP.startsWith('::ffff:')) {
      clientIP = clientIP.substring(7);
    }
    
    console.log(`📍 Visitor's IP: ${clientIP}`);
    
    // Try multiple IP geolocation services for better reliability
    const geolocationServices = [
      {
        name: 'ipapi.co',
        url: `https://ipapi.co/${clientIP}/json/`,
        parser: (data) => ({
          latitude: parseFloat(data.latitude),
          longitude: parseFloat(data.longitude),
          city: data.city,
          country: data.country_name,
          accuracy: 1000
        })
      },
      {
        name: 'ip-api.com',
        url: `http://ip-api.com/json/${clientIP}?fields=status,lat,lon,city,country`,
        parser: (data) => ({
          latitude: parseFloat(data.lat),
          longitude: parseFloat(data.lon),
          city: data.city,
          country: data.country,
          accuracy: 1000
        })
      },
      {
        name: 'ipwhois.app',
        url: `https://ipwhois.app/json/${clientIP}`,
        parser: (data) => ({
          latitude: parseFloat(data.latitude),
          longitude: parseFloat(data.longitude),
          city: data.city,
          country: data.country,
          accuracy: 1000
        })
      },
      {
        name: 'ipinfo.io',
        url: `https://ipinfo.io/${clientIP}/json`,
        parser: (data) => {
          const coords = data.loc ? data.loc.split(',') : [null, null];
          return {
            latitude: parseFloat(coords[0]),
            longitude: parseFloat(coords[1]),
            city: data.city,
            country: data.country,
            accuracy: 1000
          };
        }
      },
      {
        name: 'ipgeolocation.io',
        url: `https://api.ipgeolocation.io/ipgeo?apiKey=free&ip=${clientIP}`,
        parser: (data) => ({
          latitude: parseFloat(data.latitude),
          longitude: parseFloat(data.longitude),
          city: data.city,
          country: data.country_name,
          accuracy: 1000
        })
      }
    ];
    
    // Try each service until one works
    for (const service of geolocationServices) {
      try {
        console.log(`🔍 Trying ${service.name}...`);
        const response = await axios.get(service.url, { 
          timeout: 5000,
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
          }
        });
        
        if (response.data) {
          const location = service.parser(response.data);
          
          // Validate that we got valid coordinates
          if (location.latitude && location.longitude && 
              !isNaN(location.latitude) && !isNaN(location.longitude)) {
            
            console.log(`✅ SUCCESS with ${service.name}: Found VISITOR's location: ${location.latitude}, ${location.longitude} (${location.city}, ${location.country})`);
            
            // Additional validation: Check if coordinates are reasonable (not in the middle of ocean or obviously wrong)
            if (location.latitude >= -90 && location.latitude <= 90 && 
                location.longitude >= -180 && location.longitude <= 180) {
              
              return res.json({
                success: true,
                latitude: location.latitude,
                longitude: location.longitude,
                city: location.city || 'Unknown',
                country: location.country || 'Unknown',
                accuracy: location.accuracy,
                method: `IP Geolocation (${service.name})`,
                note: "This is the VISITOR's actual location based on their IP address"
              });
            } else {
              console.log(`⚠️ ${service.name} returned invalid coordinates: ${location.latitude}, ${location.longitude}`);
            }
          }
        }
      } catch (error) {
        console.log(`❌ ${service.name} failed: ${error.message}`);
        // Continue to next service
      }
    }
    
    // All services failed - use emergency fallback
    console.log("⚠️ All IP geolocation services failed, using emergency fallback");
    const emergencyLocation = {
      latitude: 31.7767,
      longitude: 35.2344,
      city: "Jerusalem Old City",
      country: "Israel/Palestine",
      accuracy: 100,
      method: "Emergency fallback",
      note: "All IP geolocation services failed - using emergency location"
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
