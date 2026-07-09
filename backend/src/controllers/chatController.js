import ChatRoom from "../models/ChatRoom.js";
import Message from "../models/Message.js";

// GET /api/v1/chat/rooms — global + floor rooms for the caller's building,
// plus any match rooms the caller belongs to
export async function listRooms(req, res, next) {
  try {
    const rooms = await ChatRoom.find({
      tenantId: req.user.tenantId,
      $or: [{ type: { $in: ["global", "floor"] } }, { participants: req.user.sub }],
    }).sort({ type: 1, floorNumber: 1 });
    res.json({ count: rooms.length, rooms });
  } catch (err) {
    next(err);
  }
}

// GET /api/v1/chat/rooms/:roomId/messages?before=<ISO>&limit=50 — history, newest last
export async function listMessages(req, res, next) {
  try {
    const room = await ChatRoom.findOne({
      _id: req.params.roomId,
      tenantId: req.user.tenantId,
    });
    if (!room) return res.status(404).json({ error: "Room not found" });
    if (room.type === "match" && !room.participants.some((p) => p.toString() === req.user.sub)) {
      return res.status(403).json({ error: "Not a participant of this room" });
    }

    const limit = Math.min(parseInt(req.query.limit, 10) || 50, 200);
    const filter = { roomId: room._id };
    if (req.query.before) filter.createdAt = { $lt: new Date(req.query.before) };

    const messages = await Message.find(filter).sort({ createdAt: -1 }).limit(limit);
    res.json({ count: messages.length, messages: messages.reverse() });
  } catch (err) {
    next(err);
  }
}

// POST /api/v1/chat/messages/:id/report — flag a message for moderation
export async function reportMessage(req, res, next) {
  try {
    const message = await Message.findOneAndUpdate(
      { _id: req.params.id, tenantId: req.user.tenantId },
      { $set: { reported: true } },
      { new: true }
    );
    if (!message) return res.status(404).json({ error: "Message not found" });
    res.json({ reported: true });
  } catch (err) {
    next(err);
  }
}

// GET /api/v1/chat/reported  (tenant admin) — moderation queue
export async function listReported(req, res, next) {
  try {
    const messages = await Message.find({
      tenantId: req.user.tenantId,
      reported: true,
    }).sort({ createdAt: -1 });
    res.json({ count: messages.length, messages });
  } catch (err) {
    next(err);
  }
}

// DELETE /api/v1/chat/messages/:id  (tenant admin) — remove a message
export async function deleteMessage(req, res, next) {
  try {
    const message = await Message.findOneAndDelete({
      _id: req.params.id,
      tenantId: req.user.tenantId,
    });
    if (!message) return res.status(404).json({ error: "Message not found" });
    res.json({ deleted: true });
  } catch (err) {
    next(err);
  }
}
