import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, Globe, Users, Lock, ImagePlus } from "lucide-react";
import api from "../services/api";
import Avatar from "./Avatar";

const tags = ["General", "Study", "Tips", "Travel"];
const visibilities = [
  { value: "public", label: "Public", Icon: Globe },
  { value: "followers", label: "Followers", Icon: Users },
  { value: "private", label: "Only me", Icon: Lock },
];

const MAX_IMAGE_MB = 2;

// localOnly = true means the server is not connected, so the post is only created on this page
function CreatePostModal({ open, onClose, onCreated, user, localOnly = false }) {
  const [text, setText] = useState("");
  const [tag, setTag] = useState("General");
  const [visibility, setVisibility] = useState("public");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(""); // the chosen picture as a data URL
  const fileRef = useRef(null);

  // Close with the Escape key
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // Read the chosen picture so we can show a preview
  const handleImage = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Please choose an image file");
      return;
    }
    if (file.size > MAX_IMAGE_MB * 1024 * 1024) {
      setError(`Image must be smaller than ${MAX_IMAGE_MB} MB`);
      return;
    }
    setError("");
    const reader = new FileReader();
    reader.onload = () => setImage(reader.result);
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImage("");
    if (fileRef.current) fileRef.current.value = "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) {
      setError("Write something first");
      return;
    }
    setError("");
    setLoading(true);
    try {
      let post;
      if (localOnly) {
        // No backend yet: build the post here so you can see it in the feed
        post = {
          _id: `sample-${Date.now()}`,
          author: { _id: user._id, name: user.name, username: user.username },
          text,
          tag,
          visibility,
          image,
          likes: 0,
          likedByMe: false,
          commentsCount: 0,
          createdAt: new Date().toISOString(),
        };
      } else {
        const { data } = await api.post("/posts", { text, tag, visibility, image });
        post = data.post;
      }
      onCreated(post);
      setText("");
      setTag("General");
      setVisibility("public");
      removeImage();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Could not reach the server. Is it running?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-ink/40 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.form
            onClick={(e) => e.stopPropagation()}
            onSubmit={handleSubmit}
            className="w-full max-w-lg max-h-[90dvh] overflow-y-auto rounded-[2rem] bg-white p-6 shadow-2xl"
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
          >
            <div className="flex items-center gap-3">
              <Avatar name={user.name || "?"} size={44} />
              <div className="leading-tight">
                <p className="font-bold text-primary-deep">Create post</p>
                <p className="text-xs text-muted">Share something with your community</p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="ml-auto w-9 h-9 rounded-full bg-surface flex items-center justify-center"
              >
                <X size={18} />
              </button>
            </div>

            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              maxLength={1000}
              rows={5}
              placeholder="What would you like to share today?"
              className="mt-4 w-full resize-none rounded-3xl bg-surface p-4 text-sm outline-none focus:ring-2 focus:ring-primary-soft"
            />
            <p className="mt-1 text-right text-xs text-muted">{text.length}/1000</p>

            {image ? (
              <div className="relative mt-3 overflow-hidden rounded-3xl">
                <img src={image} alt="Preview" className="max-h-60 w-full object-cover" />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="mt-3 flex items-center gap-2 rounded-full bg-surface px-4 py-2 text-sm font-semibold text-primary-deep"
              >
                <ImagePlus size={16} /> Add photo
              </button>
            )}
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              onChange={handleImage}
              className="hidden"
            />

            <p className="mt-3 text-xs font-semibold text-muted">Topic</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {tags.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTag(t)}
                  className={`px-4 py-1.5 rounded-full text-sm font-semibold transition ${
                    tag === t
                      ? "bg-linear-to-r from-primary to-rose text-white shadow"
                      : "bg-surface text-ink/70"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            <p className="mt-4 text-xs font-semibold text-muted">Who can see it</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {visibilities.map(({ value, label, Icon }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setVisibility(value)}
                  className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold transition ${
                    visibility === value
                      ? "bg-primary text-white shadow"
                      : "bg-surface text-ink/70"
                  }`}
                >
                  <Icon size={15} /> {label}
                </button>
              ))}
            </div>

            {error && (
              <p className="mt-4 text-sm text-rose-deep bg-petal rounded-2xl px-4 py-2 text-center">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-5 w-full py-3 rounded-full bg-linear-to-r from-primary to-rose text-white font-semibold shadow-lg transition hover:-translate-y-0.5 disabled:opacity-60"
            >
              {loading ? "Posting..." : "Post"}
            </button>
          </motion.form>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default CreatePostModal;