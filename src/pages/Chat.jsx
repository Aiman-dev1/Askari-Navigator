import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import MainLayout from "../components/layout/MainLayout";
import { api } from "../lib/api";
import { getSocket } from "../lib/socket";
import { useAuth } from "../context/AuthContext";

function Chat() {
  const { user } = useAuth();
  const [rooms, setRooms] = useState([]);
  const [activeRoom, setActiveRoom] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [matching, setMatching] = useState(false);
  const bottomRef = useRef(null);

  // Load rooms once, hook up socket listeners
  useEffect(() => {
    const socket = getSocket();

    api
      .get("/chat/rooms")
      .then((data) => {
        setRooms(data.rooms);
        const global = data.rooms.find((r) => r.type === "global");
        if (global) setActiveRoom(global);
      })
      .catch((err) => toast.error(err.message));

    const onNewMessage = (msg) => {
      setMessages((prev) =>
        prev.some((m) => m.id === msg.id) ? prev : [...prev, msg]
      );
    };

    const onMatchFound = ({ roomId, roomName, partner }) => {
      setMatching(false);
      toast.success(`Matched with ${partner}!`);
      const room = { _id: roomId, name: roomName, type: "match" };
      setRooms((prev) =>
        prev.some((r) => r._id === roomId) ? prev : [...prev, room]
      );
      setActiveRoom(room);
    };

    socket.on("new_message", onNewMessage);
    socket.on("match_found", onMatchFound);
    socket.on("connect_error", (err) => toast.error(`Chat: ${err.message}`));

    return () => {
      socket.off("new_message", onNewMessage);
      socket.off("match_found", onMatchFound);
      socket.off("connect_error");
    };
  }, []);

  // Join the active room + load its history
  useEffect(() => {
    if (!activeRoom) return;
    const socket = getSocket();

    socket.emit("join_room", activeRoom._id, (res) => {
      if (res?.error) toast.error(res.error);
    });

    api
      .get(`/chat/rooms/${activeRoom._id}/messages`)
      .then((data) =>
        setMessages(
          data.messages.map((m) => ({
            id: m._id,
            roomId: m.roomId,
            sender: m.senderName,
            senderId: m.senderId,
            message: m.message,
            createdAt: m.createdAt,
          }))
        )
      )
      .catch((err) => toast.error(err.message));

    return () => socket.emit("leave_room", activeRoom._id);
  }, [activeRoom]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (text.trim() === "" || !activeRoom) return;
    getSocket().emit(
      "send_message",
      { roomId: activeRoom._id, message: text },
      (res) => res?.error && toast.error(res.error)
    );
    setText("");
  };

  const shuffleChat = () => {
    setMatching(true);
    getSocket().emit("random_match", (res) => {
      if (res?.error) {
        setMatching(false);
        toast.error(res.error);
      } else if (res?.status === "waiting") {
        toast("Waiting for someone to shuffle with...", { icon: "🔀" });
      }
    });
  };

  const cancelShuffle = () => {
    getSocket().emit("cancel_match", () => setMatching(false));
  };

  const isMine = (msg) => msg.senderId === user?.id;

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto p-10">

        <div className="flex justify-between items-center mb-6">
          <h1 className="text-4xl font-bold">Live Chat</h1>

          {matching ? (
            <button
              onClick={cancelShuffle}
              className="bg-red-500 text-white px-5 py-2 rounded-lg"
            >
              Cancel Shuffle
            </button>
          ) : (
            <button
              onClick={shuffleChat}
              className="bg-slate-800 text-white px-5 py-2 rounded-lg hover:bg-slate-700"
            >
              🔀 Shuffle Chat
            </button>
          )}
        </div>

        <div className="grid md:grid-cols-4 gap-6">

          {/* Rooms */}
          <div className="bg-white rounded-xl shadow-lg p-4">
            <h2 className="font-bold mb-3 text-gray-500 text-sm uppercase">Rooms</h2>
            <div className="space-y-1">
              {rooms.map((room) => (
                <button
                  key={room._id}
                  onClick={() => setActiveRoom(room)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm ${
                    activeRoom?._id === room._id
                      ? "bg-cyan-500 text-white"
                      : "hover:bg-slate-100"
                  }`}
                >
                  {room.type === "match" ? "🔀 " : "# "}
                  {room.name}
                </button>
              ))}
            </div>
          </div>

          {/* Messages */}
          <div className="bg-white rounded-xl shadow-lg p-6 md:col-span-3">

            <div className="h-80 overflow-y-auto border rounded-lg p-4 mb-4">

              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`mb-3 ${isMine(msg) ? "text-right" : "text-left"}`}
                >
                  <p className="font-bold">{isMine(msg) ? "You" : msg.sender}</p>

                  <div
                    className={`inline-block px-4 py-2 rounded-lg ${
                      isMine(msg) ? "bg-cyan-500 text-white" : "bg-slate-200"
                    }`}
                  >
                    {msg.message}
                  </div>
                </div>
              ))}

              <div ref={bottomRef} />

            </div>

            <div className="flex gap-3">

              <input
                type="text"
                placeholder={
                  activeRoom ? `Message ${activeRoom.name}...` : "Select a room..."
                }
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
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

      </div>
    </MainLayout>
  );
}

export default Chat;
