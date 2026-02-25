import { useEffect } from "react";
import { useMap, useMapEvents } from "react-leaflet";

interface MapControllerProps {
  role: "tracker" | "tracked";
  sessionId: string;
  socket: any;
  onMove: (data: { lat: number; lng: number; zoom: number }) => void;
}

export default function MapController({
  role,
  sessionId,
  socket,
  onMove,
}: MapControllerProps) {
  const map = useMap();

  // for Tracked: who is following
  useEffect(() => {
    if (role === "tracked" && socket) {
      socket.on(
        "map-moved",
        (data: { lat: number; lng: number; zoom: number }) => {
          map.setView([data.lat, data.lng], data.zoom);
        },
      );
    }
    return () => socket?.off("map-moved");
  }, [role, socket, map]);

  // for Tracker: who emits the movements
  useMapEvents({
    moveend: () => {
      if (role === "tracker") {
        const center = map.getCenter();
        const zoom = map.getZoom();
        onMove({ lat: center.lat, lng: center.lng, zoom });
      }
    },
  });

  return null;
}
