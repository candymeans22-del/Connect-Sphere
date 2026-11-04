import { motion } from "framer-motion";
import { PenLine, Compass } from "lucide-react";

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

function Ring({ value }) {
  const r = 34;
  const c = 2 * Math.PI * r;
  return (
    <svg width="92" height="92" viewBox="0 0 92 92" className="shrink-0">
      <circle cx="46" cy="46" r={r} stroke="rgba(255,255,255,0.3)" strokeWidth="8" fill="none" />
      <motion.circle
        cx="46"
        cy="46"
        r={r}
        stroke="#ffffff"
        strokeWidth="8"
        fill="none"
        strokeLinecap="round"
        strokeDasharray={c}
        initial={{ strokeDashoffset: c }}
        animate={{ strokeDashoffset: c * (1 - value / 100) }}
        transition={{ duration: 1.4, delay: 0.5, ease: "easeOut" }}
        transform="rotate(-90 46 46)"
      />
      <text x="46" y="51" textAnchor="middle" fill="#ffffff" fontSize="17" fontWeight="700">
        {value}%
      </text>
    </svg>
  );
}

function HeroCard({ name, onCreate }) {
  const first = (name || "friend").split(" ")[0];
  return (
    <motion.section
      className="relative overflow-hidden rounded-[2rem] bg-linear-to-br from-primary via-lavender-deep to-rose p-6 text-white shadow-2xl"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
    >
      <span className="absolute -top-14 -right-10 w-48 h-48 rounded-full bg-white/20 blur-2xl" />
      <span className="absolute -bottom-16 left-10 w-44 h-44 rounded-full bg-white/15 blur-2xl" />

      <div className="relative flex items-center justify-between gap-4">
        <div>
          <p className="text-sm opacity-90">{greeting()},</p>
          <h1 className="mt-1 text-3xl font-semibold leading-tight">
            {first}, share your{" "}
            <span className="italic font-light">moment</span>
          </h1>
          <div className="mt-5 flex flex-wrap gap-3">
            <button
              onClick={onCreate}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-primary-deep text-sm font-semibold shadow-lg transition hover:-translate-y-0.5"
            >
              <PenLine size={16} /> Create post
            </button>
            <button className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/20 backdrop-blur text-sm font-semibold border border-white/40 transition hover:-translate-y-0.5">
              <Compass size={16} /> Explore
            </button>
          </div>
        </div>

        <div className="hidden sm:flex flex-col items-center gap-1">
          <Ring value={72} />
          <span className="text-xs opacity-90">Engagement</span>
        </div>
      </div>
    </motion.section>
  );
}

export default HeroCard;