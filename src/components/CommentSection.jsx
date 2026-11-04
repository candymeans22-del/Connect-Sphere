import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Send, Trash2 } from "lucide-react";
import api from "../services/api";
import Avatar from "./Avatar";
import timeAgo from "../utils/timeAgo";

function CommentSection({ postId, currentUserId, postAuthorId, onCountChange }) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const { data } = await api.get(`/posts/${postId}/comments`);
        if (!cancelled) setComments(data.comments);
      } catch {
        if (!cancelled) setError("Could not load comments.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [postId]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!text.trim() || sending) return;
    setSending(true);
    setError("");
    try {
      const { data } = await api.post(`/posts/${postId}/comments`, { text });
      setComments((prev) => [...prev, data.comment]);
      onCountChange(data.commentsCount);
      setText("");
    } catch (err) {
      setError(err.response?.data?.message || "Could not post your comment.");
    } finally {
      setSending(false);
    }
  };

  const handleDelete = async (commentId) => {
    try {
      const { data } = await api.delete(`/posts/${postId}/comments/${commentId}`);
      setComments((prev) => prev.filter((c) => c._id !== commentId));
      onCountChange(data.commentsCount);
    } catch {
      setError("Could not delete the comment.");
    }
  };

  return (
    <motion.div
      className="mx-4 mb-4 rounded-3xl bg-white/70 p-4"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {loading && <p className="text-sm text-muted text-center py-2">Loading comments...</p>}

      {!loading && comments.length === 0 && (
        <p className="text-sm text-muted text-center py-2">No comments yet. Say something nice!</p>
      )}

      <ul className="space-y-3">
        {comments.map((c) => {
          const name = c.author?.name || "Deleted user";
          const canDelete = c.author?._id === currentUserId || postAuthorId === currentUserId;
          return (
            <li key={c._id} className="flex gap-3">
              <Avatar name={name} size={32} />
              <div className="min-w-0 flex-1 rounded-2xl bg-surface px-4 py-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold truncate">{name}</span>
                  <span className="text-xs text-muted">{timeAgo(c.createdAt)}</span>
                  {canDelete && (
                    <button
                      onClick={() => handleDelete(c._id)}
                      title="Delete comment"
                      className="ml-auto text-muted hover:text-rose-deep transition"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
                <p className="text-sm break-words whitespace-pre-wrap">{c.text}</p>
              </div>
            </li>
          );
        })}
      </ul>

      {error && (
        <p className="mt-3 text-sm text-rose-deep bg-petal rounded-2xl px-4 py-2 text-center">
          {error}
        </p>
      )}

      <form onSubmit={handleSend} className="mt-3 flex items-center gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          maxLength={500}
          placeholder="Write a comment..."
          className="flex-1 rounded-full bg-white px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary-soft"
        />
        <button
          type="submit"
          disabled={sending || !text.trim()}
          className="w-10 h-10 rounded-full bg-linear-to-br from-primary to-rose text-white flex items-center justify-center shadow disabled:opacity-50"
        >
          <Send size={16} />
        </button>
      </form>
    </motion.div>
  );
}

export default CommentSection;