"use client";

import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import L from "leaflet";

const createUserIcon = () =>
  L.divIcon({
    className: "user-marker",
    html: `<div style="
      width: 18px; height: 18px;
      background: #1976d2;
      border: 3px solid white;
      border-radius: 50%;
      box-shadow: 0 0 6px rgba(25,118,210,0.6);
    "></div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });

function Recenter({ position }) {
  const map = useMap();
  useEffect(() => {
    if (position) map.setView(position, map.getZoom());
  }, [position, map]);
  return null;
}

export default function LiveMap({ initialPosition = [31.9522, 35.2332], initialZoom = 15 }) {
  const [position, setPosition] = useState(null);

  useEffect(() => {
    if (!navigator.geolocation) return alert("Geolocation API غير مدعوم");

    const success = (pos) => {
      const lat = pos.coords.latitude;
      const lng = pos.coords.longitude;
      setPosition([lat, lng]);
    };

    const error = (err) => console.error("Geolocation error:", err);

    const options = { enableHighAccuracy: true, maximumAge: 1000, timeout: 10000 };
    const watchId = navigator.geolocation.watchPosition(success, error, options);

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  return (
    <div style={{ height: "100vh", width: "100%" }}>
      <MapContainer center={position || initialPosition} zoom={initialZoom} style={{ height: "100%", width: "100%" }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {position && <Recenter position={position} />}
        {position && <Marker position={position} icon={createUserIcon()} />}
      </MapContainer>
    </div>
  );
}