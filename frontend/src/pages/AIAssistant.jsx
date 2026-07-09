import { useState } from "react";
import toast from "react-hot-toast";
import MainLayout from "../components/layout/MainLayout";
import { api } from "../lib/api";

function AIAssistant() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [source, setSource] = useState(null);
  const [loading, setLoading] = useState(false);

  const askQuestion = async () => {
    if (!question.trim()) {
      setAnswer("Please enter a question.");
      setSource(null);
      return;
    }

    setLoading(true);
    try {
      const data = await api.get(`/faqs/ask?question=${encodeURIComponent(question)}`);
      if (data.answer) {
        setAnswer(data.answer);
        setSource(data.source);
      } else {
        setAnswer("I don't know the answer to that yet. Try asking about an office or department.");
        setSource(null);
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto px-6 py-12 min-h-[75vh]">

        {/* Page Header */}
        <div className="mb-10 border-b border-gray-200/80 pb-6 relative">
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-slate-900 tracking-wide uppercase">
            AI Virtual Concierge
          </h1>
          <p className="text-gray-500 text-sm font-light mt-2 uppercase tracking-widest">
            Instant digital assistance for guest services and tenant directories
          </p>
          <div className="absolute bottom-[-1px] left-0 w-24 h-[2px] bg-gold-400"></div>
        </div>

        <div className="bg-white border border-gray-200/60 shadow-md rounded p-8 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-[3px] bg-gold-400/40"></div>

          <label className="text-xs uppercase tracking-wider text-slate-600 font-semibold mb-2 block">Ask a Question</label>
          <input
            type="text"
            placeholder="e.g. Where is Ernst & Young office? or What are reception hours?"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && askQuestion()}
            className="w-full border border-gray-200 p-4 rounded text-sm focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-400 transition-all bg-slate-50/50 mb-4"
          />

          <button
            onClick={askQuestion}
            disabled={loading}
            className="bg-gold-400 hover:bg-gold-500 text-slate-950 px-6 py-3 rounded font-bold uppercase tracking-wider text-xs transition-all shadow cursor-pointer disabled:opacity-50"
          >
            {loading ? "Thinking..." : "Inquire"}
          </button>

          {answer && (
            <div className="mt-8 p-6 bg-slate-50 border-l-2 border-gold-400 rounded">
              <span className="text-xs uppercase tracking-widest text-gold-600 font-bold block mb-2">Concierge Response:</span>
              <p className="text-sm text-gray-700 leading-relaxed font-light">{answer}</p>

              {source && (
                <p className="mt-4 text-[10px] text-gray-400 uppercase tracking-widest font-bold">
                  Database Source: {source === "faq" ? "Building FAQ" : "Tenant Directory"}
                </p>
              )}
            </div>
          )}

        </div>

      </div>
    </MainLayout>
  );
}

export default AIAssistant;
