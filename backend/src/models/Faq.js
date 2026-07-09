import mongoose from "mongoose";

const faqSchema = new mongoose.Schema(
  {
    tenantId: { type: mongoose.Schema.Types.ObjectId, ref: "Tenant", required: true },
    question: { type: String, required: true, trim: true },
    answer: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

faqSchema.index({ tenantId: 1 });

export default mongoose.model("Faq", faqSchema);
