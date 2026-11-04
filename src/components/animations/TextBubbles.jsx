import { motion } from "framer-motion";

const items = [
  { label: "Learn", left: "5%", top: "16%", size: 100, color: "rgba(196,181,253,0.7)", duration: 6, delay: 0 },
  { label: "Share", left: "14%", top: "56%", size: 88, color: "rgba(191,219,254,0.8)", duration: 7, delay: 1 },
  { label: "Chat", left: "4%", top: "80%", size: 76, color: "rgba(139,156,244,0.6)", duration: 5, delay: 0.5 },
  { label: "Communities", left: "80%", top: "14%", size: 124, color: "rgba(191,219,254,0.8)", duration: 8, delay: 0.8 },
  { label: "Skills", left: "86%", top: "52%", size: 90, color: "rgba(196,181,253,0.7)", duration: 6.5, delay: 1.5 },
  { label: "Ideas", left: "76%", top: "78%", size: 80, color: "rgba(139,156,244,0.6)", duration: 5.5, delay: 0.3 },
];

function TextBubbles() {
  return (
    <div className="hidden md:block absolute inset-0 overflow-hidden pointer-events-none">
      {items.map((b, i) => (
        <motion.div
          key={b.label}
          className="absolute"
          style={{ left: b.left, top: b.top }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 120, damping: 12, delay: 1.5 + i * 0.2 }}
        >
          <motion.div
            className="rounded-full flex items-center justify-center text-center font-semibold text-primary pointer-events-auto cursor-default select-none"
            style={{
              width: b.size,
              height: b.size,
              fontSize: b.size * 0.15,
              background: `radial-gradient(circle at 30% 25%, rgba(255,255,255,0.95), ${b.color} 65%)`,
              border: "1px solid rgba(255,255,255,0.8)",
              boxShadow:
                "inset -6px -8px 16px rgba(139,156,244,0.25), 0 10px 28px rgba(79,70,229,0.18)",
            }}
            animate={{ y: [0, -18, 0], x: [0, 8, 0] }}
            transition={{ duration: b.duration, repeat: Infinity, ease: "easeInOut", delay: b.delay }}
            whileHover={{ scale: 1.15 }}
          >
            {b.label}
          </motion.div>
        </motion.div>
      ))}
    </div>
  );
}

export default TextBubbles;