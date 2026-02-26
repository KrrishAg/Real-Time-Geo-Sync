import express from "express";
import http from "http";
import cors from "cors";
import { Server } from "socket.io";

const app = express();
app.use(cors({ origin: true, credentials: true }));
app.get("/health", (_, res) => res.json({ ok: true }));

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: true, credentials: true },
  transports: ["websocket"],
});

const sessions = new Map();

//  sessions = sessionId => {
//    trackerSocketId: string | null,
//    trackedSocketIds: Set<string>,
//    lastState: { seq, ts, center:{lat,lng}, zoom }
//  }

function getOrCreateSession(sessionId) {
  if (!sessions.has(sessionId)) {
    sessions.set(sessionId, {
      trackerSocketId: null,
      trackedSocketIds: new Set(),
      lastState: null,
    });
  }
  return sessions.get(sessionId);
}

io.on("connection", (socket) => {
  socket.data.sessionId = null;
  socket.data.role = null;

  socket.on("session:join", ({ sessionId, role }) => {
    try {
      if (!sessionId || !role) throw new Error("sessionId and role required");
      if (role !== "tracker" && role !== "tracked")
        throw new Error("Invalid role");

      console.log("SESSION JOIN: ", socket.id);
      
      const s = getOrCreateSession(sessionId);

      // Single tracker per session logic
      if (role === "tracker") {
        if (s.trackerSocketId && s.trackerSocketId !== socket.id) {
          socket.emit("error", {
            message: "Tracker already exists for this session.",
          });
          return;
        }
        s.trackerSocketId = socket.id;
      } else {
        s.trackedSocketIds.add(socket.id);
      }

      socket.data.sessionId = sessionId;
      socket.data.role = role;

      socket.join(sessionId);

      socket.emit("session:joined", {
        sessionId,
        role,
        trackerPresent: !!s.trackerSocketId,
        state: s.lastState, // send last known map state for instant sync
      });

      io.to(sessionId).emit("session:roles", {
        trackerSocketId: s.trackerSocketId,
        trackedCount: s.trackedSocketIds.size,
      });

      io.to(sessionId).emit("tracker:status", { present: !!s.trackerSocketId });
    } catch (e) {
      socket.emit("error", { message: e.message || "Join failed" });
    }
  });

  socket.on("map:state", (payload) => {
    const { sessionId, seq, ts, center, zoom } = payload || {};
    const s = sessionId ? sessions.get(sessionId) : null;
    if (!s) return;

    // Only tracker can broadcast the main map
    if (socket.id !== s.trackerSocketId) return;

    // Inout validation
    if (
      typeof seq !== "number" ||
      typeof ts !== "number" ||
      !center ||
      typeof center.lat !== "number" ||
      typeof center.lng !== "number" ||
      typeof zoom !== "number"
    ) {
      return;
    }

    s.lastState = { seq, ts, center, zoom };

    // Broadcasting only to tracked clients
    socket.to(sessionId).emit("map:state", s.lastState);
  });

  socket.on("disconnect", () => {
    const sessionId = socket.data.sessionId;
    const role = socket.data.role;
    if (!sessionId) return;

    const s = sessions.get(sessionId);
    if (!s) return;

    if (role === "tracker" && s.trackerSocketId === socket.id) {
      s.trackerSocketId = null;
      io.to(sessionId).emit("tracker:status", { present: false });
      io.to(sessionId).emit("session:roles", {
        trackerSocketId: null,
        trackedCount: s.trackedSocketIds.size,
      });
    }

    if (role === "tracked") {
      s.trackedSocketIds.delete(socket.id);
      io.to(sessionId).emit("session:roles", {
        trackerSocketId: s.trackerSocketId,
        trackedCount: s.trackedSocketIds.size,
      });
    }

    // Cleanup empty sessions
    if (!s.trackerSocketId && s.trackedSocketIds.size === 0) {
      sessions.delete(sessionId);
    }
  });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => console.log(`Socket server on: ${PORT}`));
