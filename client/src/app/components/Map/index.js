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
  
  // Refs for tracking
  const updateIntervalRef = useRef(null);

  // Get visitor's location from backend IP service
  const getVisitorLocation = useCallback(async () => {
    try {
      console.log("🌍 Getting VISITOR location from backend...");
      
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const endpoint = `${API_URL}/api/location/ip`;
      console.log(`📡 Calling: ${endpoint}`);
      
      const response = await fetch(endpoint, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });
      
      console.log(`📡 Response status: ${response.status}`);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log("🌍 Backend response:", data);
      
      if (data.success && data.latitude && data.longitude) {
        const newPosition = [data.latitude, data.longitude];
        
        setPosition(newPosition);
        
        setLocationInfo({
          latitude: data.latitude,
          longitude: data.longitude,
          city: data.city || 'Unknown',
          country: data.country || 'Unknown',
          accuracy: data.accuracy || 1000,
          method: data.method || 'IP Geolocation',
          note: data.note || 'Visitor location detected'
        });
        
        setLastUpdateTime(new Date().toLocaleTimeString());
        setLoading(false);
        setError(null);
        
        console.log(`✅ VISITOR location set: ${data.city}, ${data.country} at ${new Date().toLocaleTimeString()}`);
      } else {
        throw new Error("No valid location data received from backend");
      }
    } catch (error) {
      console.error("❌ Error getting visitor location:", error);
      setError(error.message);
      setLoading(false);
    }
  }, []);

  // Start continuous location tracking
  const startLocationTracking = useCallback(() => {
    console.log("🌍 Starting VISITOR location tracking...");
    setIsTracking(true);
    
    // Get initial location
    getVisitorLocation();
    
    // Set up periodic updates (every 30 seconds)
    updateIntervalRef.current = setInterval(() => {
      if (isTracking) {
        console.log("🔄 Periodic VISITOR location check...");
        getVisitorLocation();
      }
    }, 30000); // Check every 30 seconds
  }, [getVisitorLocation, isTracking]);

  // Stop location tracking
  const stopLocationTracking = useCallback(() => {
    if (updateIntervalRef.current) {
      clearInterval(updateIntervalRef.current);
      updateIntervalRef.current = null;
    }
    setIsTracking(false);
    console.log("⏸️ VISITOR location tracking stopped");
  }, []);

  // Manual location refresh
  const refreshLocation = useCallback(async () => {
    setLoading(true);
    setError(null);
    console.log("🔄 Manual VISITOR location refresh...");
    
    await getVisitorLocation();
  }, [getVisitorLocation]);

  // Initial location detection
  useEffect(() => {
    console.log("🗺️ Initializing VISITOR location tracking...");
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
            Detecting visitor&apos;s current location...
          </Typography>
          <Typography variant="body2" style={{ marginTop: 8, color: "#999" }}>
            This will update automatically when the visitor moves
          </Typography>
          <Button 
            onClick={refreshLocation} 
            variant="outlined" 
            style={{ marginTop: 16 }}
            disabled={loading}
          >
            Try Again
          </Button>
        </Box>
      </Box>
    );
  }

  return (
    <Box style={{ height: "500px", width: "100%", position: "relative", borderRadius: "16px", overflow: "hidden" }}>
      {/* Status indicators */}
      <Box style={{ position: "absolute", top: 10, left: 10, zIndex: 1000, display: "flex", gap: 8, flexWrap: "wrap" }}>
        <Chip 
          label={isTracking ? "🔄 Live Visitor Tracking" : "⏸️ Tracking Paused"} 
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
                  📍 Visitor&apos;s Current Location
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
                      💡 This location updates automatically when the visitor moves
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
            📍 Visitor&apos;s Current Location
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
            💡 Location updates automatically when visitor moves
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default Map;