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