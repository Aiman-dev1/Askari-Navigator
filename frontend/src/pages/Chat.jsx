import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import MainLayout from "../components/layout/MainLayout";
import { api } from "../lib/api";
import { getSocket } from "../lib/socket";
import { useSelector } from "react-redux";

function Chat() {
  const { user } = useSelector((state) => state.auth);
  const [rooms, setRooms] = useState([]);
  const [activeRoom, setActiveRoom] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [matching, setMatching] = useState(false);
  const [typingUsers, setTypingUsers] = useState([]); // [{ username, roomId }]
  const bottomRef = useRef(null);
  const typingTimersRef = useRef(new Map()); // username -> expiry timeout
  const lastTypingSentRef = useRef(0);
  const stopTypingTimerRef = useRef(null);

  // Per-user "clear conversation" marker — hides messages older than this
  const clearedKey = (roomId) => `towernav_cleared_${user?.id}_${roomId}`;

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

    const removeTyping = (username) => {
      clearTimeout(typingTimersRef.current.get(username));
      typingTimersRef.current.delete(username);
      setTypingUsers((prev) => prev.filter((t) => t.username !== username));
    };

    const onUserTyping = ({ username, roomId }) => {
      setTypingUsers((prev) =>
        prev.some((t) => t.username === username)
          ? prev
          : [...prev, { username, roomId }]
      );
      // Auto-expire in case the stop event never arrives
      clearTimeout(typingTimersRef.current.get(username));
      typingTimersRef.current.set(username, setTimeout(() => removeTyping(username), 3000));
    };

    const onUserStoppedTyping = ({ username }) => removeTyping(username);

    socket.on("new_message", onNewMessage);
    socket.on("match_found", onMatchFound);
    socket.on("user_typing", onUserTyping);
    socket.on("user_stopped_typing", onUserStoppedTyping);
    socket.on("connect_error", (err) => toast.error(`Chat: ${err.message}`));

    return () => {
      socket.off("new_message", onNewMessage);
      socket.off("match_found", onMatchFound);
      socket.off("user_typing", onUserTyping);
      socket.off("user_stopped_typing", onUserStoppedTyping);
      socket.off("connect_error");
      typingTimersRef.current.forEach((t) => clearTimeout(t));
      typingTimersRef.current.clear();
    };
  }, []);

  // Join the active room + load its history
  useEffect(() => {
    if (!activeRoom) return;
    const socket = getSocket();

    socket.emit("join_room", activeRoom._id, (res) => {
      if (res?.error) toast.error(res.error);
    });

    const clearedAt = localStorage.getItem(clearedKey(activeRoom._id));

    api
      .get(`/chat/rooms/${activeRoom._id}/messages`)
      .then((data) =>
        setMessages(
          data.messages
            .filter((m) => !clearedAt || new Date(m.createdAt) > new Date(clearedAt))
            .map((m) => ({
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

    setTypingUsers([]);

    return () => socket.emit("leave_room", activeRoom._id);
  }, [activeRoom]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (text.trim() === "" || !activeRoom) return;
    const socket = getSocket();
    socket.emit(
      "send_message",
      { roomId: activeRoom._id, message: text },
      (res) => res?.error && toast.error(res.error)
    );
    clearTimeout(stopTypingTimerRef.current);
    socket.emit("stop_typing", activeRoom._id);
    setText("");
  };

  // Broadcast "typing" (throttled), then "stop_typing" after a pause
  const handleTyping = (value) => {
    setText(value);
    if (!activeRoom) return;

    const socket = getSocket();
    const now = Date.now();
    if (now - lastTypingSentRef.current > 1500) {
      lastTypingSentRef.current = now;
      socket.emit("typing", activeRoom._id);
    }

    clearTimeout(stopTypingTimerRef.current);
    stopTypingTimerRef.current = setTimeout(
      () => socket.emit("stop_typing", activeRoom._id),
      2000
    );
  };

  // Hides the room's history for this user only — others keep theirs
  const clearConversation = () => {
    if (!activeRoom) return;
    localStorage.setItem(clearedKey(activeRoom._id), new Date().toISOString());
    setMessages([]);
    toast.success("Conversation cleared");
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

  const reportMessage = async (msgId) => {
    try {
      await api.post(`/chat/messages/${msgId}/report`);
      toast.success("Message reported to administration");
    } catch (err) {
      toast.error(err.message);
    }
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

              {activeRoom && messages.length > 0 && (
                <button
                  onClick={clearConversation}
                  className="border border-red-500/20 text-red-500 hover:bg-red-500 hover:text-white px-3 py-1.5 rounded text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer"
                >
                  Clear
                </button>
              )}
            </div>

            <div className="h-96 overflow-y-auto border border-gray-100 rounded p-6 mb-6 bg-slate-50/30">

              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`mb-4 max-w-[80%] flex flex-col group ${isMine(msg) ? "ml-auto items-end" : "mr-auto items-start"}`}
                >
                  <div className="flex items-center gap-3 mb-1 px-1">
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                      {isMine(msg) ? "You" : msg.sender}
                    </span>
                    {!isMine(msg) && (
                      <button
                        onClick={() => reportMessage(msg.id)}
                        className="opacity-0 group-hover:opacity-100 text-[9px] text-red-500 font-bold uppercase tracking-widest hover:underline transition-opacity cursor-pointer"
                      >
                        Report
                      </button>
                    )}
                  </div>

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

            {/* Typing indicator */}
            <div className="h-5 mb-2 px-1">
              {(() => {
                const names = typingUsers
                  .filter((t) => t.roomId === activeRoom?._id)
                  .map((t) => t.username);
                if (names.length === 0) return null;
                return (
                  <span className="text-[10px] uppercase tracking-widest text-gold-600 font-bold animate-pulse">
                    {names.length === 1
                      ? `${names[0]} is typing`
                      : names.length === 2
                      ? `${names[0]} and ${names[1]} are typing`
                      : "Several tenants are typing"}
                    <span className="tracking-normal">...</span>
                  </span>
                );
              })()}
            </div>

            <div className="flex gap-3">

              <input
                type="text"
                placeholder={
                  activeRoom ? `Type message in board ${activeRoom.name}...` : "Select a board to start chat..."
                }
                value={text}
                onChange={(e) => handleTyping(e.target.value)}
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
