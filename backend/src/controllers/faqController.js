import Faq from "../models/Faq.js";
import Office from "../models/Office.js";
import Tenant from "../models/Tenant.js";
import { verifyToken } from "../utils/jwt.js";
import { logActivity } from "../utils/activityLogger.js";
import Groq from "groq-sdk";

// Words too common to be useful when matching a question against FAQs
const STOPWORDS = new Set([
  "where", "is", "the", "a", "an", "of", "to", "in", "on", "at",
  "what", "when", "how", "who", "which", "can", "i", "do", "does",
  "are", "find", "get", "located", "please", "there", "any", "have",
  "has", "my", "your", "with", "for", "and", "or", "many", "much",
]);

function keywords(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w && !STOPWORDS.has(w));
}

// GET /api/v1/faqs — all FAQs for the caller's building
export async function listFaqs(req, res, next) {
  try {
    const faqs = await Faq.find({ tenantId: req.user.tenantId }).sort({ createdAt: 1 });
    res.json({ count: faqs.length, faqs });
  } catch (err) {
    next(err);
  }
}

// POST /api/v1/faqs  (tenant admin)
export async function createFaq(req, res, next) {
  try {
    const { question, answer } = req.body;
    if (!question || !answer) {
      return res.status(400).json({ error: "question and answer are required" });
    }
    const faq = await Faq.create({ tenantId: req.user.tenantId, question, answer });
    logActivity(req, "FAQ_CREATED", `Added FAQ: "${question}"`, { resourceType: "faq", resourceId: faq._id });
    res.status(201).json({ faq });
  } catch (err) {
    next(err);
  }
}

// PUT /api/v1/faqs/:id  (tenant admin)
export async function updateFaq(req, res, next) {
  try {
    const { question, answer } = req.body;
    const faq = await Faq.findOneAndUpdate(
      { _id: req.params.id, tenantId: req.user.tenantId },
      { $set: { question, answer } },
      { new: true, runValidators: true }
    );
    if (!faq) return res.status(404).json({ error: "FAQ not found" });
    logActivity(req, "FAQ_UPDATED", `Updated FAQ: "${faq.question}"`, { resourceType: "faq", resourceId: faq._id });
    res.json({ faq });
  } catch (err) {
    next(err);
  }
}

// DELETE /api/v1/faqs/:id  (tenant admin)
export async function deleteFaq(req, res, next) {
  try {
    const faq = await Faq.findOneAndDelete({ _id: req.params.id, tenantId: req.user.tenantId });
    if (!faq) return res.status(404).json({ error: "FAQ not found" });
    logActivity(req, "FAQ_DELETED", `Deleted FAQ: "${faq.question}"`, { resourceType: "faq", resourceId: faq._id });
    res.json({ deleted: true });
  } catch (err) {
    next(err);
  }
}

// POST /api/v1/faqs/bulk-delete (tenant admin)
export async function bulkDeleteFaqs(req, res, next) {
  try {
    const { ids } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ error: "ids must be a non-empty array" });
    }

    const result = await Faq.deleteMany({
      _id: { $in: ids },
      tenantId: req.user.tenantId,
    });

    logActivity(
      req,
      "FAQS_BULK_DELETED",
      `Bulk deleted ${result.deletedCount} FAQs`,
      { resourceType: "faq" }
    );

    res.json({ deletedCount: result.deletedCount });
  } catch (err) {
    next(err);
  }
}

// Public endpoint: the building comes from the JWT when logged in, or from
// ?tenantSlug= for anonymous visitors (e.g. the landing-page concierge).
async function resolveTenantId(req) {
  const token = req.headers.authorization?.startsWith("Bearer ")
    ? req.headers.authorization.slice(7)
    : null;
  if (token) {
    try {
      const payload = verifyToken(token);
      req.user = payload; // Attach user to request for logging
      if (payload.tenantId) return payload.tenantId;
    } catch {
      // fall through to slug lookup
    }
  }
  if (req.query.tenantSlug) {
    const tenant = await Tenant.findOne({ slug: req.query.tenantSlug.toLowerCase() });
    return tenant?._id || null;
  }
  return null;
}

export async function ask(req, res, next) {
  try {
    const { messages = [] } = req.body;
    if (messages.length === 0) {
      return res.status(400).json({ error: "messages array is required" });
    }

    const tenantId = await resolveTenantId(req);
    if (!tenantId) {
      return res.status(401).json({ error: "Log in or provide a tenantSlug" });
    }

    if (!process.env.GROQ_API_KEY) {
      return res.status(500).json({ error: "GROQ_API_KEY is not configured" });
    }

    // Security Check: scan user message for suspicious intent
    const lastMessage = messages[messages.length - 1];
    if (lastMessage && lastMessage.text) {
      const isSuspicious = /\b(rob|robe|robbery|robbing|assault|assaulting|steal|stealing|kill|killing|attack|attacking|fuck|shit|bitch|asshole|cunt|dick|pussy|bastard|slut|whore)\b/i.test(lastMessage.text);
      if (isSuspicious) {
        if (req.user) {
          logActivity(
            req,
            "SECURITY_ALERT",
            `Suspicious/Inappropriate AI query detected: "${lastMessage.text}"`,
            { resourceType: "faq" }
          );
        }
        return res.json({ 
          answer: "This query has been flagged for security or policy violations. Building management has been notified.", 
          source: "system" 
        });
      }
    }

    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

    // Fetch context data
    const faqs = await Faq.find({ tenantId });
    const offices = await Office.find({ tenantId });

    // Build system prompt
    let systemPrompt = "You are the AI Concierge for Askari Corporate Tower. Answer the user's questions based ONLY on the following information. Be concise, polite, and helpful.\n\n";

    if (faqs.length > 0) {
      systemPrompt += "### Building FAQs:\n";
      faqs.forEach(f => {
        systemPrompt += `Q: ${f.question}\nA: ${f.answer}\n\n`;
      });
    }

    if (offices.length > 0) {
      systemPrompt += "### Office Directory:\n";
      offices.forEach(o => {
        systemPrompt += `- ${o.name} is located on ${o.floor}, Room ${o.room}. ${o.description ? `(Info: ${o.description})` : ""}\n`;
      });
    }

    systemPrompt += "\nIf the information is not in the FAQs or Directory above, say 'I don't have that information yet. Please contact building management.' Do not make up answers.";

    // Call Groq LLM
    const completion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        ...messages.map(m => ({ role: m.role, content: m.text })) // Map frontend msg format to Groq format
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.3,
      max_tokens: 256,
    });

    const answer = completion.choices[0]?.message?.content || "Sorry, I couldn't process that.";

    res.json({ answer, source: "groq" });
  } catch (err) {
    console.error("Groq API Error:", err);
    res.status(500).json({ error: "AI processing failed." });
  }
}
