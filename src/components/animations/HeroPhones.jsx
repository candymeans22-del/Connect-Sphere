import { motion } from "framer-motion";
import { Camera, Bell, MessageCircle, Heart, Send, Bookmark, Home, User, Plus, ArrowLeft } from "lucide-react";

function Phone({ children }) {
  return (
    <div className="relative w-52 h-[420px] rounded-[2.2rem] border-[6px] border-white bg-surface shadow-2xl overflow-hidden">
      {children}
    </div>
  );
}

function RoundIcon({ children }) {
  return (
    <span className="w-7 h-7 rounded-full bg-primary-soft/70 text-white flex items-center justify-center">
      {children}
    </span>
  );
}

function NavBar() {
  return (
    <div className="absolute bottom-3 inset-x-3 h-11 rounded-2xl bg-linear-to-r from-mist to-primary-soft flex items-center justify-around text-white">
      <Home size={16} />
      <MessageCircle size={16} />
      <span className="w-10 h-10 -mt-6 rounded-full bg-white text-primary shadow-lg flex items-center justify-center">
        <Plus size={20} strokeWidth={3} />
      </span>
      <User size={16} />
      <Bell size={16} />
    </div>
  );
}

function ExploreScreen() {
  return (
    <Phone>
      <div className="flex items-center justify-between px-3 pt-4">
        <RoundIcon><Camera size={14} /></RoundIcon>
        <span className="text-sm font-bold text-primary-deep">Explore</span>
        <RoundIcon><Bell size={14} /></RoundIcon>
      </div>
      <div className="flex gap-2 px-3 mt-3">
        {["from-primary to-lavender-deep", "from-sky to-primary", "from-lavender-deep to-mist", "from-primary-soft to-sky"].map((g, i) => (
          <span key={i} className="p-0.5 rounded-full bg-linear-to-br from-primary to-lavender-deep">
            <span className={`block w-9 h-9 rounded-full border-2 border-white bg-linear-to-br ${g}`} />
          </span>
        ))}
      </div>
      <div className="mx-2 mt-3 p-2 rounded-2xl bg-white/80">
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-linear-to-br from-primary-soft to-lavender-deep" />
          <div className="leading-tight">
            <p className="text-[10px] font-bold">Catherine12</p>
            <p className="text-[8px] text-muted">@Catherine12</p>
          </div>
        </div>
        <div className="relative mt-2 h-40 rounded-xl overflow-hidden bg-linear-to-br from-primary via-primary-soft to-lavender-deep">
          <span className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-white/30 blur-lg" />
          <span className="absolute bottom-8 -left-6 w-20 h-20 rounded-full bg-white/20 blur-md" />
          <div className="absolute bottom-0 inset-x-0 flex items-center gap-3 px-2 py-1.5 text-white text-[10px] bg-linear-to-t from-ink/50 to-transparent">
            <MessageCircle size={12} /> 10 <Heart size={12} /> 122
            <Send size={12} className="ml-auto" /> <Bookmark size={12} />
          </div>
        </div>
      </div>
      <NavBar />
    </Phone>
  );
}

function ProfileScreen() {
  return (
    <Phone>
      <div className="h-28 bg-linear-to-br from-mist via-lavender-deep to-primary-soft relative">
        <span className="absolute top-4 left-3 w-7 h-7 rounded-full bg-white flex items-center justify-center text-ink">
          <ArrowLeft size={14} />
        </span>
        <span className="absolute top-3 right-8 w-14 h-14 rounded-full bg-white/30 blur-md" />
      </div>
      <div className="relative -mt-5 rounded-t-3xl bg-surface px-3 pb-3">
        <span className="block -mt-7 mx-auto w-14 h-14 rounded-full border-4 border-white bg-linear-to-br from-primary-soft to-lavender-deep" />
        <div className="flex justify-between px-4 -mt-9 text-center text-[8px] text-muted">
          <p><b className="block text-[11px] text-ink">1k</b>Followers</p>
          <p><b className="block text-[11px] text-ink">342</b>Following</p>
        </div>
        <p className="mt-3 text-center text-[11px] font-bold">@Catherine12</p>
        <div className="mt-2 flex justify-center gap-2 text-[9px] font-semibold">
          <span className="px-4 py-1.5 rounded-full bg-primary text-white">Follow</span>
          <span className="px-4 py-1.5 rounded-full bg-white text-ink shadow">Message</span>
        </div>
        <div className="mt-3 grid grid-cols-3 gap-1.5">
          {["from-primary-soft to-mist", "from-lavender-deep to-sky", "from-sky to-primary-soft", "from-mist to-lavender-deep", "from-primary to-primary-soft", "from-sky to-mist"].map((g, i) => (
            <span key={i} className={`h-14 rounded-lg bg-linear-to-br ${g}`} />
          ))}
        </div>
      </div>
    </Phone>
  );
}

function ChatScreen() {
  return (
    <Phone>
      <div className="flex items-center gap-2 px-3 pt-4 pb-2 border-b border-pale">
        <span className="w-8 h-8 rounded-full bg-linear-to-br from-primary-soft to-lavender-deep" />
        <div className="leading-tight">
          <p className="text-[11px] font-bold">Benjamin M.</p>
          <p className="text-[8px] text-muted">online</p>
        </div>
      </div>
      <div className="px-3 mt-5 space-y-2 text-[9px]">
        <p className="w-fit max-w-[80%] rounded-2xl bg-bubble-gray px-3 py-2">Hi! How are you?</p>
        <p className="ml-auto w-fit max-w-[80%] rounded-2xl bg-primary-soft text-white px-3 py-2">I'm good, you?</p>
        <p className="w-fit max-w-[80%] rounded-2xl bg-bubble-gray px-3 py-2">Study group tonight?</p>
        <p className="ml-auto w-fit max-w-[80%] rounded-2xl bg-primary-soft text-white px-3 py-2">Sounds great!</p>
        <div className="w-fit rounded-2xl bg-bubble-gray px-3 py-2.5 flex gap-1">
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-muted"
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15 }}
            />
          ))}
        </div>
      </div>
      <div className="absolute bottom-3 inset-x-3 h-9 rounded-full bg-white flex items-center justify-between pl-3 pr-1 text-[9px] text-muted">
        Type a message
        <span className="w-7 h-7 rounded-full bg-primary text-white flex items-center justify-center">
          <Send size={12} />
        </span>
      </div>
    </Phone>
  );
}

function Float({ className = "", duration, delay = 0, children }) {
  return (
    <div className={className}>
      <motion.div
        animate={{ y: [0, -12, 0] }}
        transition={{ duration, repeat: Infinity, ease: "easeInOut", delay }}
      >
        {children}
      </motion.div>
    </div>
  );
}

function Chip({ className, duration, children }) {
  return (
    <Float className={`absolute z-20 ${className}`} duration={duration}>
      <span className="block px-4 py-2 rounded-full bg-white/90 backdrop-blur shadow-lg text-xs font-semibold text-primary-deep">
        {children}
      </span>
    </Float>
  );
}

function HeroPhones() {
  return (
    <motion.div
      className="relative h-[470px] w-full max-w-[560px] mx-auto"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9, delay: 0.3 }}
    >
      <Float className="hidden sm:block absolute left-0 top-20 -rotate-6 scale-90" duration={6}>
        <ProfileScreen />
      </Float>
      <Float className="hidden sm:block absolute right-0 top-20 rotate-6 scale-90" duration={7} delay={1}>
        <ChatScreen />
      </Float>
      <Float className="absolute left-1/2 -translate-x-1/2 top-0 z-10" duration={5.5} delay={0.5}>
        <ExploreScreen />
      </Float>
      <Chip className="left-0 top-4" duration={5}>Communities</Chip>
      <Chip className="right-0 bottom-6" duration={6}>Study notes</Chip>
    </motion.div>
  );
}

export default HeroPhones;