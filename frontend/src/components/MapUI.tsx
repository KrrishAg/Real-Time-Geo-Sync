"use client";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { MapUIProps } from "../types/map";

function MapReadyEmitter({
  onMapReady,
}: {
  onMapReady: (map: unknown) => void;
}) {
  const map = useMap();
  // useMap() always returns the map instance synchronously inside MapContainer
  // We call onMapReady once
  const called = useRef(false);
  useEffect(() => {
    if (!called.current) {
      called.current = true;
      onMapReady(map);
    }
  }, [map, onMapReady]);
  return null;
}

import { useEffect, useRef } from "react";

export default function MapUI({ onMapReady }: MapUIProps) {
  return (
    <MapContainer
      center={[28.6139, 77.209]} //rn at delhi
      zoom={14}
      className="h-full w-full"
      zoomControl={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapReadyEmitter onMapReady={onMapReady} />
    </MapContainer>
  );
}
