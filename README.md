# Real-Time Geo-Sync 🗺️

A real-time map synchronization app where a **Tracker** controls the map view and all **Tracked** participants follow along live — across any device, anywhere in the world.

Built with Next.js, Socket.io, and Leaflet.

---

## How It Works

1. A **Tracker** creates or joins a session with a session ID
2. **Tracked** users join the same session ID
3. As the Tracker pans and zooms the map, every Tracked user's map updates in real time
4. Tracked users can break free with **Free Pan** mode and re-sync anytime with **Re-sync**

---

## Features

- Real-time map sync via WebSockets (Socket.io)
- Session-based rooms — multiple independent sessions supported simultaneously
- Single tracker per session, unlimited tracked participants
- Free Pan / Re-sync toggle for tracked users
- Live HUD showing coordinates, zoom level, connection status, and tracker presence
- Instant state sync on join — tracked users immediately see the tracker's current map position
- Graceful reconnection handling
- Auto-cleanup of empty sessions on the backend

---

## Tech Stack

| Layer     | Technology                          |
| --------- | ----------------------------------- |
| Frontend  | Next.js, TypeScript |
| Map       | Leaflet + React-Leaflet             |
| Real-time | Socket.io (WebSocket)     |
| Styling   | Tailwind CSS                        |
| Backend   | Node.js + Express + Socket.io       |

---

## Project Structure

This project uses two separate repositories:

```
# Frontend
frontend/
├── src/
│   ├── app/
│   │   ├── page.tsx                  # Home — session join screen
│   │   └── session/[sessionId]/
│   │       └── page.tsx              # Session map page
│   ├── components/
│   │   ├── MapUI.tsx                 # Leaflet map wrapper
│   │   └── MapHUD.tsx                # Overlay HUD (coords, status, controls)
│   ├── lib/
│   │   ├── socket.ts                 # Singleton socket client
│   │   └── leafletFix.ts             # Leaflet default icon fix
│   └── types/
│       └── map.ts                    # Shared TypeScript types
├── next.config.ts
└── package.json

# Backend
backend/
├── index.js                          # Express + Socket.io server
└── package.json
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### 1. Clone the repos

```bash
# Frontend
git clone 
cd frontend
npm install

# Backend
git clone 
cd backend
npm install
```

### 2. Environment variables

In the `frontend` directory, create a `.env.local` file:

```env
NEXT_PUBLIC_SOCKET_URL=http://localhost:4000
```

### 3. Run the backend

```bash
cd backend
npm start
# Server running on port 4000
```

### 4. Run the frontend

```bash
cd frontend
npm run dev
# App running on http://localhost:3000
```

### 5. Test it

1. Open `http://localhost:3000` in two browser tabs
2. In both tabs, enter the same **Session ID** (e.g. `room-123`)
3. Set one tab to **Tracker** and the other to **Tracked**
4. Click **Join Session** in both
5. Pan/zoom the map in the Tracker tab — the Tracked tab will follow in real time

---

## Deployment

The app is deployed on:

- **Frontend** → [Vercel](https://vercel.com) — [Live Link](https://real-time-geo-sync.vercel.app/) 
- **Backend** → [Render](https://render.com) — persistent WebSocket support on free tier

---

## Socket Events

### Client → Server

| Event          | Payload                                | Description                          |
| -------------- | -------------------------------------- | ------------------------------------ |
| `session:join` | `{ sessionId, role }`                  | Join a session as tracker or tracked |
| `map:state`    | `{ sessionId, seq, ts, center, zoom }` | Tracker broadcasts current map state |

### Server → Client

| Event            | Payload                                      | Description                                   |
| ---------------- | -------------------------------------------- | --------------------------------------------- |
| `session:joined` | `{ sessionId, role, trackerPresent, state }` | Confirms join, sends last known map state     |
| `map:state`      | `{ seq, ts, center, zoom }`                  | Broadcast to tracked clients on map move      |
| `tracker:status` | `{ present }`                                | Notifies when tracker connects or disconnects |
| `session:roles`  | `{ trackerSocketId, trackedCount }`          | Current session participant info              |
| `error`          | `{ message }`                                | Join or validation error                      |

---

## Environment Variables

| Variable                 | Required    | Description                                   |
| ------------------------ | ----------- | --------------------------------------------- |
| `NEXT_PUBLIC_SOCKET_URL` | ✅ Frontend | Full URL of the Socket.io backend             |
| `PORT`                   | ❌ Backend  | Port for the backend server (default: `4000`) |

---

## Known Limitations

- One tracker per session — a second tracker attempting to join will be rejected
- Render free tier has cold start delays after inactivity
- No authentication — anyone with a session ID can join as tracked
- Map tiles are served by OpenStreetMap — subject to their usage policy for high traffic
