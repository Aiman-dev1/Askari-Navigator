import ActivityLog from "../models/ActivityLog.js";

export async function getLogs(req, res, next) {
  try {
    const limit = Math.min(parseInt(req.query.limit) || 50, 200);
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const skip = (page - 1) * limit;

    let filter = {};

    if (req.user.role === "super_admin") {
      // Super admin sees all tenant_admin actions across all buildings
      filter = { actorRole: "tenant_admin" };
    } else if (req.user.role === "tenant_admin") {
      // Tenant admin sees user actions within their building only
      filter = { tenantId: req.user.tenantId, actorRole: "user" };
    } else {
      return res.status(403).json({ error: "Insufficient permissions" });
    }

    const [logs, total] = await Promise.all([
      ActivityLog.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      ActivityLog.countDocuments(filter),
    ]);

    res.json({
      total,
      page,
      totalPages: Math.ceil(total / limit),
      logs,
    });
  } catch (err) {
    next(err);
  }
}
