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
      <div className="max-w-3xl mx-auto p-10">

        <h1 className="text-4xl font-bold mb-6">
          AI Assistant
        </h1>

        <div className="bg-white shadow-lg rounded-xl p-6">

          <input
            type="text"
            placeholder="Ask a question... (e.g. Where is HR?)"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && askQuestion()}
            className="w-full border rounded-lg p-3"
          />

          <button
            onClick={askQuestion}
            disabled={loading}
            className="mt-5 bg-cyan-500 text-white px-6 py-3 rounded-lg hover:bg-cyan-600 disabled:opacity-50"
          >
            {loading ? "Thinking..." : "Ask"}
          </button>

          {answer && (
            <div className="mt-6 p-4 bg-slate-100 rounded-lg">
              <strong>Answer:</strong>
              <p className="mt-2">{answer}</p>

              {source && (
                <p className="mt-3 text-xs text-gray-500">
                  Source: {source === "faq" ? "Building FAQ" : "Office Directory"}
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
