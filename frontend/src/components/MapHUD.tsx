"use client";

import { HUDProps } from "../types/map";

export function MapHUD({
  role,
  hud,
  connStatus,
  trackerPresent,
  isLocked,
  onLock,
}: HUDProps) {
  const badge =
    role === "tracker"
      ? { text: "Broadcasting (Tracker)", bg: "bg-sky-500" }
      : {
          text: isLocked ? "Syncing (Tracked)" : "Local View (Tracked)",
          bg: "bg-green-500",
        };

  return (
    <div className="absolute top-4 left-4 z-[1000] p-4 rounded-xl bg-black/70 backdrop-blur-md text-white min-w-[260px] shadow-2xl border border-white/10">
      <div
        className={`inline-block px-3 py-1 rounded-full text-[10px] font-bold mb-3 uppercase tracking-wider ${badge.bg}`}
      >
        {badge.text}
      </div>

      <div className="font-mono text-xs space-y-1 opacity-90">
        <div>Lat: {hud.lat.toFixed(7)}</div>
        <div>Lng: {hud.lng.toFixed(7)}</div>
        <div>Zoom: {hud.zoom.toFixed(2)}</div>
        <div className="pt-2 border-t border-white/10 mt-2 flex justify-between">
          <span>Status:</span>
          <span
            className={
              connStatus === "Connected" ? "text-green-400" : "text-red-400"
            }
          >
            {connStatus}
          </span>
        </div>
        <div className="flex justify-between">
          <span>Tracker:</span>
          <span>{trackerPresent ? "✅ Online" : "❌ Missing"}</span>
        </div>
      </div>

      {role === "tracked" && (
        <div className="mt-4 flex gap-2">
          <button
            onClick={() => onLock(true)}
            className={`flex-1 text-[10px] font-bold py-2 rounded uppercase transition ${isLocked ? "bg-white text-black" : "bg-white/20 hover:bg-white/30"}`}
          >
            Re-sync
          </button>
          <button
            onClick={() => onLock(false)}
            className={`flex-1 text-[10px] font-bold py-2 rounded uppercase transition ${!isLocked ? "bg-white text-black" : "bg-white/20 hover:bg-white/30"}`}
          >
            Free Pan
          </button>
        </div>
      )}
    </div>
  );
}
