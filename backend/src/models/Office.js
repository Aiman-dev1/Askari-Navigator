import mongoose from "mongoose";

const officeSchema = new mongoose.Schema(
  {
    tenantId: { type: mongoose.Schema.Types.ObjectId, ref: "Tenant", required: true },
    name: { type: String, required: true, trim: true },
    floor: { type: String, required: true, trim: true }, // display label e.g. "4th Floor"
    floorNumber: { type: Number, default: null },
    room: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    category: {
      type: String,
      enum: ["office", "department", "utility", "conference", "other"],
      default: "office",
    },
    // Step-by-step wayfinding instructions
    directions: [{ type: String }],
  },
  { timestamps: true }
);

officeSchema.index({ tenantId: 1, name: 1 });
officeSchema.index({ name: "text", description: "text", room: "text" });

export default mongoose.model("Office", officeSchema);
