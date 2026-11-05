import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Bell, Settings as SettingsIcon } from "lucide-react";
import FloatingBubbles from "../components/animations/FloatingBubbles";
import Sidebar from "../components/SideBar";
import BottomNav from "../components/BottomNav";
import Avatar from "../components/Avatar";
import useAuth from "../hooks/useAuth";

const meshStyle = {
  backgroundColor: "#E7EDF9",
  backgroundImage:
    "radial-gradient(at 8% 6%, #F6DEE5 0px, transparent 45%), radial-gradient(at 92% 4%, #CDE7F7 0px, transparent 45%), radial-gradient(at 80% 95%, #C6C8E2 0px, transparent 50%), radial-gradient(at 5% 90%, #EBBAC7 0px, transparent 45%)",
  backgroundAttachment: "fixed",
};

// Sample numbers for now. Later this will come from the API.
const sampleProfile = {
  bio: "Web dev student. Sharing study tips and project ideas.",
  posts: 12,
  followers: 248,
  following: 130,
};

// "hassan.codes" -> "Hassan Codes" (until the real name comes from the API)
function nameFromUsername(username = "") {
  return username
    .split(/[._-]+/)
    .filter(Boolean)
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join(" ");
}

function Profile() {
  const navigate = useNavigate();
  const { username } = useParams(); // reads :username from the URL
  const { guest, user, logout } = useAuth();
  const [following, setFollowing] = useState(false);

  const isOwn = !guest && username === user.username;
  const profile = {
    ...sampleProfile,
    username,
    name: isOwn ? user.name : nameFromUsername(username),
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="relative min-h-screen overflow-hidden" style={meshStyle}>
      <FloatingBubbles />

      <div className="relative z-10 mx-auto max-w-7xl px-4 lg:px-6 py-4 lg:grid lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-6">
        <Sidebar
          user={user}
          onLogout={handleLogout}
          active="Profile"
          guest={guest}
          onLogin={() => navigate("/login")}
        />

        <main className="min-w-0 w-full max-w-2xl mx-auto lg:mx-0 pb-32 lg:pb-10">
          <div className="mb-4 flex items-center gap-2">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-sm font-semibold text-primary-deep"
            >
              <ArrowLeft size={20} /> Back
            </button>

            {/* On phones there is no sidebar, so these are the way to reach Notifications and Settings */}
            {isOwn && (
              <div className="ml-auto flex gap-2 lg:hidden">
                <button
                  onClick={() => navigate("/notifications")}
                  className="glass flex h-11 w-11 items-center justify-center rounded-full"
                  aria-label="Notifications"
                >
                  <Bell size={18} />
                </button>
                <button
                  onClick={() => navigate("/settings")}
                  className="glass flex h-11 w-11 items-center justify-center rounded-full"
                  aria-label="Settings"
                >
                  <SettingsIcon size={18} />
                </button>
              </div>
            )}
          </div>

          <div className="glass rounded-[2rem] p-6">
            <div className="flex items-center gap-4">
              <Avatar name={profile.name || "?"} size={88} />
              <div className="min-w-0">
                <h1 className="truncate text-2xl font-bold text-primary-deep">{profile.name}</h1>
                <p className="truncate text-muted">@{profile.username}</p>
              </div>
            </div>

            <p className="mt-4 text-ink/80">{profile.bio}</p>

            <div className="mt-5 flex flex-wrap gap-x-8 gap-y-2">
              <div><b>{profile.posts}</b> posts</div>
              <div><b>{profile.followers + (following ? 1 : 0)}</b> followers</div>
              <div><b>{profile.following}</b> following</div>
            </div>

            {isOwn ? (
              <button
                onClick={() => navigate("/settings")}
                className="mt-5 rounded-full border border-pale bg-white px-6 py-2 font-semibold text-primary-deep"
              >
                Edit profile
              </button>
            ) : (
              <button
                onClick={() => setFollowing(!following)}
                className={`mt-5 rounded-full px-6 py-2 font-semibold ${
                  following
                    ? "border border-pale bg-white text-primary-deep"
                    : "bg-linear-to-br from-rose to-primary text-white"
                }`}
              >
                {following ? "Following" : "Follow"}
              </button>
            )}
          </div>
        </main>
      </div>

      <BottomNav active={4} username={user.username} />
    </div>
  );
}

export default Profile;