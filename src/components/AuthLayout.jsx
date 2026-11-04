import { Link } from "react-router-dom";
import { motion, MotionConfig } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import FloatingClouds from "./animations/FloatingClouds";
import FloatingBubbles from "./animations/FloatingBubbles";

function AuthLayout({ title, subtitle, children }) {
  return (
    <MotionConfig reducedMotion="user">
      <div className="relative min-h-screen overflow-hidden bg-linear-to-b from-sky-soft via-surface to-lavender flex items-center justify-center px-4 py-10">
        <FloatingClouds />
        <FloatingBubbles />

        <Link
          to="/"
          className="absolute top-6 left-6 z-20 flex items-center gap-2 text-sm font-semibold text-primary-deep"
        >
          <ArrowLeft size={18} /> Back
        </Link>

        <motion.div
          className="relative z-10 w-full max-w-md bg-white/80 backdrop-blur rounded-[2rem] shadow-2xl p-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <div className="mx-auto w-14 h-14 rounded-full bg-linear-to-br from-primary to-lavender-deep shadow-lg" />
          <h1 className="mt-4 text-3xl font-bold text-primary-deep text-center">{title}</h1>
          <p className="mt-1 text-center text-sm text-muted">{subtitle}</p>
          <div className="mt-6">{children}</div>
        </motion.div>
      </div>
    </MotionConfig>
  );
}

export default AuthLayout;