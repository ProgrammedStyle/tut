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
  const mapRef = useRef(null);
  const hasGotAccuratePosition = useRef(false);

  useEffect(() => {
    if (!navigator.geolocation) {
      console.log("Geolocation not supported");
      setIsLoading(false);
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

    const success = (pos) => {
      const lat = pos.coords.latitude;
      const lng = pos.coords.longitude;
      const acc = pos.coords.accuracy;
      
      console.log(`📍 Location received: ${lat.toFixed(6)}, ${lng.toFixed(6)} (±${Math.round(acc)}m)`);
      
      // Clear any previous errors
      setLocationError(null);
      setUsingDefaultLocation(false);
      
      // Always update position, but prioritize more accurate ones
      setPosition([lat, lng]);
      setAccuracy(Math.round(acc));
      
      // Stop loading if we get reasonably accurate location OR if we've tried enough
      if (acc < 2000 || !hasGotAccuratePosition.current) { // Accept up to 2km accuracy
        hasGotAccuratePosition.current = true;
        setIsLoading(false);
        
        if (acc < 100) {
          console.log(`✅ Excellent location acquired: ${lat.toFixed(6)}, ${lng.toFixed(6)} (±${Math.round(acc)}m)`);
          setLocationError(null);
        } else if (acc < 500) {
          console.log(`✅ Good location acquired: ${lat.toFixed(6)}, ${lng.toFixed(6)} (±${Math.round(acc)}m)`);
          setLocationError(null);
        } else if (acc < 1000) {
          console.log(`⚠️ Location acquired with moderate accuracy: ${lat.toFixed(6)}, ${lng.toFixed(6)} (±${Math.round(acc)}m)`);
          setLocationError(`Location accuracy is moderate (±${Math.round(acc)}m). For better accuracy, try moving to an open area.`);
        } else {
          console.log(`⚠️ Location acquired with limited accuracy: ${lat.toFixed(6)}, ${lng.toFixed(6)} (±${Math.round(acc)}m)`);
          setLocationError(`Location accuracy is limited (±${Math.round(acc)}m). Your actual location could be up to ${Math.round(acc/1000)}km away. For better accuracy, try moving to an open area or use manual correction.`);
          setAllowManualCorrection(true);
          setShowApproximateOption(true);
        }
      }
    };

    const error = (err) => {
      console.error("Location error:", err);
      console.error("Error code:", err.code);
      console.error("Error message:", err.message);
      
      if (err.code === 1) {
        console.error("❌ Permission denied - user blocked location access");
        setLocationError("Location access denied. Please enable location permissions.");
      } else if (err.code === 2) {
        console.error("❌ Position unavailable - location could not be determined");
        setLocationError("Unable to determine your location. Please check your GPS/network connection.");
      } else if (err.code === 3) {
        console.error("❌ Timeout - location request took too long");
        setLocationError("Location request timed out. Please try refreshing your location.");
      } else {
        setLocationError("Failed to get your location. Please try again.");
      }
      
      console.log("Using default position");
      setUsingDefaultLocation(true);
      setIsLoading(false);
    };

    // First try: Get quick cached position if available
    const quickOptions = { 
      enableHighAccuracy: false, 
      maximumAge: 60000, // Accept cached position up to 1 minute old
      timeout: 5000 // Quick timeout for cached position
    };

    // Second try: Get high accuracy position
    const accurateOptions = { 
      enableHighAccuracy: true, 
      maximumAge: 10000, // Accept cached position up to 10 seconds old
      timeout: 15000 // Reasonable timeout for high accuracy
    };

    // Device-specific location strategies
    const tryLocationStrategies = () => {
      console.log("🔍 Starting device-specific location detection...");
      
      // Device-specific strategies
      const strategies = {
        mobile: [
          { 
            name: "Mobile Quick", 
            options: { enableHighAccuracy: false, maximumAge: 30000, timeout: 5000 },
            accuracyThreshold: 1000
          },
          { 
            name: "Mobile GPS", 
            options: { enableHighAccuracy: true, maximumAge: 0, timeout: 10000 },
            accuracyThreshold: 500
          },
          { 
            name: "Mobile Network", 
            options: { enableHighAccuracy: false, maximumAge: 300000, timeout: 8000 },
            accuracyThreshold: 2000
          }
        ],
        desktop: [
          { 
            name: "Desktop Quick", 
            options: { enableHighAccuracy: false, maximumAge: 60000, timeout: 3000 },
            accuracyThreshold: 2000
          },
          { 
            name: "Desktop GPS", 
            options: { enableHighAccuracy: true, maximumAge: 0, timeout: 15000 },
            accuracyThreshold: 1000
          },
          { 
            name: "Desktop Network", 
            options: { enableHighAccuracy: false, maximumAge: 300000, timeout: 10000 },
            accuracyThreshold: 3000
          }
        ]
      };

      const deviceStrategies = strategies[device] || strategies.desktop;
      console.log(`🎯 Using ${device} strategies:`, deviceStrategies.map(s => s.name));

      const tryStrategy = (index) => {
        if (index >= deviceStrategies.length) {
          console.log("❌ All strategies failed for this device");
          error({ code: 2, message: "All location strategies failed" });
          return;
        }

        const strategy = deviceStrategies[index];
        console.log(`📍 Trying ${strategy.name}...`);

        navigator.geolocation.getCurrentPosition(
          (pos) => {
            const acc = pos.coords.accuracy;
            console.log(`✅ ${strategy.name} succeeded: ±${Math.round(acc)}m`);
            
            if (acc < strategy.accuracyThreshold) {
              console.log(`🎯 ${strategy.name} accuracy acceptable, using this location`);
              success(pos);
            } else {
              console.log(`⚠️ ${strategy.name} accuracy not good enough, trying next strategy`);
              tryStrategy(index + 1);
            }
          },
          (err) => {
            console.log(`❌ ${strategy.name} failed:`, err.message);
            tryStrategy(index + 1);
          },
          strategy.options
        );
      };

      tryStrategy(0);
    };

    // Start the comprehensive approach
    tryLocationStrategies();
    
    // Watch for position updates to get better accuracy over time
    const watchId = navigator.geolocation.watchPosition(success, error, accurateOptions);

    // Safety timeout - stop loading after 8 seconds
    const safetyTimeout = setTimeout(() => {
      if (!hasGotAccuratePosition.current) {
        console.log("⏰ Location timeout - using best available location");
        setIsLoading(false);
      }
    }, 8000);

    return () => {
      navigator.geolocation.clearWatch(watchId);
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
        console.log("All refresh strategies failed");
        setIsRefreshing(false);
        setLocationError("Failed to refresh location. Please try manual correction.");
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
                onClick={useApproximateLocation}
                style={{
                  fontSize: "0.75rem",
                  padding: "4px 8px",
                  backgroundColor: "#4285f4",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                Use Network Location
              </button>
            </Box>
          )}
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