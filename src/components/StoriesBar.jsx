import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import Photo from "./Photo";
import Avatar from "./Avatar";

const stories = [
  { name: "Sara", photo: "photo1", gradient: "from-blush to-lavender-deep" },
  { name: "Ali", photo: "photo2", gradient: "from-sky to-primary-soft" },
  { name: "Maya", photo: "photo3", gradient: "from-rose to-lavender" },
  { name: "Zain", photo: "photo4", gradient: "from-lavender-deep to-primary" },
  { name: "Noor", photo: "photo5", gradient: "from-blush to-sky" },
];

function StoriesBar({ userName }) {
  return (
    <div className="no-scrollbar flex gap-3 overflow-x-auto py-2 -mx-1 px-1">
      <motion.button
        className="glass shrink-0 w-24 h-36 rounded-3xl flex flex-col items-center justify-center gap-2"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        whileHover={{ y: -4 }}
        whileTap={{ scale: 0.96 }}
      >
        <span className="relative">
          <Avatar name={userName} size={52} />
          <span className="absolute -bottom-1 -right-1 bg-primary text-white rounded-full p-0.5 border-2 border-white">
            <Plus size={12} />
          </span>
        </span>
        <span className="text-xs font-medium">Your Story</span>
      </motion.button>

      {stories.map((s, i) => (
        <motion.button
          key={s.name}
          className="shrink-0 p-[2.5px] rounded-[1.65rem] bg-linear-to-br from-primary via-lavender-deep to-rose shadow"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.08 * (i + 1) }}
          whileHover={{ y: -4 }}
          whileTap={{ scale: 0.96 }}
        >
          <span className={`relative block w-[92px] h-[138px] rounded-3xl overflow-hidden bg-linear-to-br ${s.gradient}`}>
            <Photo name={s.photo} />
            <span className="absolute top-2 left-2">
              <Avatar name={s.name} size={28} className="ring-2 ring-white" />
            </span>
            <span className="absolute inset-x-0 bottom-0 p-2 pt-8 bg-linear-to-t from-ink/60 to-transparent text-left text-xs font-semibold text-white">
              {s.name}
            </span>
          </span>
        </motion.button>
      ))}
    </div>
  );
}

export default StoriesBar;