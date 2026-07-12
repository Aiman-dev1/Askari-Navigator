import { verifyToken } from "../utils/jwt.js";
import { cleanMessage } from "../utils/profanity.js";
import ChatRoom from "../models/ChatRoom.js";
import Message from "../models/Message.js";

// Shuffle Chat queue (scope doc §2C): one waiting user per tenant.
// tenantId -> { socketId, userId, username }
const matchQueue = new Map();
let globalIo = null;

function socketRoomName(tenantId, roomId) {
  return `${tenantId}:${roomId}`;
}

export function sendRealtimeLog(log) {
  if (!globalIo) return;
  if (log.actorRole === "tenant_admin") {
    globalIo.to("super_admins").emit("new_log", log);
  } else if (log.actorRole === "user") {
    if (log.tenantId) {
      globalIo.to(`tenant:${log.tenantId.toString()}:admins`).emit("new_log", log);
    }
  }
}

export function initChatSockets(io) {
  globalIo = io;
  // Authenticate every socket connection with the same JWT used by the REST API
  io.use((socket, next) => {
    const token =
      socket.handshake.auth?.token || socket.handshake.headers.authorization?.slice(7);
    if (!token) return next(new Error("Authentication required"));
    try {
      socket.user = verifyToken(token);
      if (!socket.user.tenantId && socket.user.role !== "super_admin") {
        return next(new Error("Socket connection requires a tenant user or super admin"));
      }
      next();
    } catch {
      next(new Error("Invalid or expired token"));
    }
  });

  io.on("connection", (socket) => {
    const { tenantId, sub: userId, username, role } = socket.user;

    // Join specific real-time log channels based on role
    if (role === "super_admin") {
      socket.join("super_admins");
    } else {
      socket.join(`tenant:${tenantId}`);
      if (role === "tenant_admin") {
        socket.join(`tenant:${tenantId}:admins`);
      }
    }

    // --- Room chat -------------------------------------------------------

    socket.on("join_room", async (roomId, ack) => {
      try {
        const room = await ChatRoom.findOne({ _id: roomId, tenantId });
        if (!room) return ack?.({ error: "Room not found" });
        if (
          room.type === "match" &&
          !room.participants.some((p) => p.toString() === userId)
        ) {
          return ack?.({ error: "Not a participant of this room" });
        }

        socket.join(socketRoomName(tenantId, room._id));
        socket.to(socketRoomName(tenantId, room._id)).emit("user_joined", { username, roomId });
        ack?.({ ok: true, room: { id: room._id, name: room.name, type: room.type } });
      } catch (err) {
        ack?.({ error: err.message });
      }
    });

    socket.on("leave_room", (roomId) => {
      socket.leave(socketRoomName(tenantId, roomId));
      socket.to(socketRoomName(tenantId, roomId)).emit("user_left", { username, roomId });
    });

    // --- Typing indicator ---------------------------------------------

    socket.on("typing", (roomId) => {
      socket.to(socketRoomName(tenantId, roomId)).emit("user_typing", { username, roomId });
    });

    socket.on("stop_typing", (roomId) => {
      socket
        .to(socketRoomName(tenantId, roomId))
        .emit("user_stopped_typing", { username, roomId });
    });

    socket.on("send_message", async ({ roomId, message }, ack) => {
      try {
        const text = cleanMessage((message || "").trim());
        if (!text) return ack?.({ error: "Message is empty" });

        const room = await ChatRoom.findOne({ _id: roomId, tenantId });
        if (!room) return ack?.({ error: "Room not found" });

        const saved = await Message.create({
          tenantId,
          roomId: room._id,
          senderId: userId,
          senderName: username,
          message: text,
        });

        const payload = {
          id: saved._id,
          roomId: room._id,
          sender: username,
          senderId: userId,
          message: saved.message,
          createdAt: saved.createdAt,
        };
        io.to(socketRoomName(tenantId, room._id)).emit("new_message", payload);
        ack?.({ ok: true, message: payload });
      } catch (err) {
        ack?.({ error: err.message });
      }
    });

    // --- Shuffle Chat / random matchmaking -------------------------------

    socket.on("random_match", async (ack) => {
      try {
        const waiting = matchQueue.get(tenantId);

        // No one waiting (or the waiting user is ourselves / disconnected) → queue up
        const waitingSocket = waiting && io.sockets.sockets.get(waiting.socketId);
        if (!waitingSocket || waiting.userId === userId) {
          matchQueue.set(tenantId, { socketId: socket.id, userId, username });
          return ack?.({ status: "waiting" });
        }

        // Pair found → create a private match room for the two users
        matchQueue.delete(tenantId);
        const room = await ChatRoom.create({
          tenantId,
          name: `Shuffle: ${waiting.username} & ${username}`,
          type: "match",
          participants: [waiting.userId, userId],
        });

        const roomName = socketRoomName(tenantId, room._id);
        socket.join(roomName);
        waitingSocket.join(roomName);

        const base = { roomId: room._id, roomName: room.name };
        socket.emit("match_found", { ...base, partner: waiting.username });
        waitingSocket.emit("match_found", { ...base, partner: username });
        ack?.({ status: "matched", roomId: room._id, partner: waiting.username });
      } catch (err) {
        ack?.({ error: err.message });
      }
    });

    socket.on("cancel_match", (ack) => {
      const waiting = matchQueue.get(tenantId);
      if (waiting?.socketId === socket.id) matchQueue.delete(tenantId);
      ack?.({ ok: true });
    });

    socket.on("disconnect", () => {
      const waiting = matchQueue.get(tenantId);
      if (waiting?.socketId === socket.id) matchQueue.delete(tenantId);
    });
  });
}
