import { Eye, LinkIcon, Target } from "lucide-react";
import { useEffect, useState } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import { io, Socket } from "socket.io-client";
import MapController from "./MapController";
import { MapMoveData } from "../types/map";

interface MapSyncProps {
  role: "tracker" | "tracked";
  sessionId: string;
}

export default function MapSync({ role, sessionId }: MapSyncProps) {
  //assigning random coords for testing purpose
  const [coords, setCoords] = useState({ lat: 51.505, lng: -0.09, zoom: 13 });
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    // Backend URL
    const s = io("http://localhost:4000");

    s.on("connect", () => {
      console.log("Connected to server");
      s.emit("join-session", sessionId);
    });

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSocket(s);

    return () => {
      s.disconnect();
    };
  }, [sessionId]);

  const handleMapMove = (data: MapMoveData) => {
    setCoords(data);
    socket?.emit("update-map", { ...data, sessionId });
  };

  return (
    <div className="relative h-screen w-full">
      {/* HUD Overlay */}
      <div className="absolute top-4 right-4 z-1000 bg-white p-4 rounded-lg shadow-xl border border-gray-200 min-w-50">
        <div className="flex items-center gap-2 mb-2">
          {role === "tracker" ? (
            <Target className="text-red-500" />
          ) : (
            <Eye className="text-blue-500" />
          )}
          <span className="font-bold uppercase text-sm tracking-widest">
            {role} Mode
          </span>
        </div>
        <div className="text-xs text-gray-600 font-mono">
          <p>LAT: {coords.lat.toFixed(4)}</p>
          <p>LNG: {coords.lng.toFixed(4)}</p>
          <p>ZOOM: {coords.zoom}</p>
        </div>
        <div className="mt-2 pt-2 border-t flex items-center gap-2 text-[10px] text-gray-400">
          <LinkIcon size={12} /> ID: {sessionId}
        </div>
      </div>
      <MapContainer
        center={[coords.lat, coords.lng]}
        zoom={coords.zoom}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {socket && (
          <MapController
            role={role}
            sessionId={sessionId}
            socket={socket}
            onMove={handleMapMove}
          />
        )}
      </MapContainer>
    </div>
  );
}
