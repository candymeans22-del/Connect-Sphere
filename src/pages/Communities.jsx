import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Search, Users, X } from "lucide-react";
import FloatingBubbles from "../components/animations/FloatingBubbles";
import Sidebar from "../components/SideBar";
import BottomNav from "../components/BottomNav";
import useAuth from "../hooks/useAuth";

const meshStyle = {
  backgroundColor: "#E7EDF9",
  backgroundImage:
    "radial-gradient(at 8% 6%, #F6DEE5 0px, transparent 45%), radial-gradient(at 92% 4%, #CDE7F7 0px, transparent 45%), radial-gradient(at 80% 95%, #C6C8E2 0px, transparent 50%), radial-gradient(at 5% 90%, #EBBAC7 0px, transparent 45%)",
  backgroundAttachment: "fixed",
};

const categories = ["All", "Programming", "Design", "Security", "Education", "Gaming"];

const gradients = [
  "from-rose to-primary",
  "from-sky to-primary",
  "from-blush to-lavender-deep",
  "from-primary-soft to-lavender-deep",
];

// Sample data for now. Later this will come from the API.
const startingCommunities = [
  { id: 1, name: "Programming", category: "Programming", members: 12000, about: "Share code, tips and debugging stories.", joined: false },
  { id: 2, name: "Web Development", category: "Programming", members: 9800, about: "HTML, CSS, React, Node and everything MERN.", joined: true },
  { id: 3, name: "Graphic Design", category: "Design", members: 8400, about: "Posters, logos, UI ideas and feedback.", joined: false },
  { id: 4, name: "Cybersecurity", category: "Security", members: 5100, about: "Learn safe coding and ethical hacking basics.", joined: false },
  { id: 5, name: "Education", category: "Education", members: 4700, about: "Study notes, resources and exam tips.", joined: false },
  { id: 6, name: "Gaming", category: "Gaming", members: 3900, about: "Talk games, setups and game development.", joined: false },
];

function formatMembers(n) {
  return n >= 1000 ? `${(n / 1000).toFixed(1).replace(".0", "")}k members` : `${n} members`;
}

function Communities() {
  const navigate = useNavigate();
  const { guest, user, logout } = useAuth();

  const [list, setList] = useState(startingCommunities);
  const [tab, setTab] = useState("Discover");
  const [category, setCategory] = useState("All");
  const [query, setQuery] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ name: "", about: "", category: "Programming" });

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const toggleJoin = (id) => {
    setList((prev) =>
      prev.map((c) =>
        c.id === id
          ? { ...c, joined: !c.joined, members: c.members + (c.joined ? -1 : 1) }
          : c
      )
    );
  };

  const createCommunity = (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    const newOne = {
      id: Date.now(),
      name: form.name.trim(),
      category: form.category,
      members: 1,
      about: form.about.trim() || "A new community on ConnectSphere.",
      joined: true,
    };
    setList((prev) => [newOne, ...prev]);
    setForm({ name: "", about: "", category: "Programming" });
    setShowCreate(false);
    setTab("My communities");
  };

  const q = query.trim().toLowerCase();
  const shown = list.filter((c) => {
    if (tab === "My communities" && !c.joined) return false;
    if (category !== "All" && c.category !== category) return false;
    if (q && !c.name.toLowerCase().includes(q)) return false;
    return true;
  });

  return (
    <div className="relative min-h-screen overflow-hidden" style={meshStyle}>
      <FloatingBubbles />

      <div className="relative z-10 mx-auto max-w-7xl px-4 lg:px-6 py-4 lg:grid lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-6">
        <Sidebar
          user={user}
          onLogout={handleLogout}
          active="Communities"
          guest={guest}
          onLogin={() => navigate("/login")}
        />

        <main className="min-w-0 w-full max-w-3xl mx-auto lg:mx-0 pb-32 lg:pb-10 space-y-6">
          <div className="flex items-center gap-3">
            <h1 className="flex items-center gap-2 text-2xl font-bold text-primary-deep">
              <Users size={24} /> Communities
            </h1>
            <button
              onClick={() => setShowCreate(true)}
              className="ml-auto flex items-center gap-2 rounded-full bg-linear-to-br from-rose to-primary px-5 py-2.5 text-sm font-semibold text-white shadow-lg"
            >
              <Plus size={16} /> Create
            </button>
          </div>

          <div className="glass flex items-center gap-3 rounded-full px-5 py-3">
            <Search size={18} className="text-primary-soft" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search communities..."
              className="bg-transparent outline-none text-sm w-full"
            />
          </div>

          <div className="glass inline-flex rounded-full p-1.5">
            {["Discover", "My communities"].map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
                  tab === t
                    ? "bg-linear-to-br from-primary to-primary-soft text-white shadow"
                    : "text-ink/70"
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap gap-2">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={`rounded-full px-4 py-1.5 text-xs font-semibold transition ${
                  category === c
                    ? "bg-primary text-white shadow"
                    : "bg-white/70 text-ink/70 hover:bg-white"
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          {shown.length === 0 && (
            <div className="glass rounded-[2rem] p-8 text-center text-muted">
              {tab === "My communities"
                ? "You have not joined any communities yet. Go to Discover and join one."
                : "No communities found."}
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            {shown.map((c, i) => (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(i, 5) * 0.06 }}
                whileHover={{ y: -6 }}
                className="glass rounded-[2rem] p-5"
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`w-12 h-12 shrink-0 rounded-2xl bg-linear-to-br ${gradients[i % gradients.length]}`}
                  />
                  <div className="leading-tight min-w-0">
                    <p className="font-semibold truncate">{c.name}</p>
                    <p className="text-xs text-muted">{formatMembers(c.members)}</p>
                  </div>
                </div>
                <p className="mt-3 text-sm text-ink/70">{c.about}</p>
                <div className="mt-4 flex items-center">
                  <span className="rounded-full bg-white/80 border border-pale px-3 py-1 text-xs font-semibold text-primary-deep">
                    {c.category}
                  </span>
                  <button
                    onClick={() => toggleJoin(c.id)}
                    className={`ml-auto rounded-full px-5 py-1.5 text-xs font-semibold transition ${
                      c.joined
                        ? "bg-white text-primary-deep border border-pale"
                        : "bg-rose text-white shadow"
                    }`}
                  >
                    {c.joined ? "Joined" : "Join"}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </main>
      </div>

      <BottomNav active={1} username={user.username} />

      <AnimatePresence>
        {showCreate && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 px-4"
            onClick={() => setShowCreate(false)}
          >
            <motion.form
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              onSubmit={createCommunity}
              className="w-full max-w-md max-h-[90dvh] overflow-y-auto rounded-[2rem] bg-white p-6 shadow-2xl"
            >
              <div className="flex items-center">
                <h2 className="text-lg font-bold text-primary-deep">Create community</h2>
                <button
                  type="button"
                  onClick={() => setShowCreate(false)}
                  className="ml-auto text-muted"
                >
                  <X size={20} />
                </button>
              </div>

              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Community name"
                className="mt-4 w-full rounded-2xl border border-pale px-4 py-3 text-sm outline-none focus:border-primary"
                required
              />
              <textarea
                value={form.about}
                onChange={(e) => setForm({ ...form, about: e.target.value })}
                placeholder="What is this community about?"
                rows={3}
                className="mt-3 w-full rounded-2xl border border-pale px-4 py-3 text-sm outline-none focus:border-primary"
              />
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="mt-3 w-full rounded-2xl border border-pale px-4 py-3 text-sm outline-none focus:border-primary"
              >
                {categories.slice(1).map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>

              <button
                type="submit"
                className="mt-5 w-full rounded-full bg-linear-to-br from-rose to-primary py-3 text-sm font-semibold text-white shadow-lg"
              >
                Create
              </button>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Communities;