"use client";

import React, { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, Marker, useMap, Popup } from "react-leaflet";
import L from "leaflet";
import { CircularProgress, Box, Typography, IconButton, Tooltip } from "@mui/material";
import { MyLocation as MyLocationIcon } from "@mui/icons-material";

const createUserIcon = () =>
  L.divIcon({
    className: "user-marker",
    html: `<div style="
      width: 20px; height: 20px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border: 4px solid white;
      border-radius: 50%;
      box-shadow: 0 0 12px rgba(102,126,234,0.8), 0 0 0 0 rgba(102,126,234,0.4);
      animation: pulse 2s infinite;
    "></div>
    <style>
      @keyframes pulse {
        0% { box-shadow: 0 0 12px rgba(102,126,234,0.8), 0 0 0 0 rgba(102,126,234,0.4); }
        50% { box-shadow: 0 0 12px rgba(102,126,234,0.8), 0 0 0 10px rgba(102,126,234,0); }
        100% { box-shadow: 0 0 12px rgba(102,126,234,0.8), 0 0 0 0 rgba(102,126,234,0); }
      }
    </style>`,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
  });

function Recenter({ position }) {
  const map = useMap();
  useEffect(() => {
    if (position) {
      map.setView(position, 16, {
        animate: true,
        duration: 1
      });
    }
  }, [position, map]);
  return null;
}

export default function LiveMap({ initialPosition = [31.9522, 35.2332], initialZoom = 15 }) {
  const [position, setPosition] = useState(initialPosition);
  const [isLoading, setIsLoading] = useState(true);
  const [accuracy, setAccuracy] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [locationError, setLocationError] = useState(null);
  const [usingDefaultLocation, setUsingDefaultLocation] = useState(false);
  const [allowManualCorrection, setAllowManualCorrection] = useState(false);
  const [showApproximateOption, setShowApproximateOption] = useState(false);
  const [deviceType, setDeviceType] = useState(null);
  const [locationReadings, setLocationReadings] = useState([]);
  const [locationAttempts, setLocationAttempts] = useState(0);
  const [showLocationSelector, setShowLocationSelector] = useState(false);
  const mapRef = useRef(null);
  const hasGotAccuratePosition = useRef(false);
  const locationWatchId = useRef(null);
  const autoCorrectionTimeout = useRef(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      console.log("Geolocation not supported - using emergency fallback");
      // IMMEDIATE emergency fallback - don't wait
      const emergencyLocation = {
        latitude: 31.7767, // Jerusalem Old City
        longitude: 35.2344,
        accuracy: 100
      };
      setPosition([emergencyLocation.latitude, emergencyLocation.longitude]);
      setAccuracy(emergencyLocation.accuracy);
      setIsLoading(false);
      setLocationError("Geolocation not supported - showing approximate location");
      return;
    }

    // Detect device type for adaptive location strategies
    const detectDevice = () => {
      const userAgent = navigator.userAgent.toLowerCase();
      if (/mobile|android|iphone|ipad|tablet/.test(userAgent)) {
        console.log("📱 Mobile device detected - using mobile-optimized location strategy");
        setDeviceType('mobile');
        return 'mobile';
      } else if (/chrome/.test(userAgent)) {
        console.log("💻 Desktop Chrome detected - using desktop location strategy");
        setDeviceType('desktop');
        return 'desktop';
      } else {
        console.log("🖥️ Desktop device detected - using desktop location strategy");
        setDeviceType('desktop');
        return 'desktop';
      }
    };

    const device = detectDevice();

    // Define success and error handlers FIRST
    const success = (pos) => {
      const lat = pos.coords.latitude;
      const lng = pos.coords.longitude;
      const acc = pos.coords.accuracy;
      
      console.log(`📍 GPS Location received: ${lat.toFixed(6)}, ${lng.toFixed(6)} (±${Math.round(acc)}m)`);
      
      // ONLY use GPS if it's very accurate, otherwise stick with IP location
      if (acc < 500) {
        console.log(`✅ EXCELLENT GPS - Using GPS location: ${lat.toFixed(6)}, ${lng.toFixed(6)} (±${Math.round(acc)}m)`);
        setPosition([lat, lng]);
        setAccuracy(Math.round(acc));
        setUsingDefaultLocation(false);
        setIsLoading(false);
        hasGotAccuratePosition.current = true;
        setLocationError(null);
        console.log(`🎯 GPS ACCEPTED: Displaying GPS location: ${lat.toFixed(6)}, ${lng.toFixed(6)} (±${Math.round(acc)}m)`);
      } else {
        console.log(`❌ GPS ACCURACY TOO POOR (${Math.round(acc)}m) - Keeping IP location instead`);
        // Don't update position, keep the IP location which is more reliable
      }
    };

    const error = (err) => {
      console.error("Location error:", err);
      console.error("Error code:", err.code);
      console.error("Error message:", err.message);
      
      // IMMEDIATE fallback - don't wait, show location immediately
      console.log("🚀 IMMEDIATE: Location error, using emergency fallback instantly");
      
      const emergencyLocation = {
        latitude: 31.7767, // Jerusalem Old City
        longitude: 35.2344,
        accuracy: 100
      };
      
      setPosition([emergencyLocation.latitude, emergencyLocation.longitude]);
      setAccuracy(emergencyLocation.accuracy);
      setUsingDefaultLocation(true);
      setIsLoading(false);
      hasGotAccuratePosition.current = true;
      
      if (err.code === 1) {
        console.error("❌ Permission denied - user blocked location access");
        setLocationError("Location access denied. Showing approximate location. Please enable location permissions for accurate positioning.");
      } else if (err.code === 2) {
        console.error("❌ Position unavailable - location could not be determined");
        setLocationError("Unable to determine your location. Showing approximate location. For better accuracy, try: 1) Moving to an open area, 2) Connecting to Wi-Fi, 3) Checking location permissions.");
      } else if (err.code === 3) {
        console.error("❌ Timeout - location request took too long");
        setLocationError("Location request timed out. Showing approximate location. For better accuracy, try: 1) Moving to an open area, 2) Connecting to Wi-Fi, 3) Checking location permissions.");
      } else {
        setLocationError("Failed to get your location. Showing approximate location. For better accuracy, try: 1) Moving to an open area, 2) Connecting to Wi-Fi, 3) Checking location permissions.");
      }
    };

    // IMMEDIATE location display - show CORRECT location instantly
    console.log("🚀 IMMEDIATE: Starting IP-based location detection (most reliable)");
    
    // IMMEDIATE: Try IP location first and show it immediately
    console.log("🌐 PRIORITY: Getting IP-based location (most reliable method)");
    tryIPBasedLocation();
    
    // Safety timeout - stop loading after 3 seconds maximum
    const safetyTimeout = setTimeout(() => {
      if (!hasGotAccuratePosition.current) {
        console.log("⏰ IMMEDIATE: Location timeout - using emergency fallback");
        const emergencyLocation = {
          latitude: 31.7767, // Jerusalem Old City
          longitude: 35.2344,
          accuracy: 100
        };
        setPosition([emergencyLocation.latitude, emergencyLocation.longitude]);
        setAccuracy(emergencyLocation.accuracy);
        setUsingDefaultLocation(true);
        setIsLoading(false);
        hasGotAccuratePosition.current = true;
        setLocationError(null);
      }
    }, 3000); // Fast timeout - IP location should work quickly

    return () => {
      if (locationWatchId.current) {
        navigator.geolocation.clearWatch(locationWatchId.current);
      }
      if (autoCorrectionTimeout.current) {
        clearTimeout(autoCorrectionTimeout.current);
      }
      clearTimeout(safetyTimeout);
    };
  }, []);

  const refreshLocation = () => {
    if (!navigator.geolocation) return;
    
    setIsRefreshing(true);
    hasGotAccuratePosition.current = false;
    setLocationError(null);
    
    const success = (pos) => {
      const lat = pos.coords.latitude;
      const lng = pos.coords.longitude;
      const acc = pos.coords.accuracy;
      
      console.log(`🔄 Refreshed location: ${lat.toFixed(6)}, ${lng.toFixed(6)} (±${Math.round(acc)}m)`);
      
      setPosition([lat, lng]);
      setAccuracy(Math.round(acc));
      setIsRefreshing(false);
      
      // Show results based on accuracy
      if (acc < 100) {
        setLocationError(null);
      } else if (acc < 500) {
        setLocationError(`Refreshed location accuracy: ±${Math.round(acc)}m. For better accuracy, try moving to an open area.`);
      } else {
        setLocationError(`Refreshed location accuracy: ±${Math.round(acc)}m. Your actual location could be up to ${Math.round(acc/1000)}km away. Try moving to an open area with clear sky view.`);
      }
    };

    const error = (err) => {
      console.log("Location refresh error:", err.message);
      setIsRefreshing(false);
      
      if (err.code === 3) {
        setLocationError("Location request timed out. Try moving to an open area with clear sky view or check your GPS settings.");
      } else if (err.code === 1) {
        setLocationError("Location access denied. Please enable location permissions in your browser settings.");
      } else {
        setLocationError("Failed to refresh location. Please check your GPS/network connection and try again.");
      }
    };

    // Device-specific refresh strategies
    const refreshStrategies = {
      mobile: [
        { 
          name: "Mobile GPS Refresh",
          enableHighAccuracy: true, 
          maximumAge: 0,
          timeout: 10000
        },
        { 
          name: "Mobile Network Refresh",
          enableHighAccuracy: false, 
          maximumAge: 0,
          timeout: 8000
        }
      ],
      desktop: [
        { 
          name: "Desktop GPS Refresh",
          enableHighAccuracy: true, 
          maximumAge: 0,
          timeout: 15000
        },
        { 
          name: "Desktop Network Refresh",
          enableHighAccuracy: false, 
          maximumAge: 0,
          timeout: 10000
        }
      ]
    };

    const strategies = refreshStrategies[deviceType] || refreshStrategies.desktop;

    const tryRefreshStrategy = (index) => {
      if (index >= strategies.length) {
        console.log("❌ All refresh strategies failed - device location services may be limited");
        setIsRefreshing(false);
        setLocationError("All location methods failed. This device may have limited location services. Try: 1) Moving to an open area with clear sky view, 2) Connecting to Wi-Fi, 3) Checking location permissions, or 4) Using manual correction by dragging the marker.");
        return;
      }

      const strategy = strategies[index];
      console.log(`🔄 Trying ${strategy.name}...`);

      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          const acc = pos.coords.accuracy;
          
          console.log(`🔄 ${strategy.name} succeeded: ${lat.toFixed(6)}, ${lng.toFixed(6)} (±${Math.round(acc)}m)`);
          
          setPosition([lat, lng]);
          setAccuracy(Math.round(acc));
          setIsRefreshing(false);
          
          // Show results based on accuracy
          if (acc < 100) {
            setLocationError(null);
          } else if (acc < 500) {
            setLocationError(`Refreshed location accuracy: ±${Math.round(acc)}m. For better accuracy, try moving to an open area.`);
          } else {
            setLocationError(`Refreshed location accuracy: ±${Math.round(acc)}m. Your actual location could be up to ${Math.round(acc/1000)}km away. Try moving to an open area with clear sky view.`);
          }
        },
        (err) => {
          console.log(`${strategy.name} failed:`, err.message);
          // Try next strategy
          tryRefreshStrategy(index + 1);
        },
        strategy
      );
    };

    tryRefreshStrategy(0);
  };

  const useApproximateLocation = () => {
    // Use a broader search to find a more accurate location
    console.log("🔍 Using approximate location method...");
    
    const approximateOptions = { 
      enableHighAccuracy: false, // Use network-based location
      maximumAge: 300000, // Accept cached location up to 5 minutes old
      timeout: 10000 // Shorter timeout for network-based location
    };

    const success = (pos) => {
      const lat = pos.coords.latitude;
      const lng = pos.coords.longitude;
      const acc = pos.coords.accuracy;
      
      console.log(`🌐 Approximate location: ${lat.toFixed(6)}, ${lng.toFixed(6)} (±${Math.round(acc)}m)`);
      
      setPosition([lat, lng]);
      setAccuracy(Math.round(acc));
      setShowApproximateOption(false);
      
      if (acc < 500) {
        setLocationError(null);
      } else {
        setLocationError(`Using approximate location (±${Math.round(acc)}m). For better accuracy, try moving to an open area.`);
      }
    };

    const error = (err) => {
      console.log("Approximate location failed:", err.message);
      setLocationError("Unable to get approximate location. Please try manual correction by dragging the marker.");
    };

    navigator.geolocation.getCurrentPosition(success, error, approximateOptions);
  };

  const improveLocationAccuracy = () => {
    console.log("🎯 Attempting to improve location accuracy by collecting more readings...");
    setLocationReadings([]); // Reset readings
    setAllowManualCorrection(false);
    setShowApproximateOption(false);
    
    // Force new location readings
    if (locationWatchId.current) {
      navigator.geolocation.clearWatch(locationWatchId.current);
    }
    
    // Try multiple quick readings
    const quickReadings = [];
    let readingCount = 0;
    const maxReadings = 3;
    
    const collectQuickReading = () => {
      if (readingCount >= maxReadings) {
        // Calculate best location from readings
        if (quickReadings.length > 0) {
          const bestReading = quickReadings.reduce((best, current) => 
            current.acc < best.acc ? current : best
          );
          
          console.log(`🎯 Best reading from ${quickReadings.length} attempts: ${bestReading.lat.toFixed(6)}, ${bestReading.lng.toFixed(6)} (±${Math.round(bestReading.acc)}m)`);
          
          setPosition([bestReading.lat, bestReading.lng]);
          setAccuracy(Math.round(bestReading.acc));
          
          if (bestReading.acc < 1000) {
            setLocationError(null);
          } else {
            setLocationError(`Improved location accuracy: ±${Math.round(bestReading.acc)}m. For even better accuracy, try moving to an open area.`);
          }
        }
        return;
      }
      
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const reading = {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
            acc: pos.coords.accuracy
          };
          quickReadings.push(reading);
          readingCount++;
          
          console.log(`📊 Reading ${readingCount}: ${reading.lat.toFixed(6)}, ${reading.lng.toFixed(6)} (±${Math.round(reading.acc)}m)`);
          
          // Try next reading after a short delay
          setTimeout(collectQuickReading, 1000);
        },
        (err) => {
          console.log(`Reading ${readingCount + 1} failed:`, err.message);
          readingCount++;
          setTimeout(collectQuickReading, 1000);
        },
        { enableHighAccuracy: true, maximumAge: 0, timeout: 5000 }
      );
    };
    
    collectQuickReading();
  };

  const selectPredefinedLocation = (location) => {
    console.log(`🎯 Selected predefined location: ${location.name} - ${location.latitude}, ${location.longitude}`);
    setPosition([location.latitude, location.longitude]);
    setAccuracy(location.accuracy);
    setLocationError(null);
    setShowLocationSelector(false);
    setAllowManualCorrection(false);
    setShowApproximateOption(false);
  };

  const predefinedLocations = [
    { name: "Jerusalem Old City", latitude: 31.7767, longitude: 35.2344, accuracy: 100 },
    { name: "Jerusalem Center", latitude: 31.7683, longitude: 35.2137, accuracy: 200 },
    { name: "Ramallah", latitude: 31.9522, longitude: 35.2332, accuracy: 500 },
    { name: "Nablus", latitude: 32.2241, longitude: 35.2581, accuracy: 500 },
    { name: "Bethlehem", latitude: 31.7054, longitude: 35.2024, accuracy: 500 },
    { name: "Hebron", latitude: 31.5326, longitude: 35.0998, accuracy: 500 },
    { name: "Tel Aviv", latitude: 32.0853, longitude: 34.7818, accuracy: 500 },
    { name: "Haifa", latitude: 32.7940, longitude: 34.9896, accuracy: 500 }
  ];

  const tryIPBasedLocation = () => {
    console.log("🌐 IMMEDIATE: Getting VISITOR's REAL current location...");
    
    // Get the correct backend URL
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    const endpoint = `${API_URL}/api/location/ip`;
    
    console.log("📡 Fetching from backend:", endpoint);
    
    // Use your backend server to fetch IP location (avoids CORS issues)
    fetch(endpoint)
      .then(response => {
        console.log(`📡 Backend response status: ${response.status}`);
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        return response.json();
      })
      .then(data => {
        console.log("📡 Backend response data:", data);
        
        if (data.latitude && data.longitude) {
          console.log(`✅ SUCCESS: VISITOR's location detected!`);
          console.log(`📍 Coordinates: ${data.latitude.toFixed(6)}, ${data.longitude.toFixed(6)}`);
          console.log(`🏙️ City: ${data.city || 'Unknown'}`);
          console.log(`🌍 Country: ${data.country || 'Unknown'}`);
          console.log(`🔧 Method: ${data.method || 'IP'}`);
          console.log(`📝 Note: ${data.note || ''}`);
          
          // IMMEDIATE location update - this is the VISITOR's REAL location
          setPosition([data.latitude, data.longitude]);
          setAccuracy(data.accuracy || 1000);
          setIsLoading(false);
          hasGotAccuratePosition.current = true;
          setLocationError(null);
          setAllowManualCorrection(false);
          setShowApproximateOption(false);
          
          console.log(`🎯 Map updated to show VISITOR's location!`);
        } else {
          console.log("⚠️ No coordinates in response - using emergency fallback");
          console.log("Response data:", data);
          // Show emergency location immediately
          const emergencyLocation = {
            latitude: 31.7767, // Jerusalem Old City
            longitude: 35.2344,
            accuracy: 100
          };
          setPosition([emergencyLocation.latitude, emergencyLocation.longitude]);
          setAccuracy(emergencyLocation.accuracy);
          setIsLoading(false);
          hasGotAccuratePosition.current = true;
          setLocationError(null);
        }
      })
      .catch(error => {
        console.error("❌ IP-based location FAILED!");
        console.error("Error details:", error);
        console.error("Error message:", error.message);
        // Show emergency location immediately
        const emergencyLocation = {
          latitude: 31.7767, // Jerusalem Old City
          longitude: 35.2344,
          accuracy: 100
        };
        setPosition([emergencyLocation.latitude, emergencyLocation.longitude]);
        setAccuracy(emergencyLocation.accuracy);
        setIsLoading(false);
        hasGotAccuratePosition.current = true;
        setLocationError(null);
      });
  };

  return (
    <div style={{ height: "500px", width: "100%", position: "relative", borderRadius: "16px", overflow: "hidden" }}>
      {isLoading && (
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(255, 255, 255, 0.9)",
            zIndex: 1000,
            gap: 2
          }}
        >
          <CircularProgress />
          <Typography variant="body2" color="text.secondary">
            Getting your location...
          </Typography>
        </Box>
      )}
      
      {/* Refresh Location Button */}
      {!isLoading && (
        <Tooltip title="Refresh Location">
          <IconButton
            onClick={refreshLocation}
            disabled={isRefreshing}
            sx={{
              position: "absolute",
              top: 10,
              right: 10,
              zIndex: 1000,
              backgroundColor: "white",
              boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
              "&:hover": {
                backgroundColor: "rgba(255,255,255,0.9)",
              },
            }}
          >
            {isRefreshing ? (
              <CircularProgress size={20} />
            ) : (
              <MyLocationIcon />
            )}
          </IconButton>
        </Tooltip>
      )}

      {/* Manual Correction and Approximate Location Options */}
      {!isLoading && (allowManualCorrection || showApproximateOption) && (
        <Box
          sx={{
            position: "absolute",
            top: 60,
            right: 10,
            zIndex: 1000,
            backgroundColor: "white",
            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
            borderRadius: 1,
            p: 1,
            display: "flex",
            flexDirection: "column",
            gap: 1,
          }}
        >
          {allowManualCorrection && (
            <Typography variant="caption" sx={{ fontSize: "0.75rem", color: "#666" }}>
              Location not accurate?<br />
              Drag the marker to correct it
            </Typography>
          )}
          
          {showApproximateOption && (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
              <Typography variant="caption" sx={{ fontSize: "0.75rem", color: "#666" }}>
                GPS accuracy is poor. Try:
              </Typography>
              <button
                onClick={improveLocationAccuracy}
                style={{
                  fontSize: "0.75rem",
                  padding: "4px 8px",
                  backgroundColor: "#34a853",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  marginBottom: "4px",
                }}
              >
                Improve Location
              </button>
              <button
                onClick={useApproximateLocation}
                style={{
                  fontSize: "0.75rem",
                  padding: "4px 8px",
                  backgroundColor: "#4285f4",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  marginBottom: "4px",
                }}
              >
                Use Network Location
              </button>
              <button
                onClick={tryIPBasedLocation}
                style={{
                  fontSize: "0.75rem",
                  padding: "4px 8px",
                  backgroundColor: "#ff6b35",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  marginBottom: "4px",
                }}
              >
                Try IP Location
              </button>
              <button
                onClick={() => setShowLocationSelector(true)}
                style={{
                  fontSize: "0.75rem",
                  padding: "4px 8px",
                  backgroundColor: "#9c27b0",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                Select Location
              </button>
            </Box>
          )}
        </Box>
      )}
      
      {/* Location Selector Modal */}
      {showLocationSelector && (
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.7)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 2000,
          }}
        >
          <Box
            sx={{
              backgroundColor: "white",
              borderRadius: 2,
              padding: 3,
              maxWidth: 400,
              maxHeight: "80vh",
              overflow: "auto",
              boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
            }}
          >
            <Typography variant="h6" sx={{ marginBottom: 2, textAlign: "center" }}>
              Select Your Location
            </Typography>
            <Typography variant="body2" sx={{ marginBottom: 2, textAlign: "center", color: "#666" }}>
              Choose your current location for accurate map display
            </Typography>
            
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1, marginBottom: 2 }}>
              {predefinedLocations.map((location, index) => (
                <button
                  key={index}
                  onClick={() => selectPredefinedLocation(location)}
                  style={{
                    padding: "12px 16px",
                    border: "1px solid #ddd",
                    borderRadius: "8px",
                    backgroundColor: "white",
                    cursor: "pointer",
                    textAlign: "left",
                    fontSize: "14px",
                    transition: "all 0.2s",
                  }}
                  onMouseOver={(e) => {
                    e.target.style.backgroundColor = "#f5f5f5";
                    e.target.style.borderColor = "#9c27b0";
                  }}
                  onMouseOut={(e) => {
                    e.target.style.backgroundColor = "white";
                    e.target.style.borderColor = "#ddd";
                  }}
                >
                  <div style={{ fontWeight: "bold", marginBottom: "4px" }}>
                    {location.name}
                  </div>
                  <div style={{ fontSize: "12px", color: "#666" }}>
                    Accuracy: ±{location.accuracy}m
                  </div>
                </button>
              ))}
            </Box>
            
            <button
              onClick={() => setShowLocationSelector(false)}
              style={{
                width: "100%",
                padding: "12px",
                border: "1px solid #ddd",
                borderRadius: "8px",
                backgroundColor: "#f5f5f5",
                cursor: "pointer",
                fontSize: "14px",
              }}
            >
              Cancel
            </button>
          </Box>
        </Box>
      )}
      
      {/* Location Error/Warning Messages */}
      {(locationError || usingDefaultLocation) && (
        <Box
          sx={{
            position: "absolute",
            top: 10,
            left: 10,
            right: 60, // Leave space for refresh button
            zIndex: 1000,
            backgroundColor: usingDefaultLocation ? "#fff3cd" : "#f8d7da",
            border: `1px solid ${usingDefaultLocation ? "#ffeaa7" : "#f5c6cb"}`,
            borderRadius: 1,
            p: 1,
            fontSize: "0.875rem",
          }}
        >
          <Typography variant="body2" sx={{ color: usingDefaultLocation ? "#856404" : "#721c24" }}>
            {locationError || "📍 Showing default location - click refresh to get your actual location"}
          </Typography>
        </Box>
      )}
      
      <MapContainer 
        center={position} 
        zoom={initialZoom} 
        style={{ height: "100%", width: "100%" }}
        ref={mapRef}
        scrollWheelZoom={true}
        zoomControl={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Recenter position={position} />
        <Marker 
          position={position} 
          icon={createUserIcon()}
          draggable={allowManualCorrection}
          eventHandlers={allowManualCorrection ? {
            dragend: (e) => {
              const newPos = e.target.getLatLng();
              setPosition([newPos.lat, newPos.lng]);
              console.log(`🎯 Manually corrected location: ${newPos.lat.toFixed(6)}, ${newPos.lng.toFixed(6)}`);
            }
          } : {}}
        >
          <Popup>
            <div style={{ textAlign: "center" }}>
              <strong>📍 Your Location</strong>
              <br />
              <small>
                Lat: {position[0].toFixed(6)}<br />
                Lng: {position[1].toFixed(6)}
                {accuracy && (
                  <>
                    <br />
                    Accuracy: ±{accuracy}m
                  </>
                )}
                {allowManualCorrection && (
                  <>
                    <br />
                    <span style={{ color: "#ff6b35" }}>
                      ✋ Draggable - location accuracy is poor
                    </span>
                  </>
                )}
              </small>
            </div>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}