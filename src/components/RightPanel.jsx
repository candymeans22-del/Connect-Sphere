import { useState } from "react";
import { TrendingUp } from "lucide-react";
import Avatar from "./Avatar";

const trending = [
  { tag: "#ReactTips", count: "1.2k posts" },
  { tag: "#StudyNotes", count: "980 posts" },
  { tag: "#WebDesign", count: "740 posts" },
  { tag: "#MongoDB", count: "512 posts" },
];

const communities = [
  { name: "Programming", members: "12k members" },
  { name: "Graphic Design", members: "8.4k members" },
  { name: "Cybersecurity", members: "5.1k members" },
];

const people = [
  { name: "Sara Khan", handle: "@sarakhan" },
  { name: "Ali Raza", handle: "@aliraza" },
  { name: "Maya Lopez", handle: "@mayalopez" },
];

function Toggle({ onText, offText }) {
  const [on, setOn] = useState(false);
  return (
    <button
      onClick={() => setOn(!on)}
      className={`ml-auto px-4 py-1.5 rounded-full text-xs font-semibold transition ${
        on ? "bg-white text-primary-deep border border-pale" : "bg-primary text-white shadow"
      }`}
    >
      {on ? onText : offText}
    </button>
  );
}

function RightPanel() {
  return (
    <aside className="hidden xl:flex self-start sticky top-4 flex-col gap-5">
      <section className="glass rounded-[2rem] p-5">
        <h3 className="flex items-center gap-2 font-bold text-primary-deep">
          <TrendingUp size={18} /> Trending now
        </h3>
        <ul className="mt-3 space-y-3">
          {trending.map((t) => (
            <li key={t.tag}>
              <p className="text-sm font-semibold">{t.tag}</p>
              <p className="text-xs text-muted">{t.count}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="glass rounded-[2rem] p-5">
        <h3 className="font-bold text-primary-deep">Communities</h3>
        <ul className="mt-3 space-y-3">
          {communities.map((c) => (
            <li key={c.name} className="flex items-center gap-3">
              <span className="w-10 h-10 rounded-2xl bg-linear-to-br from-lavender-deep to-rose flex items-center justify-center text-white font-bold">
                {c.name[0]}
              </span>
              <div className="leading-tight">
                <p className="text-sm font-semibold">{c.name}</p>
                <p className="text-xs text-muted">{c.members}</p>
              </div>
              <Toggle onText="Joined" offText="Join" />
            </li>
          ))}
        </ul>
      </section>

      <section className="glass rounded-[2rem] p-5">
        <h3 className="font-bold text-primary-deep">People to follow</h3>
        <ul className="mt-3 space-y-3">
          {people.map((p) => (
            <li key={p.handle} className="flex items-center gap-3">
              <Avatar name={p.name} size={40} />
              <div className="leading-tight min-w-0">
                <p className="text-sm font-semibold truncate">{p.name}</p>
                <p className="text-xs text-muted truncate">{p.handle}</p>
              </div>
              <Toggle onText="Following" offText="Follow" />
            </li>
          ))}
        </ul>
      </section>
    </aside>
  );
}

export default RightPanel;