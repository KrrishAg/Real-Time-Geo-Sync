"use client";
import { useState } from "react";
import dynamic from "next/dynamic";

const MapSync = dynamic(() => import("../components/MapSync"), { ssr: false }); //dynamic import

export default function Home() {
  const [joined, setJoined] = useState(false);
  const [config, setConfig] = useState({ sessionId: "", role: "tracked" });

  if (joined) {
    return (
      <MapSync
        role={config.role as "tracker" | "tracked"}
        sessionId={config.sessionId}
      />
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Geo-Sync Lobby</h1>
        <input
          className="w-full p-2 border rounded mb-4"
          placeholder="Enter Room ID (e.g. travel-123)"
          onChange={(e) => setConfig({ ...config, sessionId: e.target.value })}
        />
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setConfig({ ...config, role: "tracker" })}
            className={`flex-1 p-2 rounded border ${config.role === "tracker" ? "bg-blue-600 text-white" : "bg-gray-50"}`}
          >
            Tracker (Master)
          </button>
          <button
            onClick={() => setConfig({ ...config, role: "tracked" })}
            className={`flex-1 p-2 rounded border ${config.role === "tracked" ? "bg-blue-600 text-white" : "bg-gray-50"}`}
          >
            Follower (Sync)
          </button>
        </div>
        <button
          onClick={() => config.sessionId && setJoined(true)}
          className="w-full bg-black text-white p-3 rounded-lg font-bold hover:bg-gray-800"
        >
          Join Session
        </button>
      </div>
    </div>
  );
}
