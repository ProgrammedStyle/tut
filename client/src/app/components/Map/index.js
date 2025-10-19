"use client";
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { useEffect, useState } from 'react';
import { Box, CircularProgress, Typography, Alert } from '@mui/material';
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

  // Get visitor's location immediately when component mounts
  useEffect(() => {
    console.log("🗺️ NEW MAP: Starting to get visitor's current location...");
    
    // Get the correct backend URL
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    const endpoint = `${API_URL}/api/location/ip`;
    
    console.log("📡 NEW MAP: Fetching from:", endpoint);
    
    fetch(endpoint)
      .then(response => {
        console.log("📡 NEW MAP: Response status:", response.status);
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        return response.json();
      })
      .then(data => {
        console.log("📡 NEW MAP: Response data:", data);
        
        if (data.success && data.latitude && data.longitude) {
          const newPosition = [data.latitude, data.longitude];
          console.log(`✅ NEW MAP: SUCCESS! Setting visitor's location to: ${data.latitude}, ${data.longitude}`);
          console.log(`📍 NEW MAP: City: ${data.city}, Country: ${data.country}`);
          
          setPosition(newPosition);
          setLocationInfo({
            city: data.city || 'Unknown',
            country: data.country || 'Unknown',
            method: data.method || 'IP Detection'
          });
          setLoading(false);
          setError(null);
        } else {
          throw new Error("No valid location data received");
        }
      })
      .catch(error => {
        console.error("❌ NEW MAP: Error getting location:", error);
        setError(error.message);
        setLoading(false);
        // Keep default Jerusalem position
      });
  }, []);

  // Component to center map on position
  const MapCenter = ({ position }) => {
    const map = useMap();
    
    useEffect(() => {
      if (position && position[0] && position[1]) {
        console.log("🎯 NEW MAP: Centering map on position:", position);
        map.setView(position, 13);
      }
    }, [position, map]);
    
    return null;
  };

  // Custom marker icon
  const createCustomIcon = (color = 'red') => {
    return L.divIcon({
      className: 'custom-marker',
      html: `<div style="
        background-color: ${color};
        width: 25px;
        height: 25px;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: bold;
        font-size: 12px;
      ">📍</div>`,
      iconSize: [25, 25],
      iconAnchor: [12, 12]
    });
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
            Getting your current location...
          </Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box style={{ height: "500px", width: "100%", position: "relative", borderRadius: "16px", overflow: "hidden" }}>
      {error && (
        <Alert severity="warning" style={{ position: "absolute", top: 10, left: 10, right: 10, zIndex: 1000 }}>
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
          icon={createCustomIcon('red')}
        >
          <Popup>
            <div style={{ textAlign: "center", padding: "8px" }}>
              <Typography variant="h6" style={{ margin: "0 0 8px 0", color: "#333" }}>
                Your Current Location
              </Typography>
              {locationInfo && (
                <>
                  <Typography variant="body2" style={{ margin: "4px 0", color: "#666" }}>
                    📍 {locationInfo.city}, {locationInfo.country}
                  </Typography>
                  <Typography variant="caption" style={{ color: "#888" }}>
                    Detected via: {locationInfo.method}
                  </Typography>
                </>
              )}
            </div>
          </Popup>
        </Marker>
      </MapContainer>
      
      {locationInfo && (
        <Box 
          style={{
            position: "absolute",
            bottom: 10,
            left: 10,
            backgroundColor: "rgba(255, 255, 255, 0.95)",
            padding: "8px 12px",
            borderRadius: "8px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            backdropFilter: "blur(10px)"
          }}
        >
          <Typography variant="body2" style={{ fontWeight: "bold", color: "#333" }}>
            📍 {locationInfo.city}, {locationInfo.country}
          </Typography>
          <Typography variant="caption" style={{ color: "#666" }}>
            Your current location
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default Map;
