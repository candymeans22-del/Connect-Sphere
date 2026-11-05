import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart, MessageCircle, Bookmark, Send, MoreVertical, Trash2, Pencil, Check } from "lucide-react";
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
  const navigate = useNavigate();
  const [liked, setLiked] = useState(post.likedByMe);
  const [likes, setLikes] = useState(post.likes);
  const [saved, setSaved] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [commentCount, setCommentCount] = useState(post.commentsCount || 0);
  const [text, setText] = useState(post.text); // the post text (changes when edited)
  const [edited, setEdited] = useState(false);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState("");
  const [copied, setCopied] = useState(false);

  const author = post.author || { name: "Deleted user", username: "unknown" };
  const isOwn = post.author && post.author._id === currentUserId;
  const gradient = tagGradients[post.tag] || tagGradients.General;

  // Short text-only posts get a big "quote card" panel
  const isQuote = !post.image && text.length <= 160;

  // Sample posts (shown while the backend is not connected) are changed only on this page
  const isSample = String(post._id).startsWith("sample-");

  const handleLike = async () => {
    if (guest) {
      onRequireLogin?.("like posts");
      return;
    }
    if (busy) return;
    const wasLiked = liked;
    setLiked(!wasLiked);
    setLikes((n) => n + (wasLiked ? -1 : 1));
    if (isSample) return;
    setBusy(true);
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
    if (isSample) {
      onDelete(post._id);
      return;
    }
    try {
      await api.delete(`/posts/${post._id}`);
      onDelete(post._id);
    } catch {
      alert("Could not delete the post. Please try again.");
    }
  };

  const startEdit = () => {
    setMenuOpen(false);
    setDraft(text);
    setEditing(true);
  };

  const saveEdit = async () => {
    const newText = draft.trim();
    if (!newText) return;
    if (!isSample) {
      try {
        await api.put(`/posts/${post._id}`, { text: newText });
      } catch {
        alert("Could not save your changes. Please try again.");
        return;
      }
    }
    setText(newText);
    setEdited(true);
    setEditing(false);
  };

  // Share = copy a link to this post
  const handleShare = async () => {
    const link = `${window.location.origin}/home?post=${post._id}`;
    try {
      await navigator.clipboard.writeText(link);
    } catch {
      window.prompt("Copy this link:", link);
      return;
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.article
      className="glass rounded-[2rem]"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: Math.min(index, 4) * 0.08 }}
    >
      <div className="flex items-center gap-3 px-5 pt-5">
        <button onClick={() => navigate(`/profile/${author.username}`)}>
          <Avatar name={author.name} size={44} />
        </button>
        <div className="leading-tight min-w-0">
          <p className="text-sm font-semibold truncate">{author.name}</p>
          <p className="text-xs text-muted truncate">
            @{author.username} · {timeAgo(post.createdAt)}{edited ? " · edited" : ""}
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
                  onClick={startEdit}
                  className="flex items-center gap-2 w-full px-3 py-2 rounded-xl text-sm text-ink hover:bg-surface"
                >
                  <Pencil size={15} /> Edit post
                </button>
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

      {editing ? (
        <div className="px-5 pt-4">
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            maxLength={1000}
            rows={4}
            autoFocus
            className="w-full resize-none rounded-3xl bg-white p-4 text-sm outline-none ring-2 ring-primary-soft"
          />
          <div className="mt-2 flex justify-end gap-2">
            <button
              onClick={() => setEditing(false)}
              className="px-4 py-1.5 rounded-full bg-white text-sm font-semibold shadow"
            >
              Cancel
            </button>
            <button
              onClick={saveEdit}
              className="flex items-center gap-1 px-4 py-1.5 rounded-full bg-primary text-white text-sm font-semibold shadow"
            >
              <Check size={15} /> Save
            </button>
          </div>
        </div>
      ) : isQuote ? (
        <div
          className={`relative mt-4 mx-4 min-h-52 rounded-3xl overflow-hidden bg-linear-to-br ${gradient} flex items-center justify-center p-8`}
        >
          <span className="absolute -top-10 -right-8 w-40 h-40 rounded-full bg-white/25 blur-2xl" />
          <span className="absolute -bottom-12 -left-6 w-36 h-36 rounded-full bg-white/20 blur-2xl" />
          <span className="absolute top-3 left-6 text-7xl leading-none text-white/40 font-serif">“</span>
          <p className="relative text-center text-xl md:text-2xl font-medium italic text-white leading-snug break-words">
            {text}
          </p>
        </div>
      ) : (
        <p className="px-5 pt-4 text-[15px] leading-relaxed whitespace-pre-wrap break-words">
          {text}
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

        <motion.button onClick={handleShare} whileTap={{ scale: 0.9 }} className={chip}>
          {copied ? <Check size={18} className="text-primary" /> : <Send size={18} />}
          {copied && <span className="text-xs">Link copied</span>}
        </motion.button>

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