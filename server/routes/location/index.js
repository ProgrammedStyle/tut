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
    
    // For localhost testing, return a test location
    if (clientIP === '::1' || clientIP === '127.0.0.1' || clientIP === 'localhost') {
      console.log("🏠 Localhost detected, returning test location");
      return res.json({
        success: true,
        latitude: 32.0853,
        longitude: 34.7818,
        city: "Tel Aviv",
        country: "Israel",
        accuracy: 100,
        method: "Localhost Test Location",
        note: "This is a test location for localhost development"
      });
    }
    
    // Try a simple, reliable IP geolocation service with better error handling
    try {
      console.log("🔍 Trying ipapi.co with improved error handling...");
      const response = await axios.get(`https://ipapi.co/${clientIP}/json/`, { 
        timeout: 8000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
      });
      
      if (response.data && response.data.latitude && response.data.longitude) {
        const location = {
          latitude: parseFloat(response.data.latitude),
          longitude: parseFloat(response.data.longitude),
          city: response.data.city || 'Unknown',
          country: response.data.country_name || 'Unknown',
          accuracy: 1000
        };
        
        console.log(`✅ SUCCESS: Found VISITOR's location: ${location.latitude}, ${location.longitude} (${location.city}, ${location.country})`);
        
        return res.json({
          success: true,
          latitude: location.latitude,
          longitude: location.longitude,
          city: location.city,
          country: location.country,
          accuracy: location.accuracy,
          method: "IP Geolocation (ipapi.co)",
          note: "This is the VISITOR's actual location based on their IP address"
        });
      }
    } catch (error) {
      console.log(`❌ ipapi.co failed: ${error.message}`);
      
      // If rate limited, wait and try a different approach
      if (error.response && error.response.status === 429) {
        console.log("⏳ Rate limited, trying backup service...");
        
        try {
          // Try ip-api.com as backup
          const backupResponse = await axios.get(`http://ip-api.com/json/${clientIP}?fields=status,lat,lon,city,country`, { 
            timeout: 8000,
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
          });
          
          if (backupResponse.data && backupResponse.data.status === 'success') {
            const location = {
              latitude: parseFloat(backupResponse.data.lat),
              longitude: parseFloat(backupResponse.data.lon),
              city: backupResponse.data.city || 'Unknown',
              country: backupResponse.data.country || 'Unknown',
              accuracy: 1000
            };
            
            console.log(`✅ BACKUP SUCCESS: Found VISITOR's location: ${location.latitude}, ${location.longitude} (${location.city}, ${location.country})`);
            
            return res.json({
              success: true,
              latitude: location.latitude,
              longitude: location.longitude,
              city: location.city,
              country: location.country,
              accuracy: location.accuracy,
              method: "IP Geolocation (ip-api.com backup)",
              note: "This is the VISITOR's actual location based on their IP address"
            });
          }
        } catch (backupError) {
          console.log(`❌ Backup service also failed: ${backupError.message}`);
        }
      }
    }
    
    // All services failed - use a smart fallback based on common visitor locations
    console.log("⚠️ All IP geolocation services failed, using smart fallback");
    
    // Try to determine a reasonable fallback based on timezone or other headers
    const timezone = req.headers['x-timezone'] || 'UTC';
    let fallbackLocation;
    
    if (timezone.includes('Asia') || timezone.includes('Jerusalem') || timezone.includes('Tel_Aviv')) {
      fallbackLocation = {
        latitude: 32.0853,
        longitude: 34.7818,
        city: "Tel Aviv",
        country: "Israel",
        accuracy: 1000,
        method: "Smart Fallback (Asia/Israel)",
        note: "IP services failed - using regional fallback"
      };
    } else if (timezone.includes('Europe')) {
      fallbackLocation = {
        latitude: 51.5074,
        longitude: -0.1278,
        city: "London",
        country: "United Kingdom",
        accuracy: 1000,
        method: "Smart Fallback (Europe)",
        note: "IP services failed - using regional fallback"
      };
    } else if (timezone.includes('America')) {
      fallbackLocation = {
        latitude: 40.7128,
        longitude: -74.0060,
        city: "New York",
        country: "United States",
        accuracy: 1000,
        method: "Smart Fallback (America)",
        note: "IP services failed - using regional fallback"
      };
    } else {
      fallbackLocation = {
        latitude: 0.0,
        longitude: 0.0,
        city: "Unknown",
        country: "Unknown",
        accuracy: 1000,
        method: "Default Fallback",
        note: "IP services failed - using default fallback"
      };
    }
    
    res.json({
      success: true,
      latitude: fallbackLocation.latitude,
      longitude: fallbackLocation.longitude,
      city: fallbackLocation.city,
      country: fallbackLocation.country,
      accuracy: fallbackLocation.accuracy,
      method: fallbackLocation.method,
      note: fallbackLocation.note
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
