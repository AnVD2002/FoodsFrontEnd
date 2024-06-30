import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "./MiniMap.css";
import "leaflet/dist/leaflet.css";
import { Icon } from "leaflet";
const MiniMap = () => {
  const position = [20.9815, 105.8168];
  const icon = new Icon({
    iconUrl:
      "https://th.bing.com/th/id/R.98930f0bb073c0fa078eecf278c1b858?rik=k4O1WmhQCDkb%2bA&riu=http%3a%2f%2fwww.clipartbest.com%2fcliparts%2fyTk%2fLXp%2fyTkLXp8Lc.png&ehk=9pHjuqlKXA%2fEKq2Wal7U%2boUgkzJd4Q6WX6yemDgaB7w%3d&risl=&pid=ImgRaw&r=0",
    iconSize: [38, 38],
  });

  return (
    <MapContainer center={position} zoom={15} scrollWheelZoom={false}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <Marker position={position} icon={icon}>
        {" "}
        {/* Cập nhật tọa độ cho Marker */}
        <Popup>This is my home.</Popup>
      </Marker>
    </MapContainer>
  );
};

export default MiniMap;
