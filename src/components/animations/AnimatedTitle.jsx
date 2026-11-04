import { motion } from "framer-motion";

function AnimatedTitle({ text }) {
  return (
    <motion.h1
      className="text-5xl md:text-7xl font-bold text-primary flex justify-center"
      initial="hidden"
      animate="visible"
      aria-label={text}
      variants={{ visible: { transition: { staggerChildren: 0.06 } } }}
    >
      {text.split("").map((char, i) => (
        <motion.span
          key={i}
          aria-hidden="true"
          className="inline-block"
          variants={{
            hidden: { opacity: 0, y: 40, filter: "blur(8px)" },
            visible: {
              opacity: 1,
              y: 0,
              filter: "blur(0px)",
              transition: { duration: 0.6 },
            },
          }}
        >
          {char}
        </motion.span>
      ))}
    </motion.h1>
  );
}

export default AnimatedTitle;