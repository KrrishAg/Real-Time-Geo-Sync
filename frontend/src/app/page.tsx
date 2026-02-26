"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Home() {
  const router = useRouter();
  const [sessionId, setSessionId] = useState("");
  const [role, setRole] = useState<"tracker" | "tracked">("tracker");

  return (
    <main style={{ padding: 24, maxWidth: 520 }}>
      <h2>Real-Time Geo-Sync</h2>

      <label>Session ID</label>
      <input
        value={sessionId}
        onChange={(e) => setSessionId(e.target.value)}
        placeholder="e.g. room-123"
        style={{ width: "100%", padding: 10, margin: "8px 0 16px" }}
      />

      <label>Role</label>
      <div style={{ display: "flex", gap: 12, margin: "8px 0 16px" }}>
        <button
          onClick={() => setRole("tracker")}
          style={{ padding: 10, opacity: role === "tracker" ? 1 : 0.6 }}
        >
          Tracker
        </button>
        <button
          onClick={() => setRole("tracked")}
          style={{ padding: 10, opacity: role === "tracked" ? 1 : 0.6 }}
        >
          Tracked
        </button>
      </div>

      <button
        onClick={() =>
          router.push(`/session/${encodeURIComponent(sessionId)}?role=${role}`)
        }
        disabled={!sessionId}
        style={{ padding: 12, width: "100%" }}
      >
        Join
      </button>
    </main>
  );
}
