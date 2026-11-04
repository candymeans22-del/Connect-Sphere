import { useNavigate } from "react-router-dom";
import { motion, MotionConfig } from "framer-motion";
import { Users, BookOpen, MessageCircle, ShieldCheck } from "lucide-react";
import FloatingClouds from "../components/animations/FloatingClouds";
import FloatingBubbles from "../components/animations/FloatingBubbles";
import RotatingWords from "../components/animations/RotatingWords";
import HeroPhones from "../components/animations/HeroPhones";


const features = [
  { Icon: Users, title: "Interest communities", text: "Join groups for programming, design, gaming and more." },
  { Icon: BookOpen, title: "Study and skill sharing", text: "Post notes, tips and project ideas that help others." },
  { Icon: MessageCircle, title: "Real-time chat", text: "Message friends instantly with live typing indicators." },
  { Icon: ShieldCheck, title: "Privacy controls", text: "Choose who sees your posts and report what's not okay." },
];

const communities = ["Programming", "Web Development", "Cybersecurity", "Graphic Design", "Education", "Gaming"];

const reveal = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.3 },
  transition: { duration: 0.6 },
};

function Landing() {
  const navigate = useNavigate();

  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-screen bg-linear-to-b from-petal via-surface to-sky-soft">
        {/* ---------- Hero ---------- */}
        <div className="relative overflow-hidden">
          <FloatingClouds />
          <FloatingBubbles />

          <header className="relative z-20 px-4 pt-4">
            <div className="mx-auto max-w-6xl flex items-center justify-between rounded-full bg-white/70 backdrop-blur px-5 py-2.5 shadow-lg">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-linear-to-br from-rose to-primary" />
                <span className="font-bold text-primary-deep">ConnectSphere</span>
              </div>
              <nav className="hidden md:flex gap-8 text-sm font-medium">
                <a href="#features" className="hover:text-primary">Features</a>
                <a href="#communities" className="hover:text-primary">Communities</a>
              </nav>
              <div className="flex items-center gap-2">
                <button onClick={() => navigate("/login")} className="px-4 py-1.5 text-sm font-semibold text-primary-deep">
                  Login
                </button>
                <button
                  onClick={() => navigate("/register")}
                  className="px-5 py-1.5 text-sm font-semibold rounded-full bg-primary text-white shadow transition hover:-translate-y-0.5"
                >
                  Sign up
                </button>
              </div>
            </div>
          </header>

          <section className="relative z-10 mx-auto max-w-6xl px-6 pt-12 pb-20 grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <motion.span
                className="inline-block px-4 py-1.5 rounded-full bg-white/70 backdrop-blur text-sm font-medium text-primary-deep shadow"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                Social networking meets learning
              </motion.span>

              <motion.h1
                className="mt-5 text-5xl md:text-6xl font-bold leading-tight"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                Find your people.
                <br />
                <span className="bg-linear-to-r from-primary via-lavender-deep to-rose bg-clip-text text-transparent">
                  Share what you know.
                </span>
              </motion.h1>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.6 }}
              >
                <RotatingWords />
              </motion.div>

              <motion.p
                className="mt-4 text-lg max-w-xl mx-auto lg:mx-0 text-muted"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.9 }}
              >
                Join communities built around your interests, share notes and skills,
                and chat with people who care about the same things.
              </motion.p>

              <motion.div
                className="mt-8 flex flex-wrap items-center gap-4 justify-center lg:justify-start"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 1.2 }}
              >
                <motion.button
                  onClick={() => navigate("/register")}
                  className="px-8 py-3 rounded-full bg-primary text-white font-semibold shadow-lg"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Get Started
                </motion.button>
                <motion.button
                  onClick={() => navigate("/login")}
                  className="px-8 py-3 rounded-full bg-white text-primary-deep font-semibold border border-pale"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Login
                </motion.button>
                <motion.button
                  onClick={() => navigate("/home")}
                  className="px-4 py-3 font-semibold text-primary-deep underline-offset-4 hover:underline"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Continue as guest
                </motion.button>
              </motion.div>
            </div>

            <HeroPhones />
          </section>
        </div>

        {/* ---------- Features ---------- */}
        <section id="features" className="mx-auto max-w-6xl px-6 py-20">
          <motion.div {...reveal} className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-primary-deep">More than a feed</h2>
            <p className="mt-3 text-muted">
              ConnectSphere mixes social networking with learning, so every scroll teaches you something.
            </p>
          </motion.div>

          <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map(({ Icon, title, text }, i) => (
              <motion.div
                key={title}
                {...reveal}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                whileHover={{ y: -8 }}
                className="rounded-3xl bg-white/80 backdrop-blur p-6 shadow-lg"
              >
                <span className="w-12 h-12 rounded-2xl bg-linear-to-br from-primary-soft to-lavender-deep text-white flex items-center justify-center">
                  <Icon size={22} />
                </span>
                <h3 className="mt-4 font-bold">{title}</h3>
                <p className="mt-2 text-sm text-muted">{text}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ---------- Communities ---------- */}
        <section id="communities" className="bg-white/60 py-16 px-6">
          <motion.div {...reveal} className="mx-auto max-w-4xl text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-primary-deep">Pick a community</h2>
            <p className="mt-3 text-muted">Start with what you love, and discover more along the way.</p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              {communities.map((c, i) => (
                <motion.span
                  key={c}
                  {...reveal}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                  whileHover={{ scale: 1.08, y: -3 }}
                  className="px-5 py-2.5 rounded-full bg-surface border border-pale text-sm font-semibold text-primary-deep cursor-default"
                >
                  {c}
                </motion.span>
              ))}
            </div>
          </motion.div>
        </section>

        {/* ---------- Call to action ---------- */}
        <section className="mx-auto max-w-5xl px-6 py-20">
          <motion.div
            {...reveal}
            className="relative overflow-hidden rounded-[2rem] bg-linear-to-br from-primary via-lavender-deep to-rose p-10 md:p-14 text-center text-white shadow-2xl"
          >
            <span className="absolute -top-12 -left-12 w-48 h-48 rounded-full bg-white/20 blur-xl" />
            <span className="absolute -bottom-16 -right-10 w-56 h-56 rounded-full bg-white/20 blur-xl" />
            <h2 className="relative text-3xl md:text-4xl font-bold">Ready to join ConnectSphere?</h2>
            <p className="relative mt-3 opacity-90">Create your free account and find your community today.</p>
            <motion.button
              onClick={() => navigate("/register")}
              className="relative mt-8 px-8 py-3 rounded-full bg-white text-primary-deep font-semibold shadow-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Create my account
            </motion.button>
          </motion.div>
        </section>

        <footer className="pb-10 text-center text-sm text-muted">
          Â© 2026 ConnectSphere Â· Built with the MERN stack
        </footer>
      </div>
    </MotionConfig>
  );
}

export default Landing;