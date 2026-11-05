import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Bell, Check, Lock, LogOut, Trash2, User } from "lucide-react";
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

const defaultSettings = {
  name: "",
  username: "",
  bio: "",
  privateAccount: false,
  postVisibility: "Public",
  whoCanMessage: "Everyone",
  notifyLikes: true,
  notifyComments: true,
  notifyFollowers: true,
  notifyMessages: true,
};

// Settings are saved in the browser for now. Later they will be saved through the API.
function loadSettings(user) {
  try {
    const saved = JSON.parse(localStorage.getItem("settings")) || {};
    return { ...defaultSettings, name: user.name || "", username: user.username || "", ...saved };
  } catch {
    return { ...defaultSettings, name: user.name || "", username: user.username || "" };
  }
}

function Toggle({ on, onChange }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!on)}
      className={`relative h-7 w-12 shrink-0 rounded-full transition ${
        on ? "bg-primary" : "bg-pale"
      }`}
    >
      <span
        className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition-all ${
          on ? "left-6" : "left-1"
        }`}
      />
    </button>
  );
}

function Row({ title, hint, children }) {
  return (
    <div className="flex items-center gap-4 py-3">
      <div className="min-w-0 flex-1 leading-tight">
        <p className="text-sm font-semibold">{title}</p>
        {hint && <p className="mt-0.5 text-xs text-muted">{hint}</p>}
      </div>
      {children}
    </div>
  );
}

function Section({ Icon, title, children }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-[2rem] p-5"
    >
      <h2 className="flex items-center gap-2 font-bold text-primary-deep">
        <Icon size={18} /> {title}
      </h2>
      <div className="mt-2 divide-y divide-pale/60">{children}</div>
    </motion.section>
  );
}

const selectClass =
  "rounded-full border border-pale bg-white px-4 py-2 text-sm outline-none focus:border-primary";

function Settings() {
  const navigate = useNavigate();
  const { guest, user, logout, updateProfile } = useAuth();

  const [s, setS] = useState(() => loadSettings(user));
  const [saved, setSaved] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const set = (key, value) => setS((prev) => ({ ...prev, [key]: value }));

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const save = (e) => {
    e.preventDefault();
    localStorage.setItem("settings", JSON.stringify(s));
    // Update the name and username everywhere (sidebar, posts) right away
    if (!guest) updateProfile({ name: s.name, username: s.username });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const deleteAccount = () => {
    // Frontend only for now. Later this will call the API to delete the account.
    logout();
    localStorage.removeItem("settings");
    navigate("/");
  };

  return (
    <div className="relative min-h-screen overflow-hidden" style={meshStyle}>
      <FloatingBubbles />

      <div className="relative z-10 mx-auto max-w-7xl px-4 lg:px-6 py-4 lg:grid lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-6">
        <Sidebar
          user={user}
          onLogout={handleLogout}
          active="Settings"
          guest={guest}
          onLogin={() => navigate("/login")}
        />

        <main className="min-w-0 w-full max-w-2xl mx-auto lg:mx-0 pb-32 lg:pb-10">
          <h1 className="mb-6 text-2xl font-bold text-primary-deep">Settings</h1>

          <form onSubmit={save} className="space-y-6">
            <Section Icon={User} title="Profile">
              <div className="flex items-center gap-4 py-3">
                <Avatar name={s.name || "?"} size={64} />
                <p className="text-xs text-muted">
                  Profile picture upload will be added when the backend is ready.
                </p>
              </div>
              <div className="space-y-3 py-3">
                <input
                  value={s.name}
                  onChange={(e) => set("name", e.target.value)}
                  placeholder="Full name"
                  className="w-full rounded-2xl border border-pale bg-white px-4 py-3 text-sm outline-none focus:border-primary"
                />
                <input
                  value={s.username}
                  onChange={(e) => set("username", e.target.value)}
                  placeholder="Username"
                  className="w-full rounded-2xl border border-pale bg-white px-4 py-3 text-sm outline-none focus:border-primary"
                />
                <textarea
                  value={s.bio}
                  onChange={(e) => set("bio", e.target.value)}
                  placeholder="Write a short bio"
                  rows={3}
                  maxLength={160}
                  className="w-full rounded-2xl border border-pale bg-white px-4 py-3 text-sm outline-none focus:border-primary"
                />
                <p className="text-right text-xs text-muted">{s.bio.length}/160</p>
              </div>
            </Section>

            <Section Icon={Lock} title="Privacy">
              <Row title="Private account" hint="Only approved followers can see your posts.">
                <Toggle on={s.privateAccount} onChange={(v) => set("privateAccount", v)} />
              </Row>
              <Row title="Default post visibility" hint="Who can see your new posts.">
                <select
                  value={s.postVisibility}
                  onChange={(e) => set("postVisibility", e.target.value)}
                  className={selectClass}
                >
                  <option>Public</option>
                  <option>Followers</option>
                  <option>Only me</option>
                </select>
              </Row>
              <Row title="Who can message you">
                <select
                  value={s.whoCanMessage}
                  onChange={(e) => set("whoCanMessage", e.target.value)}
                  className={selectClass}
                >
                  <option>Everyone</option>
                  <option>Followers</option>
                  <option>No one</option>
                </select>
              </Row>
            </Section>

            <Section Icon={Bell} title="Notifications">
              <Row title="Likes">
                <Toggle on={s.notifyLikes} onChange={(v) => set("notifyLikes", v)} />
              </Row>
              <Row title="Comments">
                <Toggle on={s.notifyComments} onChange={(v) => set("notifyComments", v)} />
              </Row>
              <Row title="New followers">
                <Toggle on={s.notifyFollowers} onChange={(v) => set("notifyFollowers", v)} />
              </Row>
              <Row title="Messages">
                <Toggle on={s.notifyMessages} onChange={(v) => set("notifyMessages", v)} />
              </Row>
            </Section>

            <div className="flex items-center gap-3">
              <button
                type="submit"
                className="rounded-full bg-linear-to-br from-rose to-primary px-8 py-3 text-sm font-semibold text-white shadow-lg"
              >
                Save changes
              </button>
              <AnimatePresence>
                {saved && (
                  <motion.span
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-1 text-sm font-semibold text-primary-deep"
                  >
                    <Check size={16} /> Saved
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
          </form>

          <div className="glass mt-6 rounded-[2rem] p-5">
            <h2 className="font-bold text-primary-deep">Account</h2>
            <div className="mt-3 flex flex-wrap gap-3">
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-primary-deep border border-pale"
              >
                <LogOut size={16} /> Log out
              </button>
              <button
                onClick={() => setConfirmDelete(true)}
                className="flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-rose-deep border border-rose"
              >
                <Trash2 size={16} /> Delete account
              </button>
            </div>
          </div>
        </main>
      </div>

      <BottomNav active={4} username={user.username} />

      <AnimatePresence>
        {confirmDelete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 px-4"
            onClick={() => setConfirmDelete(false)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-sm rounded-[2rem] bg-white p-6 text-center shadow-2xl"
            >
              <h3 className="text-lg font-bold text-primary-deep">Delete your account?</h3>
              <p className="mt-2 text-sm text-muted">
                This will remove your account and cannot be undone.
              </p>
              <div className="mt-5 flex gap-3">
                <button
                  onClick={() => setConfirmDelete(false)}
                  className="flex-1 rounded-full border border-pale py-2.5 text-sm font-semibold"
                >
                  Cancel
                </button>
                <button
                  onClick={deleteAccount}
                  className="flex-1 rounded-full bg-rose py-2.5 text-sm font-semibold text-white"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Settings;