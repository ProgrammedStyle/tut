"use client";

import React, { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, Marker, useMap, Popup } from "react-leaflet";
import L from "leaflet";
import { CircularProgress, Box, Typography } from "@mui/material";

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
  const mapRef = useRef(null);
  const hasGotAccuratePosition = useRef(false);

  useEffect(() => {
    if (!navigator.geolocation) {
      console.log("Geolocation not supported");
      setIsLoading(false);
      return;
    }

    const success = (pos) => {
      const lat = pos.coords.latitude;
      const lng = pos.coords.longitude;
      const acc = pos.coords.accuracy;
      
      console.log(`📍 Location received: ${lat.toFixed(6)}, ${lng.toFixed(6)} (±${Math.round(acc)}m)`);
      
      // Only update if this is more accurate than what we have, or if we don't have a position yet
      // Accept position if accuracy is better than 100 meters, or it's the first position
      if (!hasGotAccuratePosition.current || acc < 100) {
        setPosition([lat, lng]);
        setAccuracy(Math.round(acc));
        
        // If we got good accuracy (< 50m), mark it and stop loading
        if (acc < 50) {
          hasGotAccuratePosition.current = true;
          setIsLoading(false);
          console.log(`✅ Accurate location acquired: ${lat.toFixed(6)}, ${lng.toFixed(6)} (±${Math.round(acc)}m)`);
        } else if (!hasGotAccuratePosition.current) {
          // First position received, but not very accurate - show it but keep trying
          setIsLoading(false);
        }
      }
    };

    const error = (err) => {
      console.log("Location error:", err.message);
      console.log("Using default position");
      setIsLoading(false);
    };

    // High accuracy tracking with longer timeout
    const options = { 
      enableHighAccuracy: true, 
      maximumAge: 0, // Don't use cached position - always get fresh location
      timeout: 30000 // Increased to 30 seconds to give GPS time to get accurate fix
    };

    // Get initial position
    navigator.geolocation.getCurrentPosition(success, error, options);
    
    // Watch for position updates to get better accuracy over time
    const watchId = navigator.geolocation.watchPosition(success, error, options);

    // Safety timeout - stop loading after 15 seconds even if we don't have great accuracy
    const safetyTimeout = setTimeout(() => {
      setIsLoading(false);
    }, 15000);

    return () => {
      navigator.geolocation.clearWatch(watchId);
      clearTimeout(safetyTimeout);
    };
  }, []);

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
        <Marker position={position} icon={createUserIcon()}>
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
              </small>
            </div>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}