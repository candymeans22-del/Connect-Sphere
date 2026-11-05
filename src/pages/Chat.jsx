import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Search, Send } from "lucide-react";
import FloatingBubbles from "../components/animations/FloatingBubbles";
import Sidebar from "../components/SideBar";
import BottomNav from "../components/BottomNav";
import useAuth from "../hooks/useAuth";
import Avatar from "../components/Avatar";

const meshStyle = {
  backgroundColor: "#E7EDF9",
  backgroundImage:
    "radial-gradient(at 8% 6%, #F6DEE5 0px, transparent 45%), radial-gradient(at 92% 4%, #CDE7F7 0px, transparent 45%), radial-gradient(at 80% 95%, #C6C8E2 0px, transparent 50%), radial-gradient(at 5% 90%, #EBBAC7 0px, transparent 45%)",
  backgroundAttachment: "fixed",
};

const time = (d = new Date()) =>
  d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

// Sample data for now. Later this will come from the API and Socket.io.
// from: "me" is a message you sent, "them" is a message you received.
const startingChats = [
  {
    id: 1,
    name: "Ali Raza",
    username: "aliraza",
    unread: 2,
    messages: [
      { id: 1, from: "them", text: "Hey! Did you finish the React assignment?", at: "10:12 AM" },
      { id: 2, from: "me", text: "Almost, I am working on the profile page.", at: "10:14 AM" },
      { id: 3, from: "them", text: "Nice. Can you share your notes?", at: "10:15 AM" },
    ],
  },
  {
    id: 2,
    name: "Sara Khan",
    username: "sarakhan",
    unread: 0,
    messages: [
      { id: 1, from: "them", text: "Loved your new design!", at: "Yesterday" },
      { id: 2, from: "me", text: "Thank you so much!", at: "Yesterday" },
    ],
  },
  {
    id: 3,
    name: "Maya Khan",
    username: "maya_k",
    unread: 1,
    messages: [
      { id: 1, from: "them", text: "Are you joining the Web Development community?", at: "Mon" },
    ],
  },
  {
    id: 4,
    name: "Hassan Ali",
    username: "hassan.codes",
    unread: 0,
    messages: [
      { id: 1, from: "me", text: "Want to study together this weekend?", at: "Sun" },
      { id: 2, from: "them", text: "Sure, let us do it!", at: "Sun" },
    ],
  },
];

const fakeReplies = [
  "Sounds good!",
  "Haha, nice one.",
  "Okay, let me check and tell you.",
  "Thanks for sharing that!",
  "Can we talk about it tomorrow?",
];

function Chat() {
  const navigate = useNavigate();
  const { guest, user, logout } = useAuth();

  const [chats, setChats] = useState(startingChats);
  const [activeId, setActiveId] = useState(null); // null = nothing opened yet
  const [query, setQuery] = useState("");
  const [text, setText] = useState("");
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef(null);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const active = chats.find((c) => c.id === activeId);

  // Scroll to the newest message whenever messages change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [active?.messages.length, typing]);

  const openChat = (id) => {
    setActiveId(id);
    setChats((prev) => prev.map((c) => (c.id === id ? { ...c, unread: 0 } : c)));
  };

  const addMessage = (id, from, msgText) => {
    setChats((prev) =>
      prev.map((c) =>
        c.id === id
          ? { ...c, messages: [...c.messages, { id: Date.now(), from, text: msgText, at: time() }] }
          : c
      )
    );
  };

  const sendMessage = (e) => {
    e.preventDefault();
    const msg = text.trim();
    if (!msg || !active) return;
    const chatId = active.id;
    addMessage(chatId, "me", msg);
    setText("");

    // Fake reply so you can see the typing dots. Socket.io will replace this later.
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      addMessage(chatId, "them", fakeReplies[Math.floor(Math.random() * fakeReplies.length)]);
    }, 1500);
  };

  const q = query.trim().toLowerCase();
  const shownChats = chats.filter((c) => c.name.toLowerCase().includes(q));

  const lastMessage = (c) => c.messages[c.messages.length - 1];

  return (
    <div className="relative min-h-screen overflow-hidden" style={meshStyle}>
      <FloatingBubbles />

      <div className="relative z-10 mx-auto max-w-7xl px-4 lg:px-6 py-4 lg:grid lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-6">
        <Sidebar
          user={user}
          onLogout={handleLogout}
          active="Messages"
          guest={guest}
          onLogin={() => navigate("/login")}
        />

        <main className="min-w-0 w-full pb-28 lg:pb-4">
          <div className="grid h-[calc(100dvh-8rem)] lg:h-[calc(100dvh-2rem)] gap-4 md:grid-cols-[300px_minmax(0,1fr)]">
            {/* Conversation list (hidden on phones while a chat is open) */}
            <section
              className={`glass flex-col overflow-hidden rounded-[2rem] ${
                active ? "hidden md:flex" : "flex"
              }`}
            >
              <div className="p-4">
                <h1 className="text-xl font-bold text-primary-deep">Messages</h1>
                <div className="mt-3 flex items-center gap-2 rounded-full bg-white/70 px-4 py-2.5">
                  <Search size={16} className="text-primary-soft" />
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search chats..."
                    className="w-full bg-transparent text-sm outline-none"
                  />
                </div>
              </div>

              <ul className="flex-1 space-y-1 overflow-y-auto px-2 pb-3">
                {shownChats.length === 0 && (
                  <li className="p-4 text-center text-sm text-muted">No chats found.</li>
                )}
                {shownChats.map((c) => (
                  <li key={c.id}>
                    <button
                      onClick={() => openChat(c.id)}
                      className={`flex w-full items-center gap-3 rounded-3xl p-3 text-left transition ${
                        c.id === activeId ? "bg-white" : "hover:bg-white/60"
                      }`}
                    >
                      <Avatar name={c.name} size={46} />
                      <div className="min-w-0 flex-1 leading-tight">
                        <p className="truncate text-sm font-semibold">{c.name}</p>
                        <p className="truncate text-xs text-muted">
                          {lastMessage(c).from === "me" ? "You: " : ""}
                          {lastMessage(c).text}
                        </p>
                      </div>
                      {c.unread > 0 && (
                        <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-rose px-1.5 text-xs font-semibold text-white">
                          {c.unread}
                        </span>
                      )}
                    </button>
                  </li>
                ))}
              </ul>
            </section>

            {/* Chat window */}
            <section
              className={`glass flex-col overflow-hidden rounded-[2rem] ${
                active ? "flex" : "hidden md:flex"
              }`}
            >
              {!active ? (
                <div className="flex flex-1 items-center justify-center p-8 text-center text-muted">
                  Select a chat to start messaging.
                </div>
              ) : (
                <>
                  <header className="flex items-center gap-3 border-b border-pale/60 p-4">
                    <button onClick={() => setActiveId(null)} className="md:hidden text-primary-deep">
                      <ArrowLeft size={22} />
                    </button>
                    <button
                      onClick={() => navigate(`/profile/${active.username}`)}
                      className="flex items-center gap-3"
                    >
                      <Avatar name={active.name} size={42} />
                      <div className="text-left leading-tight">
                        <p className="text-sm font-semibold">{active.name}</p>
                        <p className="text-xs text-muted">
                          {typing ? "typing..." : `@${active.username}`}
                        </p>
                      </div>
                    </button>
                  </header>

                  <div className="flex-1 space-y-3 overflow-y-auto p-4">
                    {active.messages.map((m) => (
                      <motion.div
                        key={m.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex ${m.from === "me" ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[75%] rounded-3xl px-4 py-2.5 text-sm ${
                            m.from === "me"
                              ? "rounded-br-md bg-linear-to-br from-rose to-primary text-white"
                              : "rounded-bl-md bg-white"
                          }`}
                        >
                          <p className="wrap-break-word">{m.text}</p>
                          <p
                            className={`mt-1 text-[10px] ${
                              m.from === "me" ? "text-white/70" : "text-muted"
                            }`}
                          >
                            {m.at}
                          </p>
                        </div>
                      </motion.div>
                    ))}

                    {typing && (
                      <div className="flex justify-start">
                        <div className="flex gap-1 rounded-3xl rounded-bl-md bg-white px-4 py-3">
                          {[0, 1, 2].map((d) => (
                            <motion.span
                              key={d}
                              className="h-2 w-2 rounded-full bg-primary-soft"
                              animate={{ y: [0, -5, 0] }}
                              transition={{ repeat: Infinity, duration: 0.8, delay: d * 0.15 }}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                    <div ref={bottomRef} />
                  </div>

                  <form
                    onSubmit={sendMessage}
                    className="flex items-center gap-3 border-t border-pale/60 p-3"
                  >
                    <input
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      placeholder="Type a message..."
                      className="flex-1 rounded-full bg-white/80 px-5 py-3 text-sm outline-none"
                    />
                    <button
                      type="submit"
                      className="flex h-11 w-11 items-center justify-center rounded-full bg-linear-to-br from-rose to-primary text-white shadow-lg"
                    >
                      <Send size={18} />
                    </button>
                  </form>
                </>
              )}
            </section>
          </div>
        </main>
      </div>

      <BottomNav active={3} username={user.username} />
    </div>
  );
}

export default Chat;