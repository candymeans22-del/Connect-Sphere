import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Home, Compass, Clapperboard, MessageCircle, User, Plus } from "lucide-react";

// "id" is the number each page passes as the "active" prop
// (Home 0, Explore 1, Chat 3, Profile 4, Reels 5)
const items = [
  { id: 0, Icon: Home, path: "/home" },
  { id: 1, Icon: Compass, path: "/explore" },
  { id: 5, Icon: Clapperboard, path: "/reels" },
  { id: "plus" },
  { id: 3, Icon: MessageCircle, path: "/chat" },
  { id: 4, Icon: User }, // profile path depends on the username
];

function BottomNav({ active = 0, onPlus, username = "guest" }) {
  const navigate = useNavigate();

  return (
    <div className="lg:hidden fixed bottom-5 inset-x-0 z-30 flex justify-center pointer-events-none">
      <div className="pointer-events-auto flex items-center gap-1.5 rounded-full bg-dusk p-2 shadow-2xl">
        {items.map(({ id, Icon, path }) =>
          id === "plus" ? (
            <motion.button
              key={id}
              onClick={onPlus}
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              className="w-12 h-12 rounded-full bg-linear-to-br from-rose to-primary text-white flex items-center justify-center shadow-lg"
            >
              <Plus size={24} strokeWidth={3} />
            </motion.button>
          ) : (
            <motion.button
              key={id}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.92 }}
              onClick={() => navigate(id === 4 ? `/profile/${username}` : path)}
              className={`w-11 h-11 rounded-full flex items-center justify-center ${
                id === active ? "bg-white text-dusk" : "bg-white/10 text-white"
              }`}
            >
              <Icon size={20} />
            </motion.button>
          )
        )}
      </div>
    </div>
  );
}

export default BottomNav;