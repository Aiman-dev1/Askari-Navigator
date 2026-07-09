import mongoose from "mongoose";

const chatRoomSchema = new mongoose.Schema(
  {
    tenantId: { type: mongoose.Schema.Types.ObjectId, ref: "Tenant", required: true },
    name: { type: String, required: true, trim: true },
    type: {
      type: String,
      enum: ["global", "floor", "match"], // match = private room from Shuffle Chat
      default: "global",
    },
    floorNumber: { type: Number, default: null },
    // For match rooms: the two paired users
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

chatRoomSchema.index({ tenantId: 1, type: 1 });

export default mongoose.model("ChatRoom", chatRoomSchema);
