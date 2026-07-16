import { useEffect, useRef, useState } from "react";
import { FiMessageSquare, FiX, FiSend } from "react-icons/fi";
import { api } from "../../lib/api";
import { DEFAULT_TENANT_SLUG } from "../../store/slices/authSlice";

// Floating AI concierge — bottom-right chat bubble, like a typical
// website support widget. Answers from the building FAQs + directory.
function AIAssistantWidget() {
  const [open, setOpen] = useState(false);
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: "Welcome! Ask me anything about the tower — offices, departments, timings...",
    },
  ]);
  const bottomRef = useRef(null);

  useEffect(() => {
    if (open) bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  // Lets other parts of the app (e.g. the dashboard card) pop the widget open
  useEffect(() => {
    const openWidget = () => setOpen(true);
    window.addEventListener("open-ai-concierge", openWidget);
    return () => window.removeEventListener("open-ai-concierge", openWidget);
  }, []);

  const ask = async () => {
    const q = question.trim();
    if (!q || loading) return;

    setMessages((prev) => [...prev, { role: "user", text: q }]);
    setQuestion("");
    setLoading(true);

    try {
      const payload = {
        messages: [
          ...messages, // existing messages
          { role: "user", text: q } // current user question
        ]
      };

      const data = await api.post(`/faqs/ask?tenantSlug=${DEFAULT_TENANT_SLUG}`, payload);
      
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: data.answer || "I don't know that one yet. Try asking about an office, department or facility.",
          source: data.source,
        },
      ]);
    } catch (err) {
      setMessages((prev) => [...prev, { role: "assistant", text: `Sorry — ${err.message}` }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">

      {/* Chat panel */}
      {open && (
        <div className="mb-4 w-80 sm:w-96 bg-white rounded-lg shadow-2xl border border-gray-200/60 overflow-hidden flex flex-col">

          {/* Header */}
          <div className="bg-slate-900 px-5 py-4 relative">
            <div className="absolute top-0 left-0 w-full h-[3px] bg-gold-400"></div>
            <h3 className="font-serif font-bold text-gold-400 tracking-wide uppercase text-sm">
              Tower Concierge
            </h3>
            <p className="text-[10px] uppercase tracking-widest text-gray-400 mt-1">
              AI Assistant — Askari Corporate Tower
            </p>
          </div>

          {/* Messages */}
          <div className="h-72 overflow-y-auto p-4 space-y-3 bg-slate-50/50">
            {messages.map((msg, i) => (
              <div key={i} className={msg.role === "user" ? "text-right" : "text-left"}>
                <div
                  className={`inline-block max-w-[85%] px-3.5 py-2.5 rounded-lg text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "bg-gold-400 text-slate-950 font-medium"
                      : "bg-white border border-gray-200/80 text-gray-700 shadow-sm"
                  }`}
                >
                  {msg.text}
                  {msg.source && (
                    <span className="block mt-1.5 text-[9px] uppercase tracking-widest text-gray-400">
                      {msg.source === "faq" ? "Building FAQ" : "Office Directory"}
                    </span>
                  )}
                </div>
              </div>
            ))}

            {loading && (
              <div className="text-left">
                <div className="inline-block px-3.5 py-2.5 rounded-lg text-sm bg-white border border-gray-200/80 text-gray-400 shadow-sm">
                  Thinking...
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="border-t border-gray-100 p-3 flex gap-2 bg-white">
            <input
              type="text"
              placeholder="e.g. Where is HR?"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && ask()}
              className="flex-1 border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-400 transition-all bg-slate-50/50"
            />
            <button
              onClick={ask}
              disabled={loading}
              className="bg-gold-400 hover:bg-gold-500 text-slate-950 px-3.5 rounded transition-all cursor-pointer disabled:opacity-50"
              aria-label="Send question"
            >
              <FiSend size={16} />
            </button>
          </div>

        </div>
      )}

      {/* Floating bubble */}
      <button
        onClick={() => setOpen(!open)}
        aria-label={open ? "Close AI assistant" : "Open AI assistant"}
        className="w-14 h-14 rounded-full bg-slate-900 border border-gold-400/30 text-gold-400 shadow-xl hover:shadow-gold-400/20 hover:scale-105 transition-all duration-300 flex items-center justify-center cursor-pointer"
      >
        {open ? <FiX size={22} /> : <FiMessageSquare size={22} />}
      </button>

    </div>
  );
}

export default AIAssistantWidget;
