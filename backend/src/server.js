import "dotenv/config";
import http from "http";
import { Server } from "socket.io";

import app from "./app.js";
import { connectDB } from "./config/db.js";
import { initChatSockets } from "./sockets/chat.js";
import { ensureFloorPlanFiles } from "./utils/floorplans.js";

const PORT = process.env.PORT || 5000;

async function main() {
  if (!process.env.JWT_SECRET) {
    console.error("JWT_SECRET is not set. Copy backend/.env.example to backend/.env first.");
    process.exit(1);
  }

  await connectDB();
  ensureFloorPlanFiles(); // fresh containers start with an empty uploads dir

  const server = http.createServer(app);
  const io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL || "http://localhost:5173",
      credentials: true,
    },
  });
  initChatSockets(io);

  server.listen(PORT, () => {
    console.log(`TowerNav API listening on http://localhost:${PORT}`);
  });
}

main().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});

// Trigger restart
