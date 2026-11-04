import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, Bell, LogOut, PenLine } from "lucide-react";
import api from "../services/api";
import FloatingBubbles from "../components/animations/FloatingBubbles";
import Sidebar from "../components/SideBar";
import HeroCard from "../components/HeroCard";
import StoriesBar from "../components/StoriesBar";
import PostCard from "../components/PostCard";
import RightPanel from "../components/RightPanel";
import BottomNav from "../components/BottomNav";
import CreatePostModal from "../components/CreatePostModal";
import LoginPrompt from "../components/LoginPrompt";
import { isGuest, getSamplePosts } from "../utils/guest";

const tabs = ["For you", "Study", "Tips", "Travel"];

const meshStyle = {
  backgroundColor: "#E7EDF9",
  backgroundImage:
    "radial-gradient(at 8% 6%, #F6DEE5 0px, transparent 45%), radial-gradient(at 92% 4%, #CDE7F7 0px, transparent 45%), radial-gradient(at 80% 95%, #C6C8E2 0px, transparent 50%), radial-gradient(at 5% 90%, #EBBAC7 0px, transparent 45%)",
  backgroundAttachment: "fixed",
};

function getUser() {
  try {
    return JSON.parse(localStorage.getItem("user")) || {};
  } catch {
    return {};
  }
}

function Home() {
  const navigate = useNavigate();
  const guest = isGuest(); // no token = visitor who did not login
  const user = guest ? { name: "Guest", username: "guest" } : getUser();

  const [tab, setTab] = useState("For you");
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(!guest);
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);
  const [showCreate, setShowCreate] = useState(false);
  const [prompt, setPrompt] = useState(""); // "Login to ..." message for guests

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  // Guests see sample posts, logged in users see the real feed
  const feed = guest ? getSamplePosts(tab) : posts;

  // Guests cannot create posts, so ask them to login first
  const openCreate = () => (guest ? setPrompt("create a post") : setShowCreate(true));

  // Load posts from the API whenever the tab changes
  useEffect(() => {
    let cancelled = false;

    // Guests see sample posts (no server needed), so nothing to load
    if (guest) return;

    async function load() {
      setLoading(true);
      setError("");
      try {
        const { data } = await api.get("/posts", {
          params: tab === "For you" ? {} : { tag: tab },
        });
        if (!cancelled) setPosts(data.posts);
      } catch (err) {
        if (err.response?.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          navigate("/login");
          return;
        }
        if (!cancelled) setError("Could not load posts. Is the server running?");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [tab, reloadKey, navigate, guest]);

  const handlePostCreated = (post) => {
    if (tab === "For you" || tab === post.tag) {
      setPosts((prev) => [post, ...prev]);
    } else {
      setTab("For you");
    }
  };

  const handlePostDeleted = (id) => {
    setPosts((prev) => prev.filter((p) => p._id !== id));
  };

  return (
    <div className="relative min-h-screen overflow-hidden" style={meshStyle}>
      <FloatingBubbles />

      <div className="relative z-10 mx-auto max-w-7xl px-4 lg:px-6 py-4 lg:grid lg:grid-cols-[240px_minmax(0,1fr)] xl:grid-cols-[240px_minmax(0,1fr)_300px] lg:gap-6">
        <Sidebar user={user} onLogout={handleLogout} guest={guest} onLogin={() => navigate("/login")} />

        <main className="min-w-0 w-full max-w-2xl mx-auto lg:mx-0 pb-32 lg:pb-10 space-y-6">
          <div className="flex items-center gap-3">
            <div className="glass flex items-center gap-3 rounded-full px-5 py-3 flex-1">
              <Search size={18} className="text-primary-soft" />
              <input
                placeholder="Search creators, trends..."
                className="bg-transparent outline-none text-sm w-full"
              />
            </div>
            <button className="glass relative w-12 h-12 rounded-full flex items-center justify-center">
              <Bell size={19} />
              <span className="absolute top-3 right-3.5 w-2.5 h-2.5 rounded-full bg-rose border-2 border-white" />
            </button>
            {guest ? (
              <button
                onClick={() => navigate("/login")}
                className="glass lg:hidden px-5 h-12 rounded-full text-sm font-semibold text-primary-deep"
              >
                Login
              </button>
            ) : (
              <button
                onClick={handleLogout}
                title="Logout"
                className="glass lg:hidden w-12 h-12 rounded-full flex items-center justify-center"
              >
                <LogOut size={19} />
              </button>
            )}
          </div>

          {guest && (
            <div className="glass rounded-3xl px-5 py-3 flex items-center gap-3 text-sm">
              <span className="flex-1">
                You are browsing as a guest. Login to post, like and comment.
              </span>
              <button
                onClick={() => navigate("/login")}
                className="px-4 py-1.5 rounded-full bg-primary text-white font-semibold"
              >
                Login
              </button>
            </div>
          )}

          <HeroCard name={user.name} onCreate={openCreate} />

          <StoriesBar userName={user.name || "You"} />

          <div className="glass rounded-full p-1.5 flex gap-1 w-fit max-w-full overflow-x-auto no-scrollbar">
            {tabs.map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className="relative px-5 py-2 text-sm font-semibold rounded-full whitespace-nowrap"
              >
                {tab === t && (
                  <motion.span
                    layoutId="tab-pill"
                    className="absolute inset-0 rounded-full bg-linear-to-r from-primary to-rose"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <span className={`relative ${tab === t ? "text-white" : "text-ink/70"}`}>{t}</span>
              </button>
            ))}
          </div>

          <div className="space-y-6">
            {loading && (
              <>
                {[0, 1].map((n) => (
                  <div key={n} className="glass rounded-[2rem] p-5 animate-pulse">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-full bg-white/80" />
                      <div className="space-y-2">
                        <div className="h-3 w-32 rounded-full bg-white/80" />
                        <div className="h-2.5 w-20 rounded-full bg-white/60" />
                      </div>
                    </div>
                    <div className="mt-5 h-3 w-full rounded-full bg-white/70" />
                    <div className="mt-2 h-3 w-2/3 rounded-full bg-white/70" />
                  </div>
                ))}
              </>
            )}

            {!loading && error && (
              <div className="glass rounded-3xl p-8 text-center">
                <p className="text-rose-deep">{error}</p>
                <button
                  onClick={() => setReloadKey((k) => k + 1)}
                  className="mt-4 px-6 py-2 rounded-full bg-primary text-white font-semibold shadow"
                >
                  Try again
                </button>
              </div>
            )}

            {!loading && !error && feed.length === 0 && (
              <div className="glass rounded-3xl p-10 text-center">
                <p className="font-semibold text-primary-deep">No posts here yet</p>
                <p className="mt-1 text-sm text-muted">Be the first to share something.</p>
                <button
                  onClick={openCreate}
                  className="mt-5 inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-linear-to-r from-primary to-rose text-white font-semibold shadow-lg"
                >
                  <PenLine size={16} /> Create post
                </button>
              </div>
            )}

            {!loading &&
              !error &&
              feed.map((p, i) => (
                <PostCard
                  key={p._id}
                  post={p}
                  index={i}
                  currentUserId={user._id}
                  onDelete={handlePostDeleted}
                  guest={guest}
                  onRequireLogin={setPrompt}
                />
              ))}
          </div>
        </main>

        <RightPanel />
      </div>

      <BottomNav active={0} onPlus={openCreate} />

      <LoginPrompt message={prompt} onClose={() => setPrompt("")} />

      <CreatePostModal
        open={showCreate}
        onClose={() => setShowCreate(false)}
        onCreated={handlePostCreated}
        user={user}
      />
    </div>
  );
}

export default Home;