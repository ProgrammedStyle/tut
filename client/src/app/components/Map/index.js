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
  const [isTracking, setIsTracking] = useState(false);
  const [accuracy, setAccuracy] = useState(null);
  
  // Refs for tracking
  const watchIdRef = useRef(null);
  const lastPositionRef = useRef(null);

  // Get current location using browser GPS only
  const getCurrentLocation = useCallback((options = {}) => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by this browser'));
        return;
      }

      const defaultOptions = {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 30000
      };

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy
          };
          console.log(`📍 GPS Location: ${coords.latitude}, ${coords.longitude} (±${Math.round(coords.accuracy)}m)`);
          resolve(coords);
        },
        (error) => {
          let errorMessage = 'Unknown error';
          switch(error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = 'Location access denied by user';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = 'Location information unavailable';
              break;
            case error.TIMEOUT:
              errorMessage = 'Location request timed out';
              break;
          }
          console.error(`❌ GPS Error: ${errorMessage}`);
          reject(new Error(errorMessage));
        },
        { ...defaultOptions, ...options }
      );
    });
  }, []);

  // Start continuous location tracking
  const startLocationTracking = useCallback(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by this browser');
      setLoading(false);
      return;
    }

    console.log("🌍 Starting GPS location tracking...");
    setIsTracking(true);
    
    const options = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 10000 // Accept cached position up to 10 seconds old
    };

    // Watch position for continuous updates
    watchIdRef.current = navigator.geolocation.watchPosition(
      (position) => {
        const newPosition = [position.coords.latitude, position.coords.longitude];
        const newAccuracy = position.coords.accuracy;
        
        console.log(`📍 GPS Update: ${newPosition[0].toFixed(6)}, ${newPosition[1].toFixed(6)} (±${Math.round(newAccuracy)}m)`);
        
        // Always update with GPS data - it's the most accurate we have
        setPosition(newPosition);
        setAccuracy(newAccuracy);
        lastPositionRef.current = newPosition;
        
        setLocationInfo({
          latitude: newPosition[0],
          longitude: newPosition[1],
          accuracy: newAccuracy,
          method: `GPS (±${Math.round(newAccuracy)}m accuracy)`,
          timestamp: new Date()
        });
        
        setLastUpdateTime(new Date().toLocaleTimeString());
        setLoading(false);
        setError(null);
        
        console.log(`✅ Location updated successfully!`);
      },
      (error) => {
        let errorMessage = 'Unknown error';
        switch(error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location access denied. Please allow location access and try again.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information unavailable. Please check your internet connection.';
            break;
          case error.TIMEOUT:
            errorMessage = 'Location request timed out. Please try again.';
            break;
        }
        console.error(`❌ GPS Tracking Error: ${errorMessage}`);
        setError(errorMessage);
        setLoading(false);
      },
      options
    );
  }, []);

  // Stop location tracking
  const stopLocationTracking = useCallback(() => {
    if (watchIdRef.current) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
      setIsTracking(false);
      console.log("⏸️ Location tracking stopped");
    }
  }, []);

  // Manual location refresh
  const refreshLocation = useCallback(async () => {
    setLoading(true);
    setError(null);
    console.log("🔄 Manual location refresh...");
    
    try {
      const coords = await getCurrentLocation();
      const newPosition = [coords.latitude, coords.longitude];
      
      setPosition(newPosition);
      setAccuracy(coords.accuracy);
      lastPositionRef.current = newPosition;
      
      setLocationInfo({
        latitude: newPosition[0],
        longitude: newPosition[1],
        accuracy: coords.accuracy,
        method: `GPS (±${Math.round(coords.accuracy)}m accuracy)`,
        timestamp: new Date()
      });
      
      setLastUpdateTime(new Date().toLocaleTimeString());
      setLoading(false);
      
      console.log(`✅ Manual refresh successful!`);
    } catch (error) {
      console.error(`❌ Manual refresh failed: ${error.message}`);
      setError(error.message);
      setLoading(false);
    }
  }, [getCurrentLocation]);

  // Initial location detection
  useEffect(() => {
    console.log("🗺️ Initializing GPS-only location detection...");
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
        console.log("🎯 Centering map on:", position);
        map.setView(position, 15); // Zoom level 15 for better detail
      }
    }, [position, map]);
    
    return null;
  };

  // Custom marker icon with pulse animation
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
            Getting your current location...
          </Typography>
          <Typography variant="body2" style={{ marginTop: 8, color: "#999" }}>
            Please allow location access in your browser
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
          label={isTracking ? "🔄 Live GPS Tracking" : "⏸️ GPS Tracking Paused"} 
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
        {accuracy && (
          <Chip 
            label={`±${Math.round(accuracy)}m accuracy`} 
            variant="outlined"
            size="small"
            color={accuracy < 100 ? "success" : accuracy < 500 ? "warning" : "error"}
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
        zoom={position ? 15 : 2}
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
                  📍 Your Current Location
                </Typography>
                {locationInfo && (
                  <>
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
                      💡 This location updates automatically when you move
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
            📍 Your Current Location
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
            💡 Location updates automatically when you move
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default Map;