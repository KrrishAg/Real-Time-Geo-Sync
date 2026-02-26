"use client";
import { useEffect, useRef } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Map } from "leaflet";
import { MapUIProps } from "../types/map";

export default function MapUI({ onMapReady }: MapUIProps) {
  const mapRef = useRef<Map | null>(null);

  // To signal readiness once the ref is attached
  useEffect(() => {
    if (mapRef.current) {
      onMapReady(mapRef.current);
    }
  }, [onMapReady]);

  return (
    <MapContainer
      center={[28.6139, 77.209]} //rn at delhi
      zoom={14}
      className="h0full w-full"
      zoomControl={false}
      ref={mapRef}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
    </MapContainer>
  );
}
