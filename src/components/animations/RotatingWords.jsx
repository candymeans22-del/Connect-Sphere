import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const words = ["learn", "share", "connect", "grow", "create"];

function RotatingWords() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % words.length);
    }, 2200);
    return () => clearInterval(timer);
  }, []);

  return (
    <p className="mt-6 text-2xl md:text-3xl font-semibold flex items-center justify-center lg:justify-start gap-3">
      <span>A place to</span>
      <span className="relative inline-flex h-10 w-36 md:w-44 items-center overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.span
            key={words[index]}
            className="absolute left-0 text-primary"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -24 }}
            transition={{ duration: 0.4 }}
          >
            {words[index]}
          </motion.span>
        </AnimatePresence>
      </span>
    </p>
  );
}

export default RotatingWords;