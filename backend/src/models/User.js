import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    // null for super admins (they are not scoped to a building)
    tenantId: { type: mongoose.Schema.Types.ObjectId, ref: "Tenant", default: null },
    username: { type: String, required: true, trim: true },
    email: { type: String, lowercase: true, trim: true },
    passwordHash: { type: String, select: false },
    role: {
      type: String,
      enum: ["super_admin", "tenant_admin", "user"],
      default: "user",
    },
    isGuest: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Username must be unique within a building
userSchema.index({ tenantId: 1, username: 1 }, { unique: true });
userSchema.index(
  { tenantId: 1, email: 1 },
  { unique: true, partialFilterExpression: { email: { $type: "string" } } }
);

userSchema.methods.setPassword = async function (password) {
  this.passwordHash = await bcrypt.hash(password, 10);
};

userSchema.methods.comparePassword = function (password) {
  return bcrypt.compare(password, this.passwordHash);
};

export default mongoose.model("User", userSchema);
