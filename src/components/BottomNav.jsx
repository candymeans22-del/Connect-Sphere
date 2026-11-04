import { motion } from "framer-motion";
import { Home, Compass, MessageCircle, User, Plus } from "lucide-react";

const items = [Home, Compass, "plus", MessageCircle, User];

function BottomNav({ active = 0, onPlus }) {
  return (
    <div className="lg:hidden fixed bottom-5 inset-x-0 z-30 flex justify-center pointer-events-none">
      <div className="pointer-events-auto flex items-center gap-2 rounded-full bg-dusk p-2 shadow-2xl">
        {items.map((Item, i) =>
          Item === "plus" ? (
            <motion.button
              key={i}
              onClick={onPlus}
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              className="w-14 h-14 rounded-full bg-linear-to-br from-rose to-primary text-white flex items-center justify-center shadow-lg"
            >
              <Plus size={26} strokeWidth={3} />
            </motion.button>
          ) : (
            <motion.button
              key={i}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.92 }}
              className={`w-12 h-12 rounded-full flex items-center justify-center ${
                i === active ? "bg-white text-dusk" : "bg-white/10 text-white"
              }`}
            >
              <Item size={20} />
            </motion.button>
          )
        )}
      </div>
    </div>
  );
}

export default BottomNav;