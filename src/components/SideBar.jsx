import { motion } from "framer-motion";
import { Home, Compass, Users, MessageCircle, Bell, User, Settings, LogOut } from "lucide-react";
import Avatar from "./Avatar";

const links = [
  { label: "Home", Icon: Home },
  { label: "Explore", Icon: Compass },
  { label: "Communities", Icon: Users },
  { label: "Messages", Icon: MessageCircle, badge: 3 },
  { label: "Notifications", Icon: Bell, badge: 5 },
  { label: "Profile", Icon: User },
  { label: "Settings", Icon: Settings },
];

function Sidebar({ user, onLogout, active = "Home", guest = false, onLogin }) {
  return (
    <aside className="hidden lg:flex self-start sticky top-4 h-[calc(100vh-2rem)] flex-col glass rounded-[2rem] p-5">
      <div className="flex items-center gap-2 px-2">
        <span className="w-9 h-9 rounded-full bg-linear-to-br from-rose to-primary shadow" />
        <span className="font-bold text-primary-deep text-lg">ConnectSphere</span>
      </div>

      <nav className="mt-8 flex flex-col gap-1">
        {links.map(({ label, Icon, badge }) => {
          const isActive = label === active;
          return (
            <motion.button
              key={label}
              whileHover={{ x: 4 }}
              className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium text-left transition ${
                isActive
                  ? "bg-linear-to-r from-primary to-primary-soft text-white shadow-lg"
                  : "text-ink/70 hover:bg-white/70"
              }`}
            >
              <Icon size={19} />
              {label}
              {badge && (
                <span
                  className={`ml-auto text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                    isActive ? "bg-white/25 text-white" : "bg-rose text-white"
                  }`}
                >
                  {badge}
                </span>
              )}
            </motion.button>
          );
        })}
      </nav>

      {guest ? (
        <div className="mt-auto rounded-3xl bg-white/70 p-4 text-center">
          <p className="text-sm font-semibold">Browsing as guest</p>
          <button
            onClick={onLogin}
            className="mt-3 w-full py-2 rounded-full bg-primary text-white text-sm font-semibold"
          >
            Login / Register
          </button>
        </div>
      ) : (
      <div className="mt-auto rounded-3xl bg-white/70 p-3 flex items-center gap-3">
        <Avatar name={user.name || "?"} size={40} />
        <div className="leading-tight min-w-0">
          <p className="text-sm font-semibold truncate">{user.name || "Friend"}</p>
          <p className="text-xs text-muted truncate">@{user.username}</p>
        </div>
        <button
          onClick={onLogout}
          title="Logout"
          className="ml-auto w-9 h-9 shrink-0 rounded-full flex items-center justify-center text-muted hover:bg-white transition"
        >
          <LogOut size={17} />
        </button>
      </div>
      )}
    </aside>
  );
}

export default Sidebar;