import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { FiArrowLeft, FiHelpCircle, FiTrash2, FiChevronDown, FiChevronUp, FiPlus, FiAlertTriangle, FiX } from "react-icons/fi";
import MainLayout from "../components/layout/MainLayout";
import { api } from "../lib/api";

import DeleteConfirmModal from "../components/common/DeleteConfirmModal";

/* ── Collapsible FAQ row ── */
function FaqRow({ item, isSelected, onToggleSelect }) {
  const [open, setOpen] = useState(false);

  return (
    <div className={`border rounded-lg overflow-hidden transition-all duration-200 ${isSelected ? "border-gold-400 bg-gold-50/20" : "border-gray-200 hover:border-gold-400/40"}`}>
      <div className="w-full flex items-center justify-between p-5 text-left bg-transparent transition-colors">
        <div className="flex items-start gap-4 min-w-0 flex-1 cursor-pointer" onClick={() => setOpen(!open)}>
          <div className="mt-0.5 shrink-0" onClick={(e) => e.stopPropagation()}>
            <input
              type="checkbox"
              checked={isSelected}
              onChange={() => onToggleSelect(item._id)}
              className="w-4 h-4 rounded border-gray-300 text-gold-500 focus:ring-gold-500 cursor-pointer"
            />
          </div>
          <FiHelpCircle size={15} className="text-gold-500 mt-0.5 shrink-0" />
          <span className="text-sm font-semibold text-slate-900 leading-snug">{item.question}</span>
        </div>
        <div className="flex items-center gap-3 shrink-0 ml-4">
          <button onClick={() => setOpen(!open)} className="p-1 cursor-pointer">
          {open
            ? <FiChevronUp size={16} className="text-gray-400" />
            : <FiChevronDown size={16} className="text-gray-400" />
          }
          </button>
        </div>
      </div>

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
  const [selectedFaqs, setSelectedFaqs] = useState(new Set());
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  // Confirmation modal state
  const [confirmModal, setConfirmModal] = useState({ open: false, id: null, question: "" });

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

  // user confirmed — actually delete
  const handleDeleteConfirm = async () => {
    setConfirmModal({ open: false, id: null, question: "" });
    try {
      const ids = Array.from(selectedFaqs);
      await api.post("/faqs/bulk-delete", { ids });
      setFaqs(faqs.filter((item) => !selectedFaqs.has(item._id)));
      setSelectedFaqs(new Set());
      toast.success(`${ids.length} FAQ(s) deleted`);
    } catch (err) {
      toast.error(err.message);
    }
  };

  // user cancelled
  const handleDeleteCancel = () => {
    setConfirmModal({ open: false, id: null, question: "" });
  };

  const toggleSelectFaq = (id) => {
    const newSet = new Set(selectedFaqs);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setSelectedFaqs(newSet);
  };

  const toggleSelectAll = () => {
    if (selectedFaqs.size === faqs.length) {
      setSelectedFaqs(new Set());
    } else {
      setSelectedFaqs(new Set(faqs.map(f => f._id)));
    }
  };

  const deleteSelected = () => {
    if (selectedFaqs.size === 0) return;
    setConfirmModal({
      open: true,
      question: `${selectedFaqs.size} selected FAQ(s)`
    });
  };

  return (
    <MainLayout>
      {/* Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={confirmModal.open}
        title="Delete FAQs?"
        message={`Are you sure you want to delete ${selectedFaqs.size} selected FAQ(s)? This action cannot be undone.`}
        previewLabel="Target"
        previewText={confirmModal.question}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />

      <div className="max-w-5xl mx-auto px-6 py-12 min-h-[75vh]">

        {/* ── Page Header ── */}
        <div className="mb-10 border-b border-gray-200/80 pb-6 relative">
          <Link
            to="/building-admin"
            className="inline-flex items-center gap-2 text-[14px] uppercase tracking-widest font-bold text-gold-600 hover:text-gold-500 transition-colors mb-4"
          >
            <FiArrowLeft /> Back
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

          <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-gold-400/10 border border-gold-400/20 flex items-center justify-center text-gold-600 shrink-0">
                <FiHelpCircle size={16} />
              </div>
              <h2 className="text-xl font-serif font-bold text-slate-900 tracking-wide uppercase">
                Current Listings
              </h2>
            </div>
            
            <div className="flex items-center gap-3">
              <span className="bg-slate-100 text-slate-600 text-xs font-bold px-3 py-1.5 rounded-full">
                {faqs.length} {faqs.length === 1 ? "entry" : "entries"}
              </span>

              {faqs.length > 0 && (
                <>
                  <label className="flex items-center gap-2 cursor-pointer select-none bg-slate-50 border border-gray-200 px-3 py-1.5 rounded-full hover:bg-slate-100 transition-colors">
                    <input
                      type="checkbox"
                      checked={selectedFaqs.size === faqs.length}
                      onChange={toggleSelectAll}
                      className="w-3.5 h-3.5 rounded border-gray-300 text-gold-500 focus:ring-gold-500 cursor-pointer"
                    />
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-700">Select All</span>
                  </label>

                  {selectedFaqs.size > 0 && (
                    <button
                      onClick={deleteSelected}
                      className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 px-3.5 py-1.5 rounded-full border border-red-200 transition-all cursor-pointer animate-fade-in"
                    >
                      <FiTrash2 size={12} />
                      Delete Selected ({selectedFaqs.size})
                    </button>
                  )}
                </>
              )}
            </div>
          </div>

          {faqs.length === 0 ? (
            <div className="p-10 bg-slate-50 rounded-lg border border-dashed border-gray-200 text-center">
              <FiHelpCircle size={32} className="mx-auto text-gray-300 mb-3" />
              <p className="text-gray-500 text-sm">No FAQ entries yet. Add your first one above.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {faqs.map((item) => (
                <FaqRow
                  key={item._id}
                  item={item}
                  isSelected={selectedFaqs.has(item._id)}
                  onToggleSelect={toggleSelectFaq}
                />
              ))}
            </div>
          )}
        </div>

      </div>
    </MainLayout>
  );
}

export default BuildingAdminFaqs;
