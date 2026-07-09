import mongoose from "mongoose";

const floorSchema = new mongoose.Schema(
  {
    floorNumber: { type: Number, required: true },
    name: { type: String, default: "" },
    mapUrl: { type: String, default: "" },
  },
  { _id: false }
);

const tenantSchema = new mongoose.Schema(
  {
    buildingName: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    subscriptionStatus: {
      type: String,
      enum: ["Trial", "Active", "Suspended", "Cancelled"],
      default: "Trial",
    },
    floors: [floorSchema],
    settings: {
      allowGuests: { type: Boolean, default: true },
      requireAuth: { type: Boolean, default: false },
    },
  },
  { timestamps: true }
);

export default mongoose.model("Tenant", tenantSchema);
