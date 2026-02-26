"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Home() {
  const router = useRouter();
  const [sessionId, setSessionId] = useState("");
  const [role, setRole] = useState<"tracker" | "tracked">("tracker");

  return (
    <main className="p-6 max-w-130 mx-auto mt-20 bg-white shadow-xl rounded-2xl border border-gray-100">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        Real-Time Geo-Sync
      </h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-600 mb-1">
            Session ID
          </label>
          <input
            value={sessionId}
            onChange={(e) => setSessionId(e.target.value)}
            placeholder="e.g. room-123"
            className="w-full text-black p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-600 mb-1">
            Role
          </label>
          <div className="flex gap-3 mt-2">
            <button
              onClick={() => setRole("tracker")}
              className={`flex-1 p-3 rounded-lg font-medium transition-all border ${
                role === "tracker"
                  ? "bg-blue-600 text-white border-blue-600 shadow-md"
                  : "bg-gray-50 text-gray-500 border-gray-200 opacity-60 hover:opacity-100"
              }`}
            >
              Tracker
            </button>
            <button
              onClick={() => setRole("tracked")}
              className={`flex-1 p-3 rounded-lg font-medium transition-all border ${
                role === "tracked"
                  ? "bg-blue-600 text-white border-blue-600 shadow-md"
                  : "bg-gray-50 text-gray-500 border-gray-200 opacity-60 hover:opacity-100"
              }`}
            >
              Tracked
            </button>
          </div>
        </div>

        <button
          onClick={() =>
            router.push(
              `/session/${encodeURIComponent(sessionId)}?role=${role}`,
            )
          }
          disabled={!sessionId}
          className="w-full py-4 mt-4 bg-gray-900 text-white font-bold rounded-xl hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors shadow-lg"
        >
          Join Session
        </button>
      </div>
    </main>
  );
}
