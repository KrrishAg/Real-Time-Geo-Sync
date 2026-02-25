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
