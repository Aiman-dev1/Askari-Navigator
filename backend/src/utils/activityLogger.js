import ActivityLog from "../models/ActivityLog.js";
import { sendRealtimeLog } from "../sockets/chat.js";

/**
 * Fire-and-forget activity logger.
 * Never throws — logging failures must not break the main request.
 *
 * @param {object} req     - Express request (provides req.user)
 * @param {string} action  - Enum-style string: "FAQ_CREATED", "OFFICE_DELETED", etc.
 * @param {string} detail  - Human-readable description shown in the UI
 * @param {object} [opts]  - Optional: { resourceType, resourceId }
 */
export function logActivity(req, action, detail, opts = {}) {
  const user = req.user;
  if (!user) return; // unauthenticated calls are not logged

  ActivityLog.create({
    tenantId:     user.tenantId || null,
    actorId:      user.sub,
    actorName:    user.username || "Unknown",
    actorRole:    user.role,
    action,
    detail,
    resourceType: opts.resourceType || null,
    resourceId:   opts.resourceId   || null,
  }).then((log) => {
    sendRealtimeLog(log);
  }).catch((err) => {
    console.error("[ActivityLog] Failed to write log:", err.message);
  });
}
