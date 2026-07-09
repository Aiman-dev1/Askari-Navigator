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
      <div className="max-w-6xl mx-auto px-6 py-12 min-h-screen">

        {/* Page Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10 border-b border-gray-200/80 pb-6 relative">
          <div>
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-slate-900 tracking-wide uppercase">
              Tenant Network
            </h1>
            <p className="text-gray-500 text-sm font-light mt-2 uppercase tracking-widest">
              Private communications & public room boards for Askari Corporate Tower
            </p>
          </div>
          
          <div className="relative z-10">
            {matching ? (
              <button
                onClick={cancelShuffle}
                className="bg-red-500 hover:bg-red-600 text-white px-5 py-2.5 rounded text-xs font-bold uppercase tracking-wider transition-all duration-300 shadow cursor-pointer"
              >
                Cancel Shuffle
              </button>
            ) : (
              <button
                onClick={shuffleChat}
                className="bg-gold-400 hover:bg-gold-500 text-slate-950 px-5 py-2.5 rounded text-xs font-bold uppercase tracking-wider transition-all duration-300 shadow-md hover:shadow-gold-400/10 cursor-pointer"
              >
                🔀 Shuffle Chat
              </button>
            )}
          </div>
          <div className="absolute bottom-[-1px] left-0 w-24 h-[2px] bg-gold-400"></div>
        </div>

        <div className="grid md:grid-cols-4 gap-8">

          {/* Rooms List */}
          <div className="bg-white border border-gray-200/60 rounded p-6 shadow-sm">
            <h2 className="font-serif font-bold mb-4 text-slate-900 text-xs uppercase tracking-widest border-b border-gray-100 pb-2">Active Boards</h2>
            <div className="space-y-1">
              {rooms.map((room) => (
                <button
                  key={room._id}
                  onClick={() => setActiveRoom(room)}
                  className={`w-full text-left px-3 py-2 rounded text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                    activeRoom?._id === room._id
                      ? "bg-slate-900 text-gold-400 border-l-2 border-gold-400 shadow-sm"
                      : "hover:bg-slate-50 text-gray-600 hover:text-slate-900"
                  }`}
                >
                  {room.type === "match" ? "🔀 " : "# "}
                  {room.name}
                </button>
              ))}
            </div>
          </div>

          {/* Chat Messages */}
          <div className="bg-white border border-gray-200/60 rounded p-8 md:col-span-3 shadow-sm flex flex-col relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-[3px] bg-gold-400/40"></div>

            {/* Room Banner */}
            <div className="border-b border-gray-100 pb-3 mb-6 flex justify-between items-center">
              <span className="text-xs uppercase tracking-widest text-gold-600 font-bold font-serif">
                {activeRoom ? `# ${activeRoom.name}` : "Select a room"}
              </span>
            </div>

            <div className="h-96 overflow-y-auto border border-gray-100 rounded p-6 mb-6 bg-slate-50/30">

              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`mb-4 max-w-[80%] flex flex-col ${isMine(msg) ? "ml-auto items-end" : "mr-auto items-start"}`}
                >
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1 px-1">
                    {isMine(msg) ? "You" : msg.sender}
                  </span>

                  <div
                    className={`px-4 py-3 rounded text-sm leading-relaxed ${
                      isMine(msg) 
                        ? "bg-slate-900 border border-gold-400/20 text-white shadow-sm border-r-2 border-r-gold-400" 
                        : "bg-white border border-gray-200 text-gray-700 shadow-sm"
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
                  activeRoom ? `Type message in board ${activeRoom.name}...` : "Select a board to start chat..."
                }
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                className="flex-1 border border-gray-200 rounded p-3 text-sm focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-400 transition-all bg-slate-50/50"
              />

              <button
                onClick={sendMessage}
                className="bg-gold-400 hover:bg-gold-500 text-slate-950 px-6 rounded font-bold uppercase tracking-wider text-xs transition-all shadow cursor-pointer"
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
