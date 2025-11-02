import React, { useEffect } from "react";
import L from "leaflet";
import { io } from "socket.io-client";
import "leaflet/dist/leaflet.css";
import "./style/MapComponent.css";

const MapComponent = ({ userType }) => {
  useEffect(() => {
    // Prevent duplicate map initialization
    const existingMap = L.DomUtil.get("map");
    if (existingMap) existingMap._leaflet_id = null;

    // ✅ Initialize socket connection
    const socket = io("http://localhost:5001", {
      transports: ["websocket"],
      withCredentials: false,
    });

    // ✅ Initialize map
    const map = L.map("map", {
      center: [19.1334, 72.9133],
      zoom: 16,
      zoomControl: true,
      scrollWheelZoom: true,
      dragging: true,
      touchZoom: true,
      doubleClickZoom: true,
      tap: false, // fixes mobile single-finger drag
    });

    // ✅ Add base layer
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
    }).addTo(map);

    // ✅ Ensure map interaction works everywhere
    map.dragging.enable();
    map.scrollWheelZoom.enable();
    map.touchZoom.enable();
    map.doubleClickZoom.enable();

    // ✅ Custom car icon
    const carIcon = L.icon({
      iconUrl: "/img/gps_pointer2.png",
      iconSize: [40, 60],
      iconAnchor: [20, 40],
      popupAnchor: [0, -35],
    });

    const driverMarkers = {};

    // ✅ Listen for driver updates
    socket.on("driversUpdate", (activeDrivers) => {
      for (const plate in activeDrivers) {
        const { lat, lng } = activeDrivers[plate];
        if (driverMarkers[plate]) {
          driverMarkers[plate].setLatLng([lat, lng]);
        } else {
          driverMarkers[plate] = L.marker([lat, lng], { icon: carIcon })
            .addTo(map)
            .bindPopup(`🚗 Driver: ${plate}`);
        }
      }

      for (const plate in driverMarkers) {
        if (!activeDrivers[plate]) {
          map.removeLayer(driverMarkers[plate]);
          delete driverMarkers[plate];
        }
      }
    });

    // ✅ Driver sends GPS
    let interval;
    if (userType === "driver" && navigator.geolocation) {
      const plate = localStorage.getItem("rollNoOrPlate");

      const sendLocation = () => {
        navigator.geolocation.getCurrentPosition((pos) => {
          socket.emit("driverLocation", {
            plate,
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });
        });
      };

      sendLocation();
      interval = setInterval(sendLocation, 5000);
    }

    // ✅ Cleanup
    return () => {
      if (interval) clearInterval(interval);
      socket.disconnect();
      map.remove();
    };
  }, [userType]);

  return <div id="map"></div>;
};

export default MapComponent;
