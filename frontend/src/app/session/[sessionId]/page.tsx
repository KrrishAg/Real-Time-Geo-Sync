"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useRef, useState, use } from "react";
import { useSearchParams } from "next/navigation";
import { getSocket } from "@/src/lib/socket";
import { MapHUD } from "@/src/components/MapHUD";

// Import MapUI with SSR disabled because Leaflet needs 'window'
const MapUI = dynamic(() => import("@/src/components/MapUI"), {
  ssr: false,
  loading: () => (
    <div className="h-screen w-screen bg-gray-100 flex items-center justify-center font-mono">
      Initializing Map...
    </div>
  ),
});

export default function SessionPage({
  params,
}: {
  params: Promise<{ sessionId: string }>;
}) {
  const { sessionId } = use(params);
  const sp = useSearchParams();
  const role = (sp.get("role") as "tracker" | "tracked") || "tracked";

  const [connStatus, setConnStatus] = useState<
    "Searching" | "Connected" | "Disconnected"
  >("Searching");
  const [trackerPresent, setTrackerPresent] = useState(false);
  const [hud, setHud] = useState({ lat: 0, lng: 0, zoom: 0 });
  const [isLocked, setIsLocked] = useState(role === "tracked");

  const mapRef = useRef<any>(null);
  const lastAppliedSeq = useRef<number>(-1);
  const seqRef = useRef<number>(0);
  const socket = useMemo(() => getSocket(), []);

  function applyRemoteState(state: any, force: boolean) {
    if (!mapRef.current) return;
    if (!force && (state.seq <= lastAppliedSeq.current || !isLocked)) return;

    lastAppliedSeq.current = state.seq;
    mapRef.current.setView([state.center.lat, state.center.lng], state.zoom, {
      animate: false,
    });
    setHud({ lat: state.center.lat, lng: state.center.lng, zoom: state.zoom });
  }

  useEffect(() => {
    socket.emit("session:join", { sessionId, role });

    socket.on("connect", () => setConnStatus("Connected"));
    socket.on("disconnect", () => setConnStatus("Disconnected"));
    socket.on("session:joined", (msg) => {
      setTrackerPresent(msg.trackerPresent);
      if (msg.state && role === "tracked") applyRemoteState(msg.state, true);
    });
    socket.on("tracker:status", ({ present }) => setTrackerPresent(present));
    socket.on("map:state", (state) => {
      if (role === "tracked") applyRemoteState(state, false);
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("session:joined");
      socket.off("tracker:status");
      socket.off("map:state");
    };
  }, [sessionId, role, socket, isLocked]);

  function bindMap(map: any) {
    mapRef.current = map;
    map.on("move", () => {
      const c = map.getCenter();
      const z = map.getZoom();
      setHud({ lat: c.lat, lng: c.lng, zoom: z });
      if (role === "tracker") {
        emitState({
          seq: ++seqRef.current,
          ts: Date.now(),
          center: { lat: c.lat, lng: c.lng },
          zoom: z,
        });
      }
    });
    map.on("dragstart", () => {
      if (role === "tracked") setIsLocked(false);
    });
  }

  return (
    <main className="h-screen w-screen relative bg-slate-900 overflow-hidden">
      <MapUI onMapReady={bindMap} />
      <MapHUD
        role={role}
        hud={hud}
        connStatus={connStatus}
        trackerPresent={trackerPresent}
        isLocked={isLocked}
        onLock={setIsLocked}
      />
    </main>
  );
}
