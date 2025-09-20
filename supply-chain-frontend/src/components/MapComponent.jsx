import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const position = [28.6139, 77.2090]; // Example: Delhi

const MapComponent = () => {
  return (
    <MapContainer center={position} zoom={5} scrollWheelZoom={true} className="map-container">
      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={position}>
        <Popup>Shipment Location</Popup>
      </Marker>
    </MapContainer>
  );
};

export default MapComponent;
