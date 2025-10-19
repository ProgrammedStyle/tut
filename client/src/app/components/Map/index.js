"use client";
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { useEffect, useState, useRef, useCallback } from 'react';
import { Box, CircularProgress, Typography, Alert, Chip } from '@mui/material';
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
  const [position, setPosition] = useState([31.7767, 35.2344]); // Default to Jerusalem
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [locationInfo, setLocationInfo] = useState(null);
  const [lastUpdateTime, setLastUpdateTime] = useState(null);
  const [isTracking, setIsTracking] = useState(true);
  
  // Refs for tracking
  const watchIdRef = useRef(null);
  const lastPositionRef = useRef(null);
  const updateIntervalRef = useRef(null);

  // Get visitor's current location from IP
  const getVisitorLocation = useCallback(async () => {
    try {
      console.log("🌍 REAL-TIME MAP: Getting visitor's current location...");
      
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const endpoint = `${API_URL}/api/location/ip`;
      
      const response = await fetch(endpoint);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log("🌍 REAL-TIME MAP: Location data:", data);
      
      if (data.success && data.latitude && data.longitude) {
        const newPosition = [data.latitude, data.longitude];
        
        // Check if position has changed significantly (more than 1km)
        if (lastPositionRef.current) {
          const distance = calculateDistance(lastPositionRef.current, newPosition);
          if (distance > 1) { // More than 1km change
            console.log(`🔄 REAL-TIME MAP: Visitor moved ${distance.toFixed(2)}km - updating map!`);
          }
        }
        
        setPosition(newPosition);
        lastPositionRef.current = newPosition;
        setLocationInfo({
          city: data.city || 'Unknown',
          country: data.country || 'Unknown',
          method: data.method || 'IP Detection',
          accuracy: data.accuracy || 1000
        });
        setLastUpdateTime(new Date().toLocaleTimeString());
        setLoading(false);
        setError(null);
        
        console.log(`✅ REAL-TIME MAP: Updated to ${data.city}, ${data.country} at ${new Date().toLocaleTimeString()}`);
      } else {
        throw new Error("No valid location data received");
      }
    } catch (error) {
      console.error("❌ REAL-TIME MAP: Error getting location:", error);
      setError(error.message);
      setLoading(false);
    }
  }, []);

  // Calculate distance between two coordinates (in km)
  const calculateDistance = (pos1, pos2) => {
    const R = 6371; // Earth's radius in km
    const dLat = (pos2[0] - pos1[0]) * Math.PI / 180;
    const dLon = (pos2[1] - pos1[1]) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(pos1[0] * Math.PI / 180) * Math.cos(pos2[0] * Math.PI / 180) *
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  // Browser GPS location tracking
  const startGPSLocationTracking = useCallback(() => {
    if (!navigator.geolocation) {
      console.log("🌍 REAL-TIME MAP: GPS not available, using IP tracking only");
      return;
    }

    console.log("🌍 REAL-TIME MAP: Starting GPS location tracking...");
    
    const options = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 30000 // Accept cached position up to 30 seconds old
    };

    // Watch position for continuous updates
    watchIdRef.current = navigator.geolocation.watchPosition(
      (position) => {
        const newPosition = [position.coords.latitude, position.coords.longitude];
        const accuracy = position.coords.accuracy;
        
        console.log(`📍 REAL-TIME MAP: GPS update - ${newPosition[0].toFixed(6)}, ${newPosition[1].toFixed(6)} (±${Math.round(accuracy)}m)`);
        
        // Only update if GPS is more accurate than IP or if we don't have IP data
        if (!locationInfo || accuracy < (locationInfo.accuracy || 1000)) {
          setPosition(newPosition);
          lastPositionRef.current = newPosition;
          setLocationInfo({
            city: 'GPS Location',
            country: 'Your Device',
            method: `GPS (${Math.round(accuracy)}m accuracy)`,
            accuracy: accuracy
          });
          setLastUpdateTime(new Date().toLocaleTimeString());
          setLoading(false);
          setError(null);
          
          console.log(`🎯 REAL-TIME MAP: GPS location updated!`);
        }
      },
      (error) => {
        console.log("🌍 REAL-TIME MAP: GPS error:", error.message);
        // GPS failed, continue with IP tracking
      },
      options
    );
  }, [locationInfo]);

  // Stop GPS tracking
  const stopGPSLocationTracking = useCallback(() => {
    if (watchIdRef.current) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
      console.log("🌍 REAL-TIME MAP: GPS tracking stopped");
    }
  }, []);

  // Initial location detection
  useEffect(() => {
    console.log("🗺️ REAL-TIME MAP: Initializing real-time location tracking...");
    getVisitorLocation();
    startGPSLocationTracking();
    
    // Set up periodic IP location updates (every 30 seconds)
    updateIntervalRef.current = setInterval(() => {
      if (isTracking) {
        console.log("🔄 REAL-TIME MAP: Periodic location check...");
        getVisitorLocation();
      }
    }, 30000); // Check every 30 seconds

    // Cleanup
    return () => {
      stopGPSLocationTracking();
      if (updateIntervalRef.current) {
        clearInterval(updateIntervalRef.current);
      }
    };
  }, [getVisitorLocation, startGPSLocationTracking, stopGPSLocationTracking, isTracking]);

  // Component to center map on position
  const MapCenter = ({ position }) => {
    const map = useMap();
    
    useEffect(() => {
      if (position && position[0] && position[1]) {
        console.log("🎯 REAL-TIME MAP: Centering map on:", position);
        map.setView(position, 13);
      }
    }, [position, map]);
    
    return null;
  };

  // Custom marker icon with pulse animation
  const createPulseIcon = (color = 'red') => {
    return L.divIcon({
      className: 'pulse-marker',
      html: `<div style="
        background-color: ${color};
        width: 30px;
        height: 30px;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 0 0 4px rgba(255,0,0,0.3);
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
          0% { box-shadow: 0 0 0 0 rgba(255,0,0,0.7); }
          70% { box-shadow: 0 0 0 10px rgba(255,0,0,0); }
          100% { box-shadow: 0 0 0 0 rgba(255,0,0,0); }
        }
      </style>`,
      iconSize: [30, 30],
      iconAnchor: [15, 15]
    });
  };

  // Toggle tracking
  const toggleTracking = () => {
    setIsTracking(!isTracking);
    if (isTracking) {
      stopGPSLocationTracking();
      if (updateIntervalRef.current) {
        clearInterval(updateIntervalRef.current);
      }
      console.log("⏸️ REAL-TIME MAP: Tracking paused");
    } else {
      startGPSLocationTracking();
      updateIntervalRef.current = setInterval(() => {
        getVisitorLocation();
      }, 30000);
      console.log("▶️ REAL-TIME MAP: Tracking resumed");
    }
  };

  if (loading) {
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
            Detecting your current location...
          </Typography>
          <Typography variant="body2" style={{ marginTop: 8, color: "#999" }}>
            This will update automatically when you move
          </Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box style={{ height: "500px", width: "100%", position: "relative", borderRadius: "16px", overflow: "hidden" }}>
      {/* Status indicators */}
      <Box style={{ position: "absolute", top: 10, left: 10, zIndex: 1000, display: "flex", gap: 8 }}>
        <Chip 
          label={isTracking ? "🔄 Live Tracking" : "⏸️ Tracking Paused"} 
          color={isTracking ? "success" : "default"}
          size="small"
          onClick={toggleTracking}
          style={{ cursor: "pointer" }}
        />
        {lastUpdateTime && (
          <Chip 
            label={`Updated: ${lastUpdateTime}`} 
            variant="outlined"
            size="small"
          />
        )}
      </Box>

      {error && (
        <Alert severity="warning" style={{ position: "absolute", top: 10, right: 10, zIndex: 1000, maxWidth: "300px" }}>
          {error}
        </Alert>
      )}
      
      <MapContainer
        center={position}
        zoom={13}
        style={{ height: "100%", width: "100%" }}
        zoomControl={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <MapCenter position={position} />
        
        <Marker 
          position={position} 
          icon={createPulseIcon('red')}
        >
          <Popup>
            <div style={{ textAlign: "center", padding: "8px", minWidth: "200px" }}>
              <Typography variant="h6" style={{ margin: "0 0 8px 0", color: "#333" }}>
                📍 Your Current Location
              </Typography>
              {locationInfo && (
                <>
                  <Typography variant="body2" style={{ margin: "4px 0", color: "#666" }}>
                    🏙️ {locationInfo.city}, {locationInfo.country}
                  </Typography>
                  <Typography variant="caption" style={{ color: "#888", display: "block" }}>
                    📡 {locationInfo.method}
                  </Typography>
                  <Typography variant="caption" style={{ color: "#888", display: "block" }}>
                    🕒 Last updated: {lastUpdateTime}
                  </Typography>
                  <Typography variant="caption" style={{ color: "#888", display: "block", marginTop: "4px" }}>
                    💡 This location updates automatically when you move
                  </Typography>
                </>
              )}
            </div>
          </Popup>
        </Marker>
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
            📍 {locationInfo.city}, {locationInfo.country}
          </Typography>
          <Typography variant="body2" style={{ color: "#666", margin: "0 0 4px 0" }}>
            📡 {locationInfo.method}
          </Typography>
          <Typography variant="caption" style={{ color: "#888" }}>
            🕒 Updated: {lastUpdateTime}
          </Typography>
          <Typography variant="caption" style={{ color: "#888", display: "block", marginTop: "4px" }}>
            💡 Location updates automatically when you move
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default Map;
