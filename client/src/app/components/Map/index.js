"use client";
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { useEffect, useState, useRef, useCallback } from 'react';
import { Box, CircularProgress, Typography, Alert, Chip, Button } from '@mui/material';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default markers in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const Map = () => {
  const [position, setPosition] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [locationInfo, setLocationInfo] = useState(null);
  const [lastUpdateTime, setLastUpdateTime] = useState(null);
  const [isTracking, setIsTracking] = useState(true);
  const [isForcingLocation, setIsForcingLocation] = useState(false);
  
  // Refs for tracking
  const updateIntervalRef = useRef(null);
  const bestAccuracyRef = useRef(Infinity); // Track the best accuracy we've achieved
  const hasGoodLocationRef = useRef(false); // Track if we have a good location

  // Check GPS permission status
  const checkGPSPermission = useCallback(async () => {
    if (!navigator.permissions) {
      console.log("⚠️ Permissions API not supported, will request GPS directly");
      return "unknown";
    }
    
    try {
      const permission = await navigator.permissions.query({ name: 'geolocation' });
      console.log("🔐 GPS Permission Status:", permission.state);
      
      if (permission.state === "denied") {
        console.log("🚨 GPS permission is DENIED by user!");
        setError("🚨 GPS permission is DENIED. Please allow location access in your browser settings!");
        setLoading(false);
        return "denied";
      } else if (permission.state === "granted") {
        console.log("✅ GPS permission is GRANTED!");
        return "granted";
      } else {
        console.log("⚠️ GPS permission is PROMPT (will ask user)");
        return "prompt";
      }
    } catch (error) {
      console.log("⚠️ Could not check GPS permission:", error);
      return "unknown";
    }
  }, []);

  // Get visitor's REAL physical location using browser GPS
  const getVisitorLocation = useCallback(async () => {
    console.log("🌍 Getting VISITOR's REAL physical location using GPS...");
    console.log("🚨 GPS-ONLY MODE: No IP fallbacks, only real GPS!");
    
    if (!navigator.geolocation) {
      console.error("❌ Geolocation is not supported by this browser");
      setError("Geolocation is not supported by your browser");
      setLoading(false);
      return;
    }

    // Check GPS permission first
    const permissionStatus = await checkGPSPermission();
    if (permissionStatus === "denied") {
      return; // Error already set in checkGPSPermission
    }
    
    // Force GPS permission request
    console.log("🔐 Requesting GPS permission...");
    
    // First try getCurrentPosition for immediate location
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const newPosition = [position.coords.latitude, position.coords.longitude];
        const accuracy = position.coords.accuracy;
        
        console.log(`🎯 GPS SUCCESS! Real coordinates: ${newPosition[0].toFixed(6)}, ${newPosition[1].toFixed(6)} (±${Math.round(accuracy)}m)`);
        console.log(`📍 This is YOUR REAL physical location!`);
        
        // Track this as a good location if accuracy is reasonable
        if (accuracy < 1000) {
          hasGoodLocationRef.current = true;
          bestAccuracyRef.current = Math.min(bestAccuracyRef.current, accuracy);
          console.log(`🔒 LOCKED to good location (best accuracy: ±${Math.round(bestAccuracyRef.current)}m)`);
        }
        
        setPosition(newPosition);
        
        setLocationInfo({
          latitude: newPosition[0],
          longitude: newPosition[1],
          city: 'Your Real GPS Location',
          country: 'Current Device Location',
          accuracy: accuracy,
          method: `REAL GPS Location (±${Math.round(accuracy)}m accuracy)`,
          note: 'This is your actual physical location from GPS'
        });
        
        setLastUpdateTime(new Date().toLocaleTimeString());
        setLoading(false);
        setError(null);
        
        console.log(`✅ REAL GPS location updated at ${new Date().toLocaleTimeString()}`);
      },
      (error) => {
        // Handle empty error objects gracefully
        if (!error || Object.keys(error).length === 0) {
          console.log("⚠️ GPS getCurrentPosition received empty error object - ignoring");
          console.log("🚨 NO FALLBACK - We keep your real GPS location!");
          return; // Exit early, don't log empty errors
        }
        
        console.error("❌ GPS FAILED:", error);
        console.error("❌ GPS Error Code:", error?.code || "Unknown");
        console.error("❌ GPS Error Message:", error?.message || "Unknown error");
        
        // Handle empty error objects or missing error properties
        const errorCode = error?.code || 0;
        const errorMessage = error?.message || "Unknown GPS error";
        
        let userErrorMessage = "GPS location failed. ";
        
        switch(errorCode) {
          case 1: // PERMISSION_DENIED
            userErrorMessage += "🚨 Please ALLOW location access in your browser! Click the location icon in the address bar.";
            break;
          case 2: // POSITION_UNAVAILABLE
            userErrorMessage += "GPS signal not available. Try going outside or near a window.";
            break;
          case 3: // TIMEOUT
            userErrorMessage += "GPS timeout. Try again or go outside for better signal.";
            break;
          default:
            if (errorMessage.includes("timeout") || errorMessage.includes("Timeout")) {
              userErrorMessage += "GPS timeout. Try going outside or wait longer.";
            } else if (errorMessage.includes("denied") || errorMessage.includes("Denied")) {
              userErrorMessage += "🚨 Please ALLOW location access in your browser!";
            } else {
              userErrorMessage += `GPS error: ${errorMessage}`;
            }
        }
        
        console.log("🚨 GPS Error Details:", {
          code: errorCode,
          message: errorMessage,
          fullError: error
        });
        
        setError(userErrorMessage);
        setLoading(false);
        console.log("🚨 NO GPS = NO LOCATION! We need GPS to work!");
      },
      {
        enableHighAccuracy: true,  // Force high accuracy GPS for real location
        timeout: 30000,            // 30 second timeout
        maximumAge: 0              // Force fresh GPS reading - no cache
      }
    );
    
    // Use watchPosition for continuous real-time tracking
    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const newPosition = [position.coords.latitude, position.coords.longitude];
        const accuracy = position.coords.accuracy;
        
        console.log(`📍 GPS UPDATE: ${newPosition[0].toFixed(6)}, ${newPosition[1].toFixed(6)} (±${Math.round(accuracy)}m)`);
        console.log(`🎯 This is YOUR REAL GPS location update!`);
        
        // ANTI-OVERWRITE PROTECTION: Only accept this position if it's better or we don't have a good one yet
        if (hasGoodLocationRef.current && accuracy > bestAccuracyRef.current * 2) {
          console.log(`🛡️ REJECTING poor GPS update (${Math.round(accuracy)}m) - keeping better location (${Math.round(bestAccuracyRef.current)}m)`);
          console.log(`🔒 STAYING LOCKED to your accurate location!`);
          return; // Don't update with worse location
        }
        
        // Accept GPS location even with poor accuracy (up to 2000m) to prevent timeouts
        if (accuracy < 2000) {
          // Track if this is a good location
          if (accuracy < 1000) {
            hasGoodLocationRef.current = true;
            bestAccuracyRef.current = Math.min(bestAccuracyRef.current, accuracy);
            console.log(`🔒 UPDATED lock to better location (best accuracy: ±${Math.round(bestAccuracyRef.current)}m)`);
          }
          
          setPosition(newPosition);
          
          setLocationInfo({
            latitude: newPosition[0],
            longitude: newPosition[1],
            city: 'Your Real GPS Location',
            country: 'Current Device Location',
            accuracy: accuracy,
            method: `REAL GPS Location (±${Math.round(accuracy)}m accuracy)`,
            note: 'Real-time GPS tracking - updates automatically when you move'
          });
          
          setLastUpdateTime(new Date().toLocaleTimeString());
          setLoading(false);
          setError(null);
          
          console.log(`✅ GPS location updated at ${new Date().toLocaleTimeString()}`);
        } else {
          console.log(`⚠️ GPS accuracy very poor (${Math.round(accuracy)}m), but accepting anyway to prevent timeout`);
          // Only accept poor accuracy if we don't have a good location yet
          if (!hasGoodLocationRef.current) {
            setPosition(newPosition);
            setLocationInfo({
              latitude: newPosition[0],
              longitude: newPosition[1],
              city: 'GPS Location (Low Accuracy)',
              country: 'Current Device Location',
              accuracy: accuracy,
              method: `GPS Location (±${Math.round(accuracy)}m accuracy)`,
              note: 'GPS signal weak - location may not be precise'
            });
            setLastUpdateTime(new Date().toLocaleTimeString());
            setLoading(false);
            setError(null);
          } else {
            console.log(`🛡️ REJECTING very poor GPS update - keeping your good location!`);
          }
        }
      },
      (error) => {
        // Handle empty error objects gracefully
        if (!error || Object.keys(error).length === 0) {
          console.log("⚠️ GPS WatchPosition received empty error object - ignoring");
          console.log("🚨 NO FALLBACK - We keep your real GPS location!");
          return; // Exit early, don't log empty errors
        }
        
        console.error("❌ GPS WatchPosition Error:", error);
        console.error("❌ GPS Error Code:", error?.code || "Unknown");
        console.error("❌ GPS Error Message:", error?.message || "Unknown error");
        
        // Handle empty error objects or missing error properties
        const errorCode = error?.code || 0;
        const errorMessage = error?.message || "Unknown GPS error";
        
        console.log("🚨 GPS WatchPosition Error Details:", {
          code: errorCode,
          message: errorMessage,
          fullError: error
        });
        
        // IMPORTANT: Don't change position or show error if we already have a good location
        console.log("⚠️ GPS watchPosition failed, but keeping current GPS location");
        console.log("🚨 NO FALLBACK - We keep your real GPS location!");
        
        // Don't set error or change position - keep what we have
        // This prevents the map from switching to wrong locations
      },
      {
        enableHighAccuracy: true,  // Force high accuracy GPS for real location
        timeout: 30000,            // 30 second timeout
        maximumAge: 0              // Force fresh GPS reading - no cache
      }
    );
    
    // Return the watchId so we can clear it later
    return watchId;
  }, [checkGPSPermission]);

  // Force fresh location detection
  const forceFreshLocation = useCallback(async () => {
    console.log("🔄 FORCING FRESH GPS LOCATION - Balanced accuracy for reliability!");
    setIsForcingLocation(true);
    setError(null);
    
    // IMPORTANT: Don't clear the current position or reset the lock
    // This prevents losing the good location if fresh reading fails
    console.log("⚠️ Keeping current location as backup during fresh detection");
    
    // Save current location as backup
    const currentPosition = position;
    const currentLocationInfo = locationInfo;
    const currentBestAccuracy = bestAccuracyRef.current;
    const hadGoodLocation = hasGoodLocationRef.current;
    
    // Force immediate fresh GPS reading
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (gpsPosition) => {
          const newPosition = [gpsPosition.coords.latitude, gpsPosition.coords.longitude];
          const accuracy = gpsPosition.coords.accuracy;
          
          console.log(`🎯 FRESH GPS SUCCESS! Real coordinates: ${newPosition[0].toFixed(6)}, ${newPosition[1].toFixed(6)} (±${Math.round(accuracy)}m)`);
          console.log(`📍 This is YOUR REAL physical location - FRESH reading!`);
          
          // Only update if this reading is good enough
          if (accuracy < 2000) {
            // Lock to this fresh location if it's good
            if (accuracy < 1000) {
              hasGoodLocationRef.current = true;
              bestAccuracyRef.current = Math.min(bestAccuracyRef.current, accuracy);
              console.log(`🔒 LOCKED to fresh location (best accuracy: ±${Math.round(bestAccuracyRef.current)}m)`);
            }
            
            setPosition(newPosition);
            setLocationInfo({
              latitude: newPosition[0],
              longitude: newPosition[1],
              city: 'Your Real GPS Location',
              country: 'Current Device Location',
              accuracy: accuracy,
              method: `FRESH GPS Location (±${Math.round(accuracy)}m accuracy)`,
              note: 'This is your actual physical location from fresh GPS reading'
            });
            setLastUpdateTime(new Date().toLocaleTimeString());
            setLoading(false);
            setError(null);
            
            console.log(`✅ FRESH GPS location updated at ${new Date().toLocaleTimeString()}`);
          } else {
            console.log(`⚠️ Fresh GPS accuracy too poor (${Math.round(accuracy)}m), keeping current location`);
            setError(`Fresh GPS accuracy poor (±${Math.round(accuracy)}m). Try going outside.`);
          }
          
          setIsForcingLocation(false);
        },
        (error) => {
          // Handle empty error objects gracefully
          if (!error || Object.keys(error).length === 0) {
            console.log("⚠️ FRESH GPS received empty error object - keeping current location");
            setIsForcingLocation(false);
            return; // Exit early, keep current location
          }
          
          console.error("❌ FRESH GPS FAILED:", error);
          console.log("🛡️ KEEPING current location - not clearing due to failure");
          
          // Don't clear position - keep what we have
          setError(`Fresh GPS failed: ${error.message || "Unknown error"}. Keeping current location.`);
          setIsForcingLocation(false);
          
          // Restore previous lock state if we had a good location
          if (hadGoodLocation) {
            hasGoodLocationRef.current = true;
            bestAccuracyRef.current = currentBestAccuracy;
            console.log(`🔒 Restored location lock (±${Math.round(currentBestAccuracy)}m)`);
          }
        },
        {
          enableHighAccuracy: false,  // Use balanced mode for reliability
          timeout: 20000,             // 20 second timeout (more reasonable)
          maximumAge: 0               // Force fresh reading
        }
      );
    }
  }, [position, locationInfo]);

  // Start continuous location tracking
  const startLocationTracking = useCallback(() => {
    console.log("🌍 Starting REAL-TIME GPS location tracking...");
    setIsTracking(true);
    
    // Start GPS tracking (watchPosition will continuously update)
    const watchId = getVisitorLocation();
    
    // Store watchId in ref for cleanup
    updateIntervalRef.current = watchId;
  }, [getVisitorLocation]);

  // Stop location tracking
  const stopLocationTracking = useCallback(() => {
    if (updateIntervalRef.current) {
      navigator.geolocation.clearWatch(updateIntervalRef.current);
      updateIntervalRef.current = null;
    }
    setIsTracking(false);
    console.log("⏸️ GPS location tracking stopped");
  }, []);

  // Manual location refresh
  const refreshLocation = useCallback(async () => {
    setLoading(true);
    setError(null);
    console.log("🔄 Manual GPS location refresh...");
    
    // Stop current tracking
    stopLocationTracking();
    
    // Start new tracking
    setTimeout(() => {
      startLocationTracking();
    }, 100);
  }, [startLocationTracking, stopLocationTracking]);

  // Initial location detection
  useEffect(() => {
    console.log("🗺️ Initializing VISITOR location tracking...");
    console.log("🔄 FORCE REFRESH - GPS Map v3.0 loaded!");
    console.log("🎯 GPS-ONLY MODE: Will show YOUR real location or nothing!");
    console.log("🚨 ANTI-FALLBACK: Once GPS works, it stays locked to YOUR location!");
    console.log("🔧 IMPROVED ERROR HANDLING: Better GPS permission and error detection!");
    console.log("⚡ TIMEOUT FIX: More lenient GPS settings to prevent timeouts!");
    console.log("🛡️ EMPTY ERROR FIX: Gracefully handle empty GPS error objects!");
    console.log("🔄 FRESH LOCATION: Force fresh GPS readings with balanced accuracy!");
    console.log("🛡️ FRESH GPS ERROR FIX: Handle empty error objects in Force Fresh Location!");
    console.log("🔒 ANTI-OVERWRITE PROTECTION: Reject poor GPS updates that would overwrite good locations!");
    console.log("🛡️ SAFE FRESH LOCATION: Force Fresh Location won't break your current good location!");
    startLocationTracking();
    
    // Cleanup
    return () => {
      stopLocationTracking();
    };
  }, [startLocationTracking, stopLocationTracking]);

  // Component to center map on position
  const MapCenter = ({ position }) => {
    const map = useMap();
    
    useEffect(() => {
      if (position && position[0] && position[1]) {
        console.log("🎯 Centering map on VISITOR location:", position);
        map.setView(position, 13);
      }
    }, [position, map]);
    
    return null;
  };

  // Custom marker icon
  const createPulseIcon = () => {
    return L.divIcon({
      className: 'pulse-marker',
      html: `<div style="
        background-color: #ff4444;
        width: 30px;
        height: 30px;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 0 0 4px rgba(255,68,68,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: bold;
        font-size: 14px;
        animation: pulse 2s infinite;
      ">📍</div>
      <style>
        @keyframes pulse {
          0% { box-shadow: 0 0 0 0 rgba(255,68,68,0.7); }
          70% { box-shadow: 0 0 0 10px rgba(255,68,68,0); }
          100% { box-shadow: 0 0 0 0 rgba(255,68,68,0); }
        }
      </style>`,
      iconSize: [30, 30],
      iconAnchor: [15, 15]
    });
  };

  // Toggle tracking
  const toggleTracking = () => {
    if (isTracking) {
      stopLocationTracking();
    } else {
      startLocationTracking();
    }
  };

  if (loading && !position) {
  return (
      <Box 
        style={{ 
          height: "500px", 
          width: "100%", 
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          borderRadius: "16px",
          backgroundColor: "#f5f5f5"
        }}
      >
        <Box textAlign="center">
          <CircularProgress size={60} />
          <Typography variant="h6" style={{ marginTop: 16, color: "#666" }}>
            Getting YOUR real GPS location... (v3.0 - {new Date().toLocaleTimeString()})
          </Typography>
          <Typography variant="body2" style={{ marginTop: 8, color: "#999" }}>
            🚨 IMPORTANT: Click &quot;Allow&quot; when browser asks for location permission!
          </Typography>
          <Typography variant="body2" style={{ marginTop: 8, color: "#999" }}>
            If GPS fails, check browser location settings or try going outside
          </Typography>
          <Typography variant="body2" style={{ marginTop: 8, color: "#999" }}>
            GPS may show approximate location (±1600m) - this is normal indoors
          </Typography>
          <Typography variant="body2" style={{ marginTop: 8, color: "#999" }}>
            This will show YOUR real physical location, not IP location
          </Typography>
          <Typography variant="body2" style={{ marginTop: 8, color: "#999" }}>
            Your exact location will update automatically as you move
          </Typography>
          <Box style={{ marginTop: 16, display: "flex", gap: 8, justifyContent: "center" }}>
            <Button 
              onClick={refreshLocation} 
              variant="outlined" 
              disabled={loading}
            >
              Try Again
            </Button>
            <Button 
              onClick={forceFreshLocation} 
              variant="contained" 
              color="primary"
              disabled={loading || isForcingLocation}
            >
              {isForcingLocation ? "Getting Fresh Location..." : "Force Fresh Location"}
            </Button>
            <Button 
              onClick={checkGPSPermission} 
              variant="outlined" 
              color="secondary"
              disabled={loading}
            >
              Check Permission
            </Button>
          </Box>
        </Box>
      </Box>
    );
  }

  return (
    <Box style={{ height: "500px", width: "100%", position: "relative", borderRadius: "16px", overflow: "hidden" }}>
      {/* Status indicators */}
             <Box style={{ position: "absolute", top: 10, left: 10, zIndex: 1000, display: "flex", gap: 8, flexWrap: "wrap" }}>
               <Chip 
                 label={isTracking ? "🔄 Live GPS Tracking" : "⏸️ GPS Paused"} 
                 color={isTracking ? "success" : "default"}
                 size="small"
                 onClick={toggleTracking}
                 style={{ cursor: "pointer" }}
               />
               {position && (
                 <Chip 
                   label="🎯 Locked to YOUR location" 
                   color="primary"
                   size="small"
                 />
               )}
               {lastUpdateTime && (
                 <Chip 
                   label={`Updated: ${lastUpdateTime}`} 
                   variant="outlined"
                   size="small"
                 />
               )}
             </Box>

      {/* Control Panel */}
      <Box 
        style={{
          position: "absolute",
          top: 10,
          left: 10,
          zIndex: 1000,
          display: "flex",
          gap: 8,
          backgroundColor: "rgba(255, 255, 255, 0.95)",
          padding: "8px 12px",
          borderRadius: "8px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          backdropFilter: "blur(10px)"
        }}
      >
        <Button 
          onClick={forceFreshLocation} 
          variant="contained" 
          color="primary"
          size="small"
          disabled={loading || isForcingLocation}
        >
          {isForcingLocation ? "Getting Fresh..." : "🔄 Force Fresh Location"}
        </Button>
        <Button 
          onClick={refreshLocation} 
          variant="outlined" 
          size="small"
          disabled={loading}
        >
          Try Again
        </Button>
      </Box>

      {error && (
        <Alert 
          severity="warning" 
          style={{ position: "absolute", top: 10, right: 10, zIndex: 1000, maxWidth: "300px" }}
          action={
            <Button color="inherit" size="small" onClick={refreshLocation}>
              Retry
            </Button>
          }
        >
          {error}
        </Alert>
      )}
      
      <MapContainer 
        center={position || [0, 0]}
        zoom={position ? 13 : 2}
        style={{ height: "100%", width: "100%" }}
        zoomControl={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</aStyled contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {position && <MapCenter position={position} />}
        
        {position && (
          <Marker 
            position={position} 
            icon={createPulseIcon()}
          >
          <Popup>
              <div style={{ textAlign: "center", padding: "8px", minWidth: "200px" }}>
                <Typography variant="h6" style={{ margin: "0 0 8px 0", color: "#333" }}>
                  📍 Your Real GPS Location
                </Typography>
                {locationInfo && (
                  <>
                    <Typography variant="body2" style={{ margin: "4px 0", color: "#666" }}>
                      🏙️ {locationInfo.city}, {locationInfo.country}
                    </Typography>
                    <Typography variant="body2" style={{ margin: "4px 0", color: "#666" }}>
                      📍 {locationInfo.latitude.toFixed(6)}, {locationInfo.longitude.toFixed(6)}
                    </Typography>
                    <Typography variant="caption" style={{ color: "#888", display: "block" }}>
                      📡 {locationInfo.method}
                    </Typography>
                    <Typography variant="caption" style={{ color: "#888", display: "block" }}>
                      🕒 Last updated: {lastUpdateTime}
                    </Typography>
                    <Typography variant="caption" style={{ color: "#888", display: "block", marginTop: "4px" }}>
                      💡 GPS updates automatically as you move
                    </Typography>
                  </>
                )}
            </div>
          </Popup>
        </Marker>
        )}
      </MapContainer>
      
      {/* Location info overlay */}
      {locationInfo && (
        <Box 
          style={{
            position: "absolute",
            bottom: 10,
            left: 10,
            backgroundColor: "rgba(255, 255, 255, 0.95)",
            padding: "12px 16px",
            borderRadius: "12px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            backdropFilter: "blur(10px)",
            maxWidth: "300px"
          }}
        >
          <Typography variant="h6" style={{ fontWeight: "bold", color: "#333", margin: "0 0 4px 0" }}>
            📍 Your Real GPS Location
          </Typography>
          <Typography variant="body2" style={{ color: "#666", margin: "0 0 4px 0" }}>
            🏙️ {locationInfo.city}, {locationInfo.country}
          </Typography>
          <Typography variant="body2" style={{ color: "#666", margin: "0 0 4px 0" }}>
            📍 {locationInfo.latitude.toFixed(6)}, {locationInfo.longitude.toFixed(6)}
          </Typography>
          <Typography variant="body2" style={{ color: "#666", margin: "0 0 4px 0" }}>
            📡 {locationInfo.method}
          </Typography>
          <Typography variant="caption" style={{ color: "#888" }}>
            🕒 Updated: {lastUpdateTime}
          </Typography>
          <Typography variant="caption" style={{ color: "#888", display: "block", marginTop: "4px" }}>
            💡 GPS updates automatically as you move
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default Map;