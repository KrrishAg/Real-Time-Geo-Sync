import express from "express";
import cors from "cors";
import { Server } from "socket.io";

const app = express();
app.use(cors());

const httpServer = createServer(app);
const io = new Server({
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("User Connected:", socket.id);

  // Join a specific room based on Session ID
  socket.on("join-session", (sessionId) => {
    console.log("Session joined", sessionId);
    socket.join(sessionId);
  });

  // Listen for movement from Tracker
  socket.on("update-map", (data) => {
    // data: { sessionId, lat, lng, zoom }
    socket.to(data.sessionId).emit("Map-moved", {
      lat: data.lat,
      lng: data.lng,
      zoom: data.zoom,
    });
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 4000;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
