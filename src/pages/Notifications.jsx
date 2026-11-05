import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Bell, CheckCheck, Heart, MessageCircle, UserPlus, Mail } from "lucide-react";
import FloatingBubbles from "../components/animations/FloatingBubbles";
import Sidebar from "../components/SideBar";
import BottomNav from "../components/BottomNav";
import useAuth from "../hooks/useAuth";
import Avatar from "../components/Avatar";
import timeAgo from "../utils/timeAgo";

const meshStyle = {
  backgroundColor: "#E7EDF9",
  backgroundImage:
    "radial-gradient(at 8% 6%, #F6DEE5 0px, transparent 45%), radial-gradient(at 92% 4%, #CDE7F7 0px, transparent 45%), radial-gradient(at 80% 95%, #C6C8E2 0px, transparent 50%), radial-gradient(at 5% 90%, #EBBAC7 0px, transparent 45%)",
  backgroundAttachment: "fixed",
};

const minutesAgo = (n) => new Date(Date.now() - n * 60 * 1000).toISOString();

const tabs = [
  { label: "All", type: null },
  { label: "Likes", type: "like" },
  { label: "Comments", type: "comment" },
  { label: "Followers", type: "follow" },
  { label: "Messages", type: "message" },
];

// Each type has an icon, a colour and the text that follows the person's name
const typeInfo = {
  like: { Icon: Heart, color: "bg-rose", text: "liked your post" },
  comment: { Icon: MessageCircle, color: "bg-primary", text: "commented on your post" },
  follow: { Icon: UserPlus, color: "bg-lavender-deep", text: "started following you" },
  message: { Icon: Mail, color: "bg-sky", text: "sent you a message" },
};

// Sample data for now. Later this will come from the API (and Socket.io for live ones).
const startingNotifications = [
  { id: 1, type: "like", name: "Maya Khan", username: "maya_k", createdAt: minutesAgo(5), read: false },
  { id: 2, type: "comment", name: "Hassan Ali", username: "hassan.codes", createdAt: minutesAgo(32), read: false, preview: "Great tip, this helped me a lot!" },
  { id: 3, type: "follow", name: "Sara Khan", username: "sarakhan", createdAt: minutesAgo(90), read: false },
  { id: 4, type: "message", name: "Ali Raza", username: "aliraza", createdAt: minutesAgo(180), read: false, preview: "Hey, can you share your notes?" },
  { id: 5, type: "like", name: "Noor Fatima", username: "noor_f", createdAt: minutesAgo(60 * 20), read: true },
  { id: 6, type: "follow", name: "Zain Ahmed", username: "zain.dev", createdAt: minutesAgo(60 * 30), read: true },
  { id: 7, type: "comment", name: "Maya Khan", username: "maya_k", createdAt: minutesAgo(60 * 50), read: true, preview: "Can you post more about React?" },
];

function Notifications() {
  const navigate = useNavigate();
  const { guest, user, logout } = useAuth();

  const [items, setItems] = useState(startingNotifications);
  const [tab, setTab] = useState("All");

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const unread = items.filter((n) => !n.read).length;
  const activeType = tabs.find((t) => t.label === tab).type;
  const shown = items.filter((n) => !activeType || n.type === activeType);

  const markAllRead = () => setItems((prev) => prev.map((n) => ({ ...n, read: true })));

  // Clicking a notification marks it as read and opens that person's profile
  const openNotification = (n) => {
    setItems((prev) => prev.map((x) => (x.id === n.id ? { ...x, read: true } : x)));
    navigate(`/profile/${n.username}`);
  };

  return (
    <div className="relative min-h-screen overflow-hidden" style={meshStyle}>
      <FloatingBubbles />

      <div className="relative z-10 mx-auto max-w-7xl px-4 lg:px-6 py-4 lg:grid lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-6">
        <Sidebar
          user={user}
          onLogout={handleLogout}
          active="Notifications"
          guest={guest}
          onLogin={() => navigate("/login")}
        />

        <main className="min-w-0 w-full max-w-2xl mx-auto lg:mx-0 pb-32 lg:pb-10 space-y-6">
          <div className="flex items-center gap-3">
            <h1 className="flex items-center gap-2 text-2xl font-bold text-primary-deep">
              <Bell size={24} /> Notifications
              {unread > 0 && (
                <span className="rounded-full bg-rose px-2.5 py-0.5 text-xs font-semibold text-white">
                  {unread}
                </span>
              )}
            </h1>
            <button
              onClick={markAllRead}
              className="glass ml-auto flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold text-primary-deep"
            >
              <CheckCheck size={16} /> Mark all read
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {tabs.map((t) => (
              <button
                key={t.label}
                onClick={() => setTab(t.label)}
                className={`rounded-full px-4 py-1.5 text-xs font-semibold transition ${
                  tab === t.label
                    ? "bg-primary text-white shadow"
                    : "bg-white/70 text-ink/70 hover:bg-white"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {shown.length === 0 && (
            <div className="glass rounded-[2rem] p-8 text-center text-muted">
              No notifications here yet.
            </div>
          )}

          <div className="space-y-3">
            {shown.map((n, i) => {
              const { Icon, color, text } = typeInfo[n.type];
              return (
                <motion.button
                  key={n.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: Math.min(i, 6) * 0.05 }}
                  whileHover={{ y: -3 }}
                  onClick={() => openNotification(n)}
                  className={`glass flex w-full items-center gap-4 rounded-3xl p-4 text-left ${
                    n.read ? "" : "ring-2 ring-primary/40"
                  }`}
                >
                  <span className="relative shrink-0">
                    <Avatar name={n.name} size={48} />
                    <span
                      className={`absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full border-2 border-white text-white ${color}`}
                    >
                      <Icon size={12} />
                    </span>
                  </span>

                  <div className="min-w-0 leading-snug">
                    <p className="text-sm">
                      <b>{n.name}</b> {text}
                    </p>
                    {n.preview && (
                      <p className="mt-0.5 truncate text-xs text-muted">"{n.preview}"</p>
                    )}
                    <p className="mt-1 text-xs text-muted">{timeAgo(n.createdAt)}</p>
                  </div>

                  {!n.read && (
                    <span className="ml-auto h-2.5 w-2.5 shrink-0 rounded-full bg-primary" />
                  )}
                </motion.button>
              );
            })}
          </div>
        </main>
      </div>

      <BottomNav active={0} username={user.username} />
    </div>
  );
}

export default Notifications;