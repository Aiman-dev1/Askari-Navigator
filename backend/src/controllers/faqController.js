import Faq from "../models/Faq.js";
import Office from "../models/Office.js";

// Words too common to be useful when matching a question against FAQs
const STOPWORDS = new Set([
  "where", "is", "the", "a", "an", "of", "to", "in", "on", "at",
  "what", "when", "how", "who", "which", "can", "i", "do", "does",
  "are", "find", "get", "located", "please",
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
    res.json({ deleted: true });
  } catch (err) {
    next(err);
  }
}

// GET /api/v1/faqs/ask?question=where+is+hr
// Keyword-matches the question against the building's FAQs; if nothing
// matches, falls back to the office directory for "where is X" style queries.
export async function ask(req, res, next) {
  try {
    const question = (req.query.question || "").trim();
    if (!question) return res.status(400).json({ error: "question is required" });

    const qWords = keywords(question);
    if (qWords.length === 0) {
      return res.json({ answer: null, source: null });
    }

    // 1. Best FAQ by keyword overlap
    const faqs = await Faq.find({ tenantId: req.user.tenantId });
    let best = null;
    let bestScore = 0;
    for (const faq of faqs) {
      const fWords = new Set(keywords(faq.question));
      const score = qWords.filter((w) => fWords.has(w)).length;
      if (score > bestScore) {
        best = faq;
        bestScore = score;
      }
    }
    if (best) {
      return res.json({ answer: best.answer, source: "faq", matched: best.question });
    }

    // 2. Fall back to the office directory
    const rx = qWords.map((w) => new RegExp(w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i"));
    const office = await Office.findOne({
      tenantId: req.user.tenantId,
      $or: rx.flatMap((r) => [{ name: r }, { description: r }, { room: r }]),
    });
    if (office) {
      return res.json({
        answer: `${office.name} is on the ${office.floor}, Room ${office.room}.`,
        source: "directory",
        matched: office.name,
      });
    }

    res.json({ answer: null, source: null });
  } catch (err) {
    next(err);
  }
}
