import { useState } from "react";
import MainLayout from "../components/layout/MainLayout";
import faqs from "../data/faqs";

function AIAssistant() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  const askQuestion = () => {
    const userQuestion = question.toLowerCase().trim();

    const found = faqs.find(
      (faq) => faq.question === userQuestion
    );

    if (found) {
      setAnswer(found.answer);
    } else {
      setAnswer("I don't know. Please contact the Building Reception.");
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
            placeholder="Ask a question..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="w-full border rounded-lg p-3"
          />

          <button
            onClick={askQuestion}
            className="mt-5 bg-cyan-500 text-white px-6 py-3 rounded-lg hover:bg-cyan-600"
          >
            Ask
          </button>

          {answer && (
            <div className="mt-6 p-4 bg-slate-100 rounded-lg">
              <strong>Answer:</strong>
              <p className="mt-2">{answer}</p>
            </div>
          )}

        </div>

      </div>
    </MainLayout>
  );
}

export default AIAssistant;