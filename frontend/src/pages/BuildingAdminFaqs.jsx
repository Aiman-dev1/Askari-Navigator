import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { FiArrowLeft } from "react-icons/fi";
import MainLayout from "../components/layout/MainLayout";
import { api } from "../lib/api";

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
      <div className="max-w-6xl mx-auto px-6 py-12 min-h-[75vh]">

        {/* Page Header */}
        <div className="mb-10 border-b border-gray-200/80 pb-6 relative">
          <Link
            to="/building-admin"
            className="inline-flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold text-gold-600 hover:text-gold-500 transition-colors mb-4"
          >
            <FiArrowLeft size={12} />
            Back to Dashboard
          </Link>

          <h1 className="text-3xl md:text-4xl font-serif font-bold text-slate-900 tracking-wide uppercase">
            Manage FAQs & Info Sheets
          </h1>
          <p className="text-gray-500 text-sm font-light mt-2 uppercase tracking-widest">
            Everything listed here powers the AI Virtual Concierge's answers
          </p>
          <div className="absolute bottom-[-1px] left-0 w-24 h-[2px] bg-gold-400"></div>
        </div>

        {/* Add FAQ */}
        <div className="bg-white border border-gray-200/60 shadow-md rounded p-8 mb-10 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-[3px] bg-gold-400/40"></div>

          <h2 className="text-xl font-serif font-bold text-slate-900 mb-6 tracking-wide uppercase">
            Add New Entry
          </h2>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className="flex flex-col gap-1">
              <label className="text-xs uppercase tracking-wider text-slate-600 font-semibold mb-1">Question</label>
              <input
                placeholder="e.g. What are lobby operating hours?"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                className="border border-gray-200 p-3 rounded text-sm focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-400 transition-all bg-slate-50/50"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs uppercase tracking-wider text-slate-600 font-semibold mb-1">Answer / Guideline</label>
              <input
                placeholder="e.g. The reception desk is staffed 24/7."
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addFaq()}
                className="border border-gray-200 p-3 rounded text-sm focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-400 transition-all bg-slate-50/50"
              />
            </div>
          </div>

          <button
            onClick={addFaq}
            className="bg-gold-400 hover:bg-gold-500 text-slate-950 px-6 py-3 rounded font-bold uppercase tracking-wider text-xs transition-all shadow cursor-pointer"
          >
            Add FAQ Listing
          </button>
        </div>

        {/* FAQ table */}
        <div className="bg-white border border-gray-200/60 shadow-md rounded p-8 overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-[3px] bg-gold-400/40"></div>

          <h2 className="text-xl font-serif font-bold text-slate-900 mb-6 tracking-wide uppercase">
            Current Listings ({faqs.length})
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-900 text-gold-400 text-xs uppercase tracking-widest font-serif border-b border-gold-400/20">
                  <th className="p-4 w-1/3">Question</th>
                  <th className="p-4 w-1/2">Answer</th>
                  <th className="p-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {faqs.map((item) => (
                  <tr key={item._id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 text-sm font-semibold text-slate-900">{item.question}</td>
                    <td className="p-4 text-sm text-gray-600 leading-relaxed">{item.answer}</td>
                    <td className="p-4 text-center">
                      <button
                        onClick={() => deleteFaq(item._id)}
                        className="border border-red-500/20 text-red-500 hover:bg-red-500 hover:text-white px-3 py-1.5 rounded text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </MainLayout>
  );
}

export default BuildingAdminFaqs;
