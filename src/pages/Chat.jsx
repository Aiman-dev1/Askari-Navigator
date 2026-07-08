import { useState } from "react";
import MainLayout from "../components/layout/MainLayout";
import chatData from "../data/chatData";

function Chat() {
  const [messages, setMessages] = useState(chatData);
  const [text, setText] = useState("");

  const sendMessage = () => {
    if (text.trim() === "") return;

    const newMessage = {
      id: messages.length + 1,
      sender: "You",
      message: text,
    };

    setMessages([...messages, newMessage]);
    setText("");
  };

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto p-10">

        <h1 className="text-4xl font-bold mb-6">
          Live Chat
        </h1>

        <div className="bg-white rounded-xl shadow-lg p-6">

          {/* Messages */}
          <div className="h-80 overflow-y-auto border rounded-lg p-4 mb-4">

            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`mb-3 ${
                  msg.sender === "You" ? "text-right" : "text-left"
                }`}
              >
                <p className="font-bold">{msg.sender}</p>

                <div
                  className={`inline-block px-4 py-2 rounded-lg ${
                    msg.sender === "You"
                      ? "bg-cyan-500 text-white"
                      : "bg-slate-200"
                  }`}
                >
                  {msg.message}
                </div>
              </div>
            ))}

          </div>

          {/* Input */}
          <div className="flex gap-3">

            <input
              type="text"
              placeholder="Type a message..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="flex-1 border rounded-lg p-3"
            />

            <button
              onClick={sendMessage}
              className="bg-cyan-500 text-white px-6 rounded-lg hover:bg-cyan-600"
            >
              Send
            </button>

          </div>

        </div>

      </div>
    </MainLayout>
  );
}

export default Chat;