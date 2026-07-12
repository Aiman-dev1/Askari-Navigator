import mongoose from "mongoose";

const activityLogSchema = new mongoose.Schema(
  {
    // The tenant this log belongs to (null for super_admin actions)
    tenantId: { type: mongoose.Schema.Types.ObjectId, ref: "Tenant", default: null },

    // Actor info
    actorId:   { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    actorName: { type: String, required: true },
    actorRole: { type: String, enum: ["super_admin", "tenant_admin", "user"], required: true },

    // What happened
    action:  { type: String, required: true }, // e.g. "FAQ_CREATED", "OFFICE_DELETED"
    detail:  { type: String, default: "" },    // human-readable description

    // Optional reference to the affected resource
    resourceType: { type: String, default: null }, // "faq", "office", "building", etc.
    resourceId:   { type: mongoose.Schema.Types.ObjectId, default: null },
  },
  { timestamps: true }
);

// Auto-expire logs after 90 days to keep the collection lean
activityLogSchema.index({ createdAt: 1 }, { expireAfterSeconds: 60 * 60 * 24 * 90 });
activityLogSchema.index({ tenantId: 1, createdAt: -1 });
activityLogSchema.index({ actorRole: 1, createdAt: -1 });

export default mongoose.model("ActivityLog", activityLogSchema);
