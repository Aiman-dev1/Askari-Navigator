import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { FiArrowLeft, FiHelpCircle, FiTrash2, FiChevronDown, FiChevronUp, FiPlus } from "react-icons/fi";
import MainLayout from "../components/layout/MainLayout";
import { api } from "../lib/api";

/* Collapsible FAQ row */
function FaqRow({ item, onDelete }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden transition-all duration-200 hover:border-gold-400/40">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-4 p-5 text-left bg-white hover:bg-slate-50 transition-colors cursor-pointer"
      >
        <div className="flex items-start gap-3 min-w-0">
          <FiHelpCircle size={15} className="text-gold-500 mt-0.5 shrink-0" />
          <span className="text-sm font-semibold text-slate-900 leading-snug">{item.question}</span>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(item._id); }}
            className="w-7 h-7 rounded-lg border border-red-500/20 text-red-500 hover:bg-red-500 hover:text-white flex items-center justify-center transition-all cursor-pointer"
            aria-label="Delete FAQ"
          >
            <FiTrash2 size={12} />
          </button>
          {open
            ? <FiChevronUp size={16} className="text-gray-400" />
            : <FiChevronDown size={16} className="text-gray-400" />
          }
        </div>
      </button>

      {open && (
        <div className="px-5 pb-5 pt-1 bg-slate-50 border-t border-gray-100">
          <p className="text-sm text-gray-600 leading-relaxed">{item.answer}</p>
        </div>
      )}
    </div>
  );
}

function BuildingAdminFaqs() {
  const [faqs, setFaqs] = useState([]);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  useEffect(() => {
    api
      .get("/faqs")
      .then((data) => setFaqs(data.faqs))
      .catch((err) => toast.error(err.message));
  }, []);

  const addFaq = async () => {
    if (!question || !answer) return toast.error("Fill in both fields");
    try {
      const data = await api.post("/faqs", { question, answer });
      setFaqs([...faqs, data.faq]);
      setQuestion("");
      setAnswer("");
      toast.success("FAQ added");
    } catch (err) {
      toast.error(err.message);
    }
  };

  const deleteFaq = async (id) => {
    try {
      await api.delete(`/faqs/${id}`);
      setFaqs(faqs.filter((item) => item._id !== id));
      toast.success("FAQ deleted");
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <MainLayout>
      <div className="max-w-5xl mx-auto px-6 py-12 min-h-[75vh]">

        {/* ── Page Header ── */}
        <div className="mb-10 border-b border-gray-200/80 pb-6 relative">
          <Link
            to="/building-admin"
            className="inline-flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold text-gold-600 hover:text-gold-500 transition-colors mb-4"
          >
            <FiArrowLeft size={12} />
            Back to Dashboard
          </Link>

          <h1 className="text-3xl md:text-4xl font-serif font-bold text-slate-900 tracking-wide uppercase">
            Manage FAQs
          </h1>
          <p className="text-gray-500 text-sm font-light mt-2 uppercase tracking-widest">
            Everything listed here powers the AI Virtual Concierge's answers
          </p>
          <div className="absolute bottom-[-1px] left-0 w-24 h-[2px] bg-gold-400" />
        </div>

        {/* ── Add New FAQ ── */}
        <div className="bg-white border border-gray-200/60 shadow-md rounded-lg p-8 mb-8 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-[3px] bg-gold-400/40" />

          <div className="flex items-center gap-3 mb-6">
            <div className="w-9 h-9 rounded-lg bg-gold-400/10 border border-gold-400/20 flex items-center justify-center text-gold-600 shrink-0">
              <FiPlus size={16} />
            </div>
            <h2 className="text-xl font-serif font-bold text-slate-900 tracking-wide uppercase">
              Add New Entry
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-5 mb-5">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs uppercase tracking-wider text-slate-600 font-semibold">
                Question
              </label>
              <input
                placeholder="e.g. What are lobby operating hours?"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                className="border border-gray-200 p-3 rounded-lg text-sm focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-400 transition-all bg-slate-50/50"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs uppercase tracking-wider text-slate-600 font-semibold">
                Answer / Guideline
              </label>
              <textarea
                rows={3}
                placeholder="e.g. The reception desk is staffed 24/7 and the lobby opens at 7:00 AM."
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                className="border border-gray-200 p-3 rounded-lg text-sm focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-400 transition-all bg-slate-50/50 resize-none"
              />
            </div>
          </div>

          <button
            onClick={addFaq}
            className="bg-gold-400 hover:bg-gold-500 text-slate-950 px-7 py-3 rounded-lg font-bold uppercase tracking-wider text-xs transition-all shadow cursor-pointer hover:shadow-md"
          >
            Add FAQ Listing
          </button>
        </div>

        {/* ── FAQ List ── */}
        <div className="bg-white border border-gray-200/60 shadow-md rounded-lg p-8 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-[3px] bg-gold-400/40" />

          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-gold-400/10 border border-gold-400/20 flex items-center justify-center text-gold-600 shrink-0">
                <FiHelpCircle size={16} />
              </div>
              <h2 className="text-xl font-serif font-bold text-slate-900 tracking-wide uppercase">
                Current Listings
              </h2>
            </div>
            <span className="bg-slate-100 text-slate-600 text-xs font-bold px-3 py-1 rounded-full">
              {faqs.length} {faqs.length === 1 ? "entry" : "entries"}
            </span>
          </div>

          {faqs.length === 0 ? (
            <div className="p-10 bg-slate-50 rounded-lg border border-dashed border-gray-200 text-center">
              <FiHelpCircle size={32} className="mx-auto text-gray-300 mb-3" />
              <p className="text-gray-500 text-sm">No FAQ entries yet. Add your first one above.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {faqs.map((item) => (
                <FaqRow key={item._id} item={item} onDelete={deleteFaq} />
              ))}
            </div>
          )}
        </div>

      </div>
    </MainLayout>
  );
}

export default BuildingAdminFaqs;
