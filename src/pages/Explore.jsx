import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, TrendingUp, Users } from "lucide-react";
import FloatingBubbles from "../components/animations/FloatingBubbles";
import Sidebar from "../components/SideBar";
import BottomNav from "../components/BottomNav";
import useAuth from "../hooks/useAuth";
import Avatar from "../components/Avatar";

const meshStyle = {
  backgroundColor: "#E7EDF9",
  backgroundImage:
    "radial-gradient(at 8% 6%, #F6DEE5 0px, transparent 45%), radial-gradient(at 92% 4%, #CDE7F7 0px, transparent 45%), radial-gradient(at 80% 95%, #C6C8E2 0px, transparent 50%), radial-gradient(at 5% 90%, #EBBAC7 0px, transparent 45%)",
  backgroundAttachment: "fixed",
};

// Sample data for now. Later this will come from the API.
const trending = [
  { tag: "#ReactTips", count: "1.2k posts" },
  { tag: "#StudyNotes", count: "980 posts" },
  { tag: "#WebDesign", count: "740 posts" },
  { tag: "#MongoDB", count: "512 posts" },
  { tag: "#Cybersecurity", count: "430 posts" },
];

const communities = [
  { name: "Programming", members: "12k members" },
  { name: "Web Development", members: "9.8k members" },
  { name: "Graphic Design", members: "8.4k members" },
  { name: "Cybersecurity", members: "5.1k members" },
  { name: "Education", members: "4.7k members" },
  { name: "Gaming", members: "3.9k members" },
];

const people = [
  { name: "Sara Khan", username: "sarakhan", bio: "UI designer and coffee lover" },
  { name: "Ali Raza", username: "aliraza", bio: "Backend dev, Node.js and MongoDB" },
  { name: "Maya Khan", username: "maya_k", bio: "Web dev student sharing study tips" },
  { name: "Hassan Ali", username: "hassan.codes", bio: "Pomodoro fan and exam survivor" },
];

function FollowButton() {
  const [on, setOn] = useState(false);
  return (
    <button
      onClick={() => setOn(!on)}
      className={`ml-auto px-4 py-1.5 rounded-full text-xs font-semibold transition ${
        on ? "bg-white text-primary-deep border border-pale" : "bg-primary text-white shadow"
      }`}
    >
      {on ? "Following" : "Follow"}
    </button>
  );
}

function JoinButton() {
  const [on, setOn] = useState(false);
  return (
    <button
      onClick={() => setOn(!on)}
      className={`ml-auto px-4 py-1.5 rounded-full text-xs font-semibold transition ${
        on ? "bg-white text-primary-deep border border-pale" : "bg-rose text-white shadow"
      }`}
    >
      {on ? "Joined" : "Join"}
    </button>
  );
}

function Explore() {
  const navigate = useNavigate();
  const { guest, user, logout } = useAuth();
  const [query, setQuery] = useState("");

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // Filter everything by what the user typed in the search box
  const q = query.trim().toLowerCase();
  const matchTrending = trending.filter((t) => t.tag.toLowerCase().includes(q));
  const matchCommunities = communities.filter((c) => c.name.toLowerCase().includes(q));
  const matchPeople = people.filter(
    (p) => p.name.toLowerCase().includes(q) || p.username.toLowerCase().includes(q)
  );
  const nothingFound =
    matchTrending.length === 0 && matchCommunities.length === 0 && matchPeople.length === 0;

  return (
    <div className="relative min-h-screen overflow-hidden" style={meshStyle}>
      <FloatingBubbles />

      <div className="relative z-10 mx-auto max-w-7xl px-4 lg:px-6 py-4 lg:grid lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-6">
        <Sidebar
          user={user}
          onLogout={handleLogout}
          active="Explore"
          guest={guest}
          onLogin={() => navigate("/login")}
        />

        <main className="min-w-0 w-full max-w-2xl mx-auto lg:mx-0 pb-32 lg:pb-10 space-y-6">
          <div className="glass flex items-center gap-3 rounded-full px-5 py-3">
            <Search size={18} className="text-primary-soft" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search people, communities, topics..."
              className="bg-transparent outline-none text-sm w-full"
            />
          </div>

          {nothingFound && (
            <div className="glass rounded-[2rem] p-8 text-center text-muted">
              Nothing found for "{query}". Try another word.
            </div>
          )}

          {matchTrending.length > 0 && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass rounded-[2rem] p-5"
            >
              <h3 className="flex items-center gap-2 font-bold text-primary-deep">
                <TrendingUp size={18} /> Trending now
              </h3>
              <ul className="mt-3 space-y-3">
                {matchTrending.map((t) => (
                  <li key={t.tag}>
                    <p className="text-sm font-semibold">{t.tag}</p>
                    <p className="text-xs text-muted">{t.count}</p>
                  </li>
                ))}
              </ul>
            </motion.section>
          )}

          {matchCommunities.length > 0 && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="glass rounded-[2rem] p-5"
            >
              <div className="flex items-center">
                <h3 className="flex items-center gap-2 font-bold text-primary-deep">
                  <Users size={18} /> Communities
                </h3>
                <button
                  onClick={() => navigate("/communities")}
                  className="ml-auto text-xs font-semibold text-primary"
                >
                  See all
                </button>
              </div>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                {matchCommunities.map((c) => (
                  <motion.div
                    key={c.name}
                    whileHover={{ y: -4 }}
                    className="flex items-center gap-3 rounded-3xl bg-white/70 p-3"
                  >
                    <span className="w-10 h-10 rounded-2xl bg-linear-to-br from-rose to-primary shrink-0" />
                    <div className="leading-tight min-w-0">
                      <p className="text-sm font-semibold truncate">{c.name}</p>
                      <p className="text-xs text-muted">{c.members}</p>
                    </div>
                    <JoinButton />
                  </motion.div>
                ))}
              </div>
            </motion.section>
          )}

          {matchPeople.length > 0 && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="glass rounded-[2rem] p-5"
            >
              <h3 className="font-bold text-primary-deep">People to follow</h3>
              <ul className="mt-3 space-y-3">
                {matchPeople.map((p) => (
                  <li key={p.username} className="flex items-center gap-3">
                    <button onClick={() => navigate(`/profile/${p.username}`)}>
                      <Avatar name={p.name} size={44} />
                    </button>
                    <div className="leading-tight min-w-0">
                      <p className="text-sm font-semibold truncate">{p.name}</p>
                      <p className="text-xs text-muted truncate">{p.bio}</p>
                    </div>
                    <FollowButton />
                  </li>
                ))}
              </ul>
            </motion.section>
          )}
        </main>
      </div>

      <BottomNav active={1} username={user.username} />
    </div>
  );
}

export default Explore;