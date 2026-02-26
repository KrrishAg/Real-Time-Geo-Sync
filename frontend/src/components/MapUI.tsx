"use client";
import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { MapUIProps } from "../types/map";

export default function MapUI({ onMapReady }: MapUIProps) {
  return (
    <MapContainer
      center={[28.6139, 77.209]} // rn at Delhi
      zoom={14}
      style={{ height: "100%", width: "100%" }}
      zoomControl={false}
      whenReady={(e: any) => onMapReady(e.target)}
    >
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
    </MapContainer>
  );
}
