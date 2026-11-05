# Adds "guest mode": visitors can open the Home page without logging in.
# Run it from your Connect-Sphere folder (the one with package.json).

if (-not (Test-Path "package.json")) {
  Write-Host "Please open your Connect-Sphere folder in the terminal first (the one with package.json)." -ForegroundColor Red
  exit 1
}

function Write-TextFile($path, $content) {
  $dir = Split-Path $path -Parent
  if ($dir -and -not (Test-Path $dir)) { New-Item -ItemType Directory -Force -Path $dir | Out-Null }
  $full = Join-Path (Get-Location).Path $path
  [System.IO.File]::WriteAllText($full, $content, (New-Object System.Text.UTF8Encoding($false)))
  Write-Host "updated $path"
}

Write-TextFile "src/App.jsx" @'
import { Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/home" element={<Home />} />
    </Routes>
  );
}

export default App;
'@

Write-TextFile "src/pages/Home.jsx" @'
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
'@

Write-TextFile "src/pages/Landing.jsx" @'
import { useNavigate } from "react-router-dom";
import { motion, MotionConfig } from "framer-motion";
import { Users, BookOpen, MessageCircle, ShieldCheck } from "lucide-react";
import FloatingClouds from "../components/animations/FloatingClouds";
import FloatingBubbles from "../components/animations/FloatingBubbles";
import RotatingWords from "../components/animations/RotatingWords";
import HeroPhones from "../components/animations/HeroPhones";


const features = [
  { Icon: Users, title: "Interest communities", text: "Join groups for programming, design, gaming and more." },
  { Icon: BookOpen, title: "Study and skill sharing", text: "Post notes, tips and project ideas that help others." },
  { Icon: MessageCircle, title: "Real-time chat", text: "Message friends instantly with live typing indicators." },
  { Icon: ShieldCheck, title: "Privacy controls", text: "Choose who sees your posts and report what's not okay." },
];

const communities = ["Programming", "Web Development", "Cybersecurity", "Graphic Design", "Education", "Gaming"];

const reveal = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.3 },
  transition: { duration: 0.6 },
};

function Landing() {
  const navigate = useNavigate();

  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-screen bg-linear-to-b from-petal via-surface to-sky-soft">
        {/* ---------- Hero ---------- */}
        <div className="relative overflow-hidden">
          <FloatingClouds />
          <FloatingBubbles />

          <header className="relative z-20 px-4 pt-4">
            <div className="mx-auto max-w-6xl flex items-center justify-between rounded-full bg-white/70 backdrop-blur px-5 py-2.5 shadow-lg">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-linear-to-br from-rose to-primary" />
                <span className="font-bold text-primary-deep">ConnectSphere</span>
              </div>
              <nav className="hidden md:flex gap-8 text-sm font-medium">
                <a href="#features" className="hover:text-primary">Features</a>
                <a href="#communities" className="hover:text-primary">Communities</a>
              </nav>
              <div className="flex items-center gap-2">
                <button onClick={() => navigate("/login")} className="px-4 py-1.5 text-sm font-semibold text-primary-deep">
                  Login
                </button>
                <button
                  onClick={() => navigate("/register")}
                  className="px-5 py-1.5 text-sm font-semibold rounded-full bg-primary text-white shadow transition hover:-translate-y-0.5"
                >
                  Sign up
                </button>
              </div>
            </div>
          </header>

          <section className="relative z-10 mx-auto max-w-6xl px-6 pt-12 pb-20 grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <motion.span
                className="inline-block px-4 py-1.5 rounded-full bg-white/70 backdrop-blur text-sm font-medium text-primary-deep shadow"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                Social networking meets learning
              </motion.span>

              <motion.h1
                className="mt-5 text-5xl md:text-6xl font-bold leading-tight"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                Find your people.
                <br />
                <span className="bg-linear-to-r from-primary via-lavender-deep to-rose bg-clip-text text-transparent">
                  Share what you know.
                </span>
              </motion.h1>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.6 }}
              >
                <RotatingWords />
              </motion.div>

              <motion.p
                className="mt-4 text-lg max-w-xl mx-auto lg:mx-0 text-muted"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.9 }}
              >
                Join communities built around your interests, share notes and skills,
                and chat with people who care about the same things.
              </motion.p>

              <motion.div
                className="mt-8 flex flex-wrap items-center gap-4 justify-center lg:justify-start"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 1.2 }}
              >
                <motion.button
                  onClick={() => navigate("/register")}
                  className="px-8 py-3 rounded-full bg-primary text-white font-semibold shadow-lg"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Get Started
                </motion.button>
                <motion.button
                  onClick={() => navigate("/login")}
                  className="px-8 py-3 rounded-full bg-white text-primary-deep font-semibold border border-pale"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Login
                </motion.button>
                <motion.button
                  onClick={() => navigate("/home")}
                  className="px-4 py-3 font-semibold text-primary-deep underline-offset-4 hover:underline"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Continue as guest
                </motion.button>
              </motion.div>
            </div>

            <HeroPhones />
          </section>
        </div>

        {/* ---------- Features ---------- */}
        <section id="features" className="mx-auto max-w-6xl px-6 py-20">
          <motion.div {...reveal} className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-primary-deep">More than a feed</h2>
            <p className="mt-3 text-muted">
              ConnectSphere mixes social networking with learning, so every scroll teaches you something.
            </p>
          </motion.div>

          <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map(({ Icon, title, text }, i) => (
              <motion.div
                key={title}
                {...reveal}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                whileHover={{ y: -8 }}
                className="rounded-3xl bg-white/80 backdrop-blur p-6 shadow-lg"
              >
                <span className="w-12 h-12 rounded-2xl bg-linear-to-br from-primary-soft to-lavender-deep text-white flex items-center justify-center">
                  <Icon size={22} />
                </span>
                <h3 className="mt-4 font-bold">{title}</h3>
                <p className="mt-2 text-sm text-muted">{text}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ---------- Communities ---------- */}
        <section id="communities" className="bg-white/60 py-16 px-6">
          <motion.div {...reveal} className="mx-auto max-w-4xl text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-primary-deep">Pick a community</h2>
            <p className="mt-3 text-muted">Start with what you love, and discover more along the way.</p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              {communities.map((c, i) => (
                <motion.span
                  key={c}
                  {...reveal}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                  whileHover={{ scale: 1.08, y: -3 }}
                  className="px-5 py-2.5 rounded-full bg-surface border border-pale text-sm font-semibold text-primary-deep cursor-default"
                >
                  {c}
                </motion.span>
              ))}
            </div>
          </motion.div>
        </section>

        {/* ---------- Call to action ---------- */}
        <section className="mx-auto max-w-5xl px-6 py-20">
          <motion.div
            {...reveal}
            className="relative overflow-hidden rounded-[2rem] bg-linear-to-br from-primary via-lavender-deep to-rose p-10 md:p-14 text-center text-white shadow-2xl"
          >
            <span className="absolute -top-12 -left-12 w-48 h-48 rounded-full bg-white/20 blur-xl" />
            <span className="absolute -bottom-16 -right-10 w-56 h-56 rounded-full bg-white/20 blur-xl" />
            <h2 className="relative text-3xl md:text-4xl font-bold">Ready to join ConnectSphere?</h2>
            <p className="relative mt-3 opacity-90">Create your free account and find your community today.</p>
            <motion.button
              onClick={() => navigate("/register")}
              className="relative mt-8 px-8 py-3 rounded-full bg-white text-primary-deep font-semibold shadow-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Create my account
            </motion.button>
          </motion.div>
        </section>

        <footer className="pb-10 text-center text-sm text-muted">
          © 2026 ConnectSphere · Built with the MERN stack
        </footer>
      </div>
    </MotionConfig>
  );
}

export default Landing;
'@

Write-TextFile "src/pages/Login.jsx" @'
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock } from "lucide-react";
import AuthLayout from "../components/AuthLayout";
import InputField from "../components/InputField";
import api from "../services/api";

function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data } = await api.post("/auth/login", form);
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      navigate("/home");
    } catch (err) {
      setError(err.response?.data?.message || "Could not reach the server. Is it running?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Welcome back" subtitle="Login to continue">
      <form onSubmit={handleSubmit} className="space-y-4">
        <InputField Icon={Mail} name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} />
        <InputField Icon={Lock} name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} />

        {error && (
          <p className="text-sm text-rose-deep bg-petal rounded-2xl px-4 py-2 text-center">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-full bg-primary text-white font-semibold shadow-lg transition hover:-translate-y-0.5 disabled:opacity-60"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
      <p className="mt-5 text-center text-sm">
        New here?{" "}
        <Link to="/register" className="text-primary-deep font-semibold">
          Register
        </Link>
      </p>
      <p className="mt-2 text-center text-sm">
        <Link to="/home" className="text-muted font-semibold">
          Continue as guest
        </Link>
      </p>
    </AuthLayout>
  );
}

export default Login;
'@

Write-TextFile "src/pages/Register.jsx" @'
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, AtSign, Mail, Lock } from "lucide-react";
import AuthLayout from "../components/AuthLayout";
import InputField from "../components/InputField";
import api from "../services/api";

function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data } = await api.post("/auth/register", form);
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      navigate("/home");
    } catch (err) {
      setError(err.response?.data?.message || "Could not reach the server. Is it running?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Join ConnectSphere" subtitle="Create your account">
      <form onSubmit={handleSubmit} className="space-y-4">
        <InputField Icon={User} name="name" placeholder="Full name" value={form.name} onChange={handleChange} />
        <InputField Icon={AtSign} name="username" placeholder="Username" value={form.username} onChange={handleChange} />
        <InputField Icon={Mail} name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} />
        <InputField Icon={Lock} name="password" type="password" placeholder="Password (min 6 characters)" value={form.password} onChange={handleChange} />

        {error && (
          <p className="text-sm text-rose-deep bg-petal rounded-2xl px-4 py-2 text-center">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-full bg-primary text-white font-semibold shadow-lg transition hover:-translate-y-0.5 disabled:opacity-60"
        >
          {loading ? "Creating account..." : "Create account"}
        </button>
      </form>
      <p className="mt-5 text-center text-sm">
        Already have an account?{" "}
        <Link to="/login" className="text-primary-deep font-semibold">
          Login
        </Link>
      </p>
      <p className="mt-2 text-center text-sm">
        <Link to="/home" className="text-muted font-semibold">
          Continue as guest
        </Link>
      </p>
    </AuthLayout>
  );
}

export default Register;
'@

Write-TextFile "src/components/PostCard.jsx" @'
import { useState } from "react";
import { motion } from "framer-motion";
import { Heart, MessageCircle, Bookmark, Send, MoreVertical, Trash2 } from "lucide-react";
import api from "../services/api";
import Avatar from "./Avatar";
import CommentSection from "./CommentSection";
import timeAgo from "../utils/timeAgo";

const tagGradients = {
  General: "from-primary via-primary-soft to-lavender-deep",
  Study: "from-rose via-blush to-lavender-deep",
  Tips: "from-sky via-primary-soft to-primary",
  Travel: "from-blush via-lavender-deep to-primary-soft",
};

const chip =
  "flex items-center gap-2 px-4 py-2 rounded-full bg-white shadow text-sm font-medium";

function PostCard({ post, index, currentUserId, onDelete, guest = false, onRequireLogin }) {
  const [liked, setLiked] = useState(post.likedByMe);
  const [likes, setLikes] = useState(post.likes);
  const [saved, setSaved] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [commentCount, setCommentCount] = useState(post.commentsCount || 0);

  const author = post.author || { name: "Deleted user", username: "unknown" };
  const isOwn = post.author && post.author._id === currentUserId;
  const gradient = tagGradients[post.tag] || tagGradients.General;

  // Short text-only posts get a big "quote card" panel
  const isQuote = !post.image && post.text.length <= 160;

  const handleLike = async () => {
    if (guest) {
      onRequireLogin?.("like posts");
      return;
    }
    if (busy) return;
    setBusy(true);
    const wasLiked = liked;
    setLiked(!wasLiked);
    setLikes((n) => n + (wasLiked ? -1 : 1));
    try {
      const { data } = await api.put(`/posts/${post._id}/like`);
      setLiked(data.liked);
      setLikes(data.likes);
    } catch {
      setLiked(wasLiked);
      setLikes((n) => n + (wasLiked ? 1 : -1));
    } finally {
      setBusy(false);
    }
  };

  const handleDelete = async () => {
    setMenuOpen(false);
    if (!window.confirm("Delete this post?")) return;
    try {
      await api.delete(`/posts/${post._id}`);
      onDelete(post._id);
    } catch {
      alert("Could not delete the post. Please try again.");
    }
  };

  return (
    <motion.article
      className="glass rounded-[2rem]"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: Math.min(index, 4) * 0.08 }}
    >
      <div className="flex items-center gap-3 px-5 pt-5">
        <Avatar name={author.name} size={44} />
        <div className="leading-tight min-w-0">
          <p className="text-sm font-semibold truncate">{author.name}</p>
          <p className="text-xs text-muted truncate">
            @{author.username} · {timeAgo(post.createdAt)}
          </p>
        </div>

        <span className="ml-auto px-3 py-1 rounded-full bg-white/80 border border-pale text-xs font-semibold text-primary-deep">
          {post.tag}
        </span>

        {isOwn && (
          <div className="relative">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="w-8 h-8 rounded-full bg-white shadow flex items-center justify-center"
            >
              <MoreVertical size={16} />
            </button>
            {menuOpen && (
              <div className="absolute right-0 mt-2 z-20 min-w-40 rounded-2xl bg-white shadow-xl p-1">
                <button
                  onClick={handleDelete}
                  className="flex items-center gap-2 w-full px-3 py-2 rounded-xl text-sm text-rose-deep hover:bg-petal"
                >
                  <Trash2 size={15} /> Delete post
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {post.image && (
        <div className="mt-4 mx-4 h-72 rounded-3xl overflow-hidden">
          <img src={post.image} alt="" className="w-full h-full object-cover" />
        </div>
      )}

      {isQuote ? (
        <div
          className={`relative mt-4 mx-4 min-h-52 rounded-3xl overflow-hidden bg-linear-to-br ${gradient} flex items-center justify-center p-8`}
        >
          <span className="absolute -top-10 -right-8 w-40 h-40 rounded-full bg-white/25 blur-2xl" />
          <span className="absolute -bottom-12 -left-6 w-36 h-36 rounded-full bg-white/20 blur-2xl" />
          <span className="absolute top-3 left-6 text-7xl leading-none text-white/40 font-serif">“</span>
          <p className="relative text-center text-xl md:text-2xl font-medium italic text-white leading-snug break-words">
            {post.text}
          </p>
        </div>
      ) : (
        <p className="px-5 pt-4 text-[15px] leading-relaxed whitespace-pre-wrap break-words">
          {post.text}
        </p>
      )}

      <div className="flex items-center gap-3 px-4 py-4">
        <motion.button onClick={handleLike} whileTap={{ scale: 0.9 }} className={chip}>
          <motion.span
            className="flex"
            animate={liked ? { scale: [1, 1.5, 1] } : { scale: 1 }}
            transition={{ duration: 0.35 }}
          >
            <Heart size={18} fill={liked ? "#DE89A0" : "none"} className={liked ? "text-rose" : ""} />
          </motion.span>
          {likes}
        </motion.button>

        <motion.button
          onClick={() =>
            guest ? onRequireLogin?.("comment on posts") : setShowComments(!showComments)
          }
          whileTap={{ scale: 0.9 }}
          className={`${chip} ${showComments ? "ring-2 ring-primary-soft" : ""}`}
        >
          <MessageCircle size={18} /> {commentCount}
        </motion.button>

        <span className={`${chip} hidden sm:flex`}>
          <Send size={18} />
        </span>

        <motion.button
          onClick={() => setSaved(!saved)}
          whileTap={{ scale: 0.9 }}
          className={`${chip} ml-auto`}
        >
          <Bookmark size={18} fill={saved ? "#5790E0" : "none"} className={saved ? "text-primary" : ""} />
        </motion.button>
      </div>

      {showComments && (
        <CommentSection
          postId={post._id}
          currentUserId={currentUserId}
          postAuthorId={post.author?._id}
          onCountChange={setCommentCount}
        />
      )}
    </motion.article>
  );
}

export default PostCard;
'@

Write-TextFile "src/components/SideBar.jsx" @'
import { motion } from "framer-motion";
import { Home, Compass, Users, MessageCircle, Bell, User, Settings, LogOut } from "lucide-react";
import Avatar from "./Avatar";

const links = [
  { label: "Home", Icon: Home },
  { label: "Explore", Icon: Compass },
  { label: "Communities", Icon: Users },
  { label: "Messages", Icon: MessageCircle, badge: 3 },
  { label: "Notifications", Icon: Bell, badge: 5 },
  { label: "Profile", Icon: User },
  { label: "Settings", Icon: Settings },
];

function Sidebar({ user, onLogout, active = "Home", guest = false, onLogin }) {
  return (
    <aside className="hidden lg:flex self-start sticky top-4 h-[calc(100vh-2rem)] flex-col glass rounded-[2rem] p-5">
      <div className="flex items-center gap-2 px-2">
        <span className="w-9 h-9 rounded-full bg-linear-to-br from-rose to-primary shadow" />
        <span className="font-bold text-primary-deep text-lg">ConnectSphere</span>
      </div>

      <nav className="mt-8 flex flex-col gap-1">
        {links.map(({ label, Icon, badge }) => {
          const isActive = label === active;
          return (
            <motion.button
              key={label}
              whileHover={{ x: 4 }}
              className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium text-left transition ${
                isActive
                  ? "bg-linear-to-r from-primary to-primary-soft text-white shadow-lg"
                  : "text-ink/70 hover:bg-white/70"
              }`}
            >
              <Icon size={19} />
              {label}
              {badge && (
                <span
                  className={`ml-auto text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                    isActive ? "bg-white/25 text-white" : "bg-rose text-white"
                  }`}
                >
                  {badge}
                </span>
              )}
            </motion.button>
          );
        })}
      </nav>

      {guest ? (
        <div className="mt-auto rounded-3xl bg-white/70 p-4 text-center">
          <p className="text-sm font-semibold">Browsing as guest</p>
          <button
            onClick={onLogin}
            className="mt-3 w-full py-2 rounded-full bg-primary text-white text-sm font-semibold"
          >
            Login / Register
          </button>
        </div>
      ) : (
      <div className="mt-auto rounded-3xl bg-white/70 p-3 flex items-center gap-3">
        <Avatar name={user.name || "?"} size={40} />
        <div className="leading-tight min-w-0">
          <p className="text-sm font-semibold truncate">{user.name || "Friend"}</p>
          <p className="text-xs text-muted truncate">@{user.username}</p>
        </div>
        <button
          onClick={onLogout}
          title="Logout"
          className="ml-auto w-9 h-9 shrink-0 rounded-full flex items-center justify-center text-muted hover:bg-white transition"
        >
          <LogOut size={17} />
        </button>
      </div>
      )}
    </aside>
  );
}

export default Sidebar;
'@

Write-TextFile "src/components/LoginPrompt.jsx" @'
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

// Small popup that asks a guest to login before doing something
function LoginPrompt({ message, onClose }) {
  const navigate = useNavigate();

  return (
    <AnimatePresence>
      {message && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="glass w-full max-w-sm rounded-[2rem] p-7 text-center"
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold text-primary-deep">Login to continue</h2>
            <p className="mt-2 text-sm text-muted">
              Please login or create an account to {message}.
            </p>
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => navigate("/login")}
                className="flex-1 py-2.5 rounded-full bg-primary text-white font-semibold shadow"
              >
                Login
              </button>
              <button
                onClick={() => navigate("/register")}
                className="flex-1 py-2.5 rounded-full bg-white text-primary-deep font-semibold border border-pale"
              >
                Register
              </button>
            </div>
            <button onClick={onClose} className="mt-4 text-sm text-muted">
              Maybe later
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default LoginPrompt;
'@

Write-TextFile "src/utils/guest.js" @'
// A visitor without a login token is a "guest".
export function isGuest() {
  return !localStorage.getItem("token");
}

const minutesAgo = (n) => new Date(Date.now() - n * 60 * 1000).toISOString();

// Sample posts shown to guests (the real feed needs a login)
export function getSamplePosts(tag = "For you") {
  const posts = [
    {
      _id: "sample-1",
      author: { _id: "s-maya", name: "Maya Khan", username: "maya_k" },
      text: "Small steps every day still take you somewhere new.",
      tag: "General",
      likes: 24,
      likedByMe: false,
      commentsCount: 3,
      createdAt: minutesAgo(12),
    },
    {
      _id: "sample-2",
      author: { _id: "s-hassan", name: "Hassan Ali", username: "hassan.codes" },
      text: "Pomodoro tip that saved my exam week: 25 minutes of focus, then 5 minutes away from the screen. After four rounds take a longer break and write down what you remember without looking at your notes.",
      tag: "Study",
      likes: 58,
      likedByMe: false,
      commentsCount: 9,
      createdAt: minutesAgo(45),
    },
    {
      _id: "sample-3",
      author: { _id: "s-sara", name: "Sara Ahmed", username: "sara_a" },
      text: "Free tip: the library has silent rooms you can book online. Much better than studying in the cafeteria!",
      tag: "Tips",
      likes: 41,
      likedByMe: false,
      commentsCount: 6,
      createdAt: minutesAgo(120),
    },
    {
      _id: "sample-4",
      author: { _id: "s-bilal", name: "Bilal Raza", username: "bilal_r" },
      text: "Spent the weekend in Murree with friends. Cold air, hot tea and zero deadlines. Highly recommend a short break before finals!",
      tag: "Travel",
      likes: 77,
      likedByMe: false,
      commentsCount: 12,
      createdAt: minutesAgo(300),
    },
    {
      _id: "sample-5",
      author: { _id: "s-ayesha", name: "Ayesha Noor", username: "ayesha.n" },
      text: "Group study works best when everyone prepares one topic and teaches it to the others. You learn twice as much when you have to explain it out loud.",
      tag: "Study",
      likes: 35,
      likedByMe: false,
      commentsCount: 4,
      createdAt: minutesAgo(1440),
    },
    {
      _id: "sample-6",
      author: { _id: "s-team", name: "ConnectSphere Team", username: "connectsphere" },
      text: "Welcome to ConnectSphere! Login or create an account to share your own posts, like and comment.",
      tag: "General",
      likes: 102,
      likedByMe: false,
      commentsCount: 0,
      createdAt: minutesAgo(2880),
    },
  ];
  return tag === "For you" ? posts : posts.filter((p) => p.tag === tag);
}
'@


Write-Host ""
Write-Host "Guest mode added. If the site is running it will refresh by itself, otherwise run:  npm run dev" -ForegroundColor Green
if ($PSCommandPath) { Remove-Item -LiteralPath $PSCommandPath -Force -ErrorAction SilentlyContinue }