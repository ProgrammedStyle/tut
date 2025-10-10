"use client";

/*import React, { useEffect, useState } from "react";
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
}*/

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import iconUrl from "leaflet/dist/images/marker-icon.png";
import iconShadowUrl from "leaflet/dist/images/marker-shadow.png";

// إعداد أيقونة الماركر
const DefaultIcon = L.icon({
  iconUrl,
  shadowUrl: iconShadowUrl,
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

const LiveTrackingMap = () => {
  const mapRef = useRef(null);
  const markerRef = useRef(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      // إنشاء الخريطة
      mapRef.current = L.map("map").setView([31.9539, 35.9106], 13);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(mapRef.current);

      // التأكد أن المتصفح يدعم الموقع
      if (navigator.geolocation) {
        // watchPosition لتتبع الموقع مباشرة
        navigator.geolocation.watchPosition(
          (position) => {
            const { latitude, longitude } = position.coords;

            // إذا الماركر موجود حدث موقعه، وإذا لا أضفه
            if (!markerRef.current) {
              markerRef.current = L.marker([latitude, longitude])
                .addTo(mapRef.current)
                .bindPopup("أنت هنا")
                .openPopup();
            } else {
              markerRef.current.setLatLng([latitude, longitude]);
            }

            // تحديث مركز الخريطة لمكان المستخدم
            mapRef.current.setView([latitude, longitude], 15);
          },
          (error) => {
            console.error("خطأ في الحصول على الموقع:", error);
          },
          {
            enableHighAccuracy: true,
            maximumAge: 1000,
            timeout: 5000,
          }
        );
      } else {
        alert("متصفحك لا يدعم خدمة تحديد الموقع.");
      }
    }
  }, []);

  return <div id="map" style={{ height: "500px", width: "100%" }}></div>;
};

export default LiveTrackingMap;