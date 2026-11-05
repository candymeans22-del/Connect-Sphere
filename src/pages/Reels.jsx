import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  Bookmark,
  Check,
  Clapperboard,
  Heart,
  MessageCircle,
  Play,
  Plus,
  Send,
  Volume2,
  VolumeX,
  X,
} from "lucide-react";
import FloatingBubbles from "../components/animations/FloatingBubbles";
import Sidebar from "../components/SideBar";
import BottomNav from "../components/BottomNav";
import Avatar from "../components/Avatar";
import LoginPrompt from "../components/LoginPrompt";
import useAuth from "../hooks/useAuth";

const meshStyle = {
  backgroundColor: "#E7EDF9",
  backgroundImage:
    "radial-gradient(at 8% 6%, #F6DEE5 0px, transparent 45%), radial-gradient(at 92% 4%, #CDE7F7 0px, transparent 45%), radial-gradient(at 80% 95%, #C6C8E2 0px, transparent 50%), radial-gradient(at 5% 90%, #EBBAC7 0px, transparent 45%)",
  backgroundAttachment: "fixed",
};

const MAX_VIDEO_MB = 50;

// Public sample videos for now. Later the videos will come from your backend.
// To use your own videos, put .mp4 files in the "public/videos" folder and use src: "/videos/my-video.mp4"
const BASE = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/";
const sampleReels = [
  {
    id: "r1",
    author: { name: "Sara Khan", username: "sarakhan" },
    caption: "Quick design tip: use only two fonts and a lot of white space.",
    tag: "Tips",
    likes: 1240,
    comments: 32,
    src: BASE + "ForBiggerBlazes.mp4",
  },
  {
    id: "r2",
    author: { name: "Hassan Ali", username: "hassan.codes" },
    caption: "My study setup for exam week. Pomodoro timer is a must!",
    tag: "Study",
    likes: 860,
    comments: 18,
    src: BASE + "ForBiggerEscapes.mp4",
  },
  {
    id: "r3",
    author: { name: "Bilal Raza", username: "bilal_r" },
    caption: "Weekend trip to the mountains. No deadlines, only tea.",
    tag: "Travel",
    likes: 2310,
    comments: 54,
    src: BASE + "ForBiggerJoyrides.mp4",
  },
  {
    id: "r4",
    author: { name: "Ayesha Noor", username: "ayesha.n" },
    caption: "Teaching a topic out loud is the fastest way to learn it.",
    tag: "Study",
    likes: 540,
    comments: 9,
    src: BASE + "ForBiggerFun.mp4",
  },
  {
    id: "r5",
    author: { name: "Ali Raza", username: "aliraza" },
    caption: "Debugging at 2 AM be like...",
    tag: "General",
    likes: 3120,
    comments: 87,
    src: BASE + "ForBiggerMeltdowns.mp4",
  },
];

const startingComments = [
  { id: 1, name: "Maya Khan", text: "This is so useful, thank you!" },
  { id: 2, name: "Zain Ahmed", text: "Please make more of these." },
];

const gradients = [
  "from-primary to-lavender-deep",
  "from-rose to-primary-soft",
  "from-sky to-primary",
  "from-blush to-lavender-deep",
];

function formatCount(n) {
  return n >= 1000 ? `${(n / 1000).toFixed(1).replace(".0", "")}k` : String(n);
}

function ReelItem({ reel, index, muted, onToggleMute, guest, requireLogin }) {
  const navigate = useNavigate();
  const boxRef = useRef(null);
  const videoRef = useRef(null);

  const [inView, setInView] = useState(false); // is this reel the one on screen?
  const [paused, setPaused] = useState(false); // did the user tap to pause?
  const [failed, setFailed] = useState(false); // video could not load
  const [progress, setProgress] = useState(0);

  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(reel.likes);
  const [saved, setSaved] = useState(false);
  const [following, setFollowing] = useState(false);
  const [burst, setBurst] = useState(false); // big heart on double tap
  const [copied, setCopied] = useState(false);

  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState(startingComments);
  const [commentText, setCommentText] = useState("");
  const [commentCount, setCommentCount] = useState(reel.comments);

  // Know when this reel is on screen
  useEffect(() => {
    const el = boxRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        const visible = entry.isIntersecting && entry.intersectionRatio >= 0.6;
        setInView(visible);
        if (!visible) setPaused(false);
      },
      { threshold: [0, 0.6, 1] }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Play the video that is on screen, pause the others
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (inView && !paused) {
      video.play().catch(() => {});
    } else {
      video.pause();
      if (!inView) video.currentTime = 0;
    }
  }, [inView, paused]);

  useEffect(() => {
    if (videoRef.current) videoRef.current.muted = muted;
  }, [muted]);

  const toggleLike = () => {
    if (guest) return requireLogin("like reels");
    setLiked(!liked);
    setLikes((n) => n + (liked ? -1 : 1));
  };

  const handleDoubleTap = () => {
    if (guest) return requireLogin("like reels");
    if (!liked) {
      setLiked(true);
      setLikes((n) => n + 1);
    }
    setBurst(true);
    setTimeout(() => setBurst(false), 700);
  };

  const handleShare = async () => {
    const link = `${window.location.origin}/reels?reel=${reel.id}`;
    try {
      await navigator.clipboard.writeText(link);
    } catch {
      window.prompt("Copy this link:", link);
      return;
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const addComment = (e) => {
    e.preventDefault();
    const text = commentText.trim();
    if (!text) return;
    setComments((prev) => [...prev, { id: Date.now(), name: "You", text }]);
    setCommentCount((n) => n + 1);
    setCommentText("");
  };

  const sideButton =
    "flex h-12 w-12 items-center justify-center rounded-full bg-black/35 text-white backdrop-blur pointer-events-auto";

  return (
    <div
      ref={boxRef}
      className="relative h-full w-full snap-start snap-always overflow-hidden rounded-[2rem] bg-ink"
    >
      {/* Video (or a coloured background if it cannot load) */}
      {failed ? (
        <div
          className={`absolute inset-0 flex items-center justify-center bg-linear-to-br ${
            gradients[index % gradients.length]
          } p-8 text-center text-sm text-white/90`}
        >
          This video could not be loaded.
        </div>
      ) : (
        <video
          ref={videoRef}
          src={reel.src}
          loop
          muted={muted}
          playsInline
          preload="metadata"
          onError={() => setFailed(true)}
          onTimeUpdate={(e) => {
            const v = e.currentTarget;
            if (v.duration) setProgress((v.currentTime / v.duration) * 100);
          }}
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}

      {/* Tap to pause or play, double tap to like */}
      <div
        className="absolute inset-0 z-0"
        onClick={() => setPaused((p) => !p)}
        onDoubleClick={handleDoubleTap}
      />

      <AnimatePresence>
        {paused && inView && (
          <motion.div
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center"
          >
            <span className="flex h-20 w-20 items-center justify-center rounded-full bg-black/40 text-white">
              <Play size={36} fill="white" />
            </span>
          </motion.div>
        )}
        {burst && (
          <motion.div
            initial={{ opacity: 1, scale: 0.4 }}
            animate={{ opacity: 0, scale: 1.6 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7 }}
            className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center"
          >
            <Heart size={96} fill="#DE89A0" className="text-rose" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Progress bar */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-1 bg-white/25">
        <div className="h-full bg-white" style={{ width: `${progress}%` }} />
      </div>

      {/* Dark fade so the text is easy to read */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-2/5 bg-linear-to-t from-black/70 to-transparent" />

      {/* Buttons on the right */}
      <div className="pointer-events-none absolute bottom-28 right-3 z-20 flex flex-col items-center gap-4 lg:bottom-8">
        <div className="flex flex-col items-center gap-1">
          <button onClick={toggleLike} className={sideButton}>
            <Heart size={22} fill={liked ? "#DE89A0" : "none"} className={liked ? "text-rose" : ""} />
          </button>
          <span className="text-xs font-semibold text-white">{formatCount(likes)}</span>
        </div>

        <div className="flex flex-col items-center gap-1">
          <button
            onClick={() => (guest ? requireLogin("comment on reels") : setShowComments(true))}
            className={sideButton}
          >
            <MessageCircle size={22} />
          </button>
          <span className="text-xs font-semibold text-white">{formatCount(commentCount)}</span>
        </div>

        <button onClick={handleShare} className={sideButton}>
          {copied ? <Check size={22} /> : <Send size={22} />}
        </button>

        <button onClick={() => setSaved(!saved)} className={sideButton}>
          <Bookmark size={22} fill={saved ? "#fff" : "none"} />
        </button>

        <button onClick={onToggleMute} className={sideButton}>
          {muted ? <VolumeX size={22} /> : <Volume2 size={22} />}
        </button>
      </div>

      {/* Author and caption on the bottom left */}
      <div className="pointer-events-none absolute bottom-28 left-4 right-20 z-20 text-white lg:bottom-8">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(`/profile/${reel.author.username}`)}
            className="pointer-events-auto flex min-w-0 items-center gap-2"
          >
            <Avatar name={reel.author.name} size={40} className="border-2 border-white" />
            <span className="truncate text-sm font-semibold">@{reel.author.username}</span>
          </button>
          <button
            onClick={() => (guest ? requireLogin("follow people") : setFollowing(!following))}
            className="pointer-events-auto rounded-full border border-white/80 px-3 py-1 text-xs font-semibold"
          >
            {following ? "Following" : "Follow"}
          </button>
        </div>
        <p className="mt-3 text-sm leading-snug">{reel.caption}</p>
        <span className="mt-2 inline-block rounded-full bg-white/20 px-3 py-1 text-xs font-semibold backdrop-blur">
          {reel.tag}
        </span>
      </div>

      {/* Comments sheet */}
      <AnimatePresence>
        {showComments && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="absolute inset-x-0 bottom-0 z-30 flex max-h-[70%] flex-col rounded-t-[2rem] bg-white"
          >
            <div className="flex items-center p-4">
              <h3 className="font-bold text-primary-deep">Comments</h3>
              <button onClick={() => setShowComments(false)} className="ml-auto text-muted">
                <X size={20} />
              </button>
            </div>
            <ul className="flex-1 space-y-3 overflow-y-auto px-4 pb-2">
              {comments.map((c) => (
                <li key={c.id} className="flex items-start gap-3">
                  <Avatar name={c.name} size={32} />
                  <div className="leading-snug">
                    <p className="text-xs font-semibold">{c.name}</p>
                    <p className="text-sm">{c.text}</p>
                  </div>
                </li>
              ))}
            </ul>
            <form onSubmit={addComment} className="flex items-center gap-2 border-t border-pale/60 p-3">
              <input
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Add a comment..."
                className="flex-1 rounded-full bg-surface px-4 py-2.5 text-sm outline-none"
              />
              <button
                type="submit"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-linear-to-br from-rose to-primary text-white"
              >
                <Send size={16} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function AddReelModal({ open, onClose, onAdd }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [caption, setCaption] = useState("");
  const [error, setError] = useState("");
  const inputRef = useRef(null);

  const reset = () => {
    if (preview) URL.revokeObjectURL(preview);
    setFile(null);
    setPreview("");
    setCaption("");
    setError("");
  };

  const close = () => {
    reset();
    onClose();
  };

  const choose = (e) => {
    const picked = e.target.files?.[0];
    if (!picked) return;
    if (!picked.type.startsWith("video/")) {
      setError("Please choose a video file");
      return;
    }
    if (picked.size > MAX_VIDEO_MB * 1024 * 1024) {
      setError(`Video must be smaller than ${MAX_VIDEO_MB} MB`);
      return;
    }
    setError("");
    if (preview) URL.revokeObjectURL(preview);
    setFile(picked);
    setPreview(URL.createObjectURL(picked));
  };

  const submit = (e) => {
    e.preventDefault();
    if (!file) {
      setError("Choose a video first");
      return;
    }
    onAdd({ src: preview, caption: caption.trim() || "My new reel" });
    setFile(null);
    setPreview(""); // the reel keeps using this video address, so do not revoke it
    setCaption("");
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 px-4"
          onClick={close}
        >
          <motion.form
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            onSubmit={submit}
            className="max-h-[90dvh] w-full max-w-md overflow-y-auto rounded-[2rem] bg-white p-6 shadow-2xl"
          >
            <div className="flex items-center">
              <h2 className="text-lg font-bold text-primary-deep">Add a reel</h2>
              <button type="button" onClick={close} className="ml-auto text-muted">
                <X size={20} />
              </button>
            </div>

            {preview ? (
              <video
                src={preview}
                controls
                playsInline
                className="mt-4 max-h-64 w-full rounded-3xl bg-ink object-contain"
              />
            ) : (
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="mt-4 flex h-40 w-full flex-col items-center justify-center gap-2 rounded-3xl border-2 border-dashed border-pale text-sm font-semibold text-primary-deep"
              >
                <Clapperboard size={28} /> Choose a video
              </button>
            )}
            <input ref={inputRef} type="file" accept="video/*" onChange={choose} className="hidden" />

            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              maxLength={150}
              rows={2}
              placeholder="Write a caption..."
              className="mt-3 w-full resize-none rounded-2xl border border-pale px-4 py-3 text-sm outline-none focus:border-primary"
            />

            {error && (
              <p className="mt-3 rounded-2xl bg-petal px-4 py-2 text-center text-sm text-rose-deep">
                {error}
              </p>
            )}

            <button
              type="submit"
              className="mt-4 w-full rounded-full bg-linear-to-br from-rose to-primary py-3 text-sm font-semibold text-white shadow-lg"
            >
              Post reel
            </button>
          </motion.form>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Reels() {
  const navigate = useNavigate();
  const { guest, user, logout } = useAuth();

  const [reels, setReels] = useState(sampleReels);
  const [muted, setMuted] = useState(true); // browsers only autoplay muted videos
  const [showAdd, setShowAdd] = useState(false);
  const [prompt, setPrompt] = useState("");
  const scrollRef = useRef(null);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // Arrow keys move to the next or previous reel on a computer
  useEffect(() => {
    const onKey = (e) => {
      if (showAdd || !scrollRef.current) return;
      if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;
      const box = scrollRef.current;
      if (e.key === "ArrowDown") box.scrollBy({ top: box.clientHeight, behavior: "smooth" });
      if (e.key === "ArrowUp") box.scrollBy({ top: -box.clientHeight, behavior: "smooth" });
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [showAdd]);

  const openAdd = () => (guest ? setPrompt("upload a reel") : setShowAdd(true));

  const addReel = ({ src, caption }) => {
    const newReel = {
      id: `local-${Date.now()}`,
      author: { name: user.name, username: user.username },
      caption,
      tag: "General",
      likes: 0,
      comments: 0,
      src,
    };
    setReels((prev) => [newReel, ...prev]);
    scrollRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="relative min-h-screen overflow-hidden" style={meshStyle}>
      <FloatingBubbles />

      <div className="relative z-10 mx-auto max-w-7xl px-4 lg:px-6 py-4 lg:grid lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-6">
        <Sidebar
          user={user}
          onLogout={handleLogout}
          active="Reels"
          guest={guest}
          onLogin={() => navigate("/login")}
        />

        <main className="min-w-0">
          <div className="relative mx-auto h-[calc(100dvh-2rem)] w-full max-w-[430px]">
            {/* Title and Add button on top of the videos */}
            <div className="pointer-events-none absolute inset-x-0 top-0 z-20 flex items-center p-4 text-white">
              <h1 className="flex items-center gap-2 text-lg font-bold drop-shadow">
                <Clapperboard size={20} /> Reels
              </h1>
              <button
                onClick={openAdd}
                className="pointer-events-auto ml-auto flex items-center gap-1.5 rounded-full bg-black/35 px-4 py-2 text-xs font-semibold backdrop-blur"
              >
                <Plus size={14} /> Add reel
              </button>
            </div>

            <div
              ref={scrollRef}
              className="no-scrollbar h-full snap-y snap-mandatory overflow-y-auto rounded-[2rem]"
            >
              {reels.map((reel, i) => (
                <ReelItem
                  key={reel.id}
                  reel={reel}
                  index={i}
                  muted={muted}
                  onToggleMute={() => setMuted(!muted)}
                  guest={guest}
                  requireLogin={setPrompt}
                />
              ))}
            </div>
          </div>
        </main>
      </div>

      <BottomNav active={5} username={user.username} />
      <AddReelModal open={showAdd} onClose={() => setShowAdd(false)} onAdd={addReel} />
      <LoginPrompt message={prompt} onClose={() => setPrompt("")} />
    </div>
  );
}

export default Reels;