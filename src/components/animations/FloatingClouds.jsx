const clouds = [
  { top: "8%", size: 1, duration: 60, delay: 0 },
  { top: "25%", size: 0.7, duration: 80, delay: -30 },
  { top: "55%", size: 1.2, duration: 100, delay: -50 },
  { top: "75%", size: 0.8, duration: 70, delay: -15 },
];

function FloatingClouds() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {clouds.map((c, i) => (
        <div
          key={i}
          className="cloud"
          style={{
            top: c.top,
            opacity: 0.85,
            animationDuration: `${c.duration}s`,
            animationDelay: `${c.delay}s`,
          }}
        >
          <div className="relative" style={{ transform: `scale(${c.size})` }}>
            <div className="w-40 h-12 bg-white rounded-full blur-sm" />
            <div className="absolute -top-6 left-6 w-20 h-20 bg-white rounded-full blur-sm" />
            <div className="absolute -top-9 left-16 w-24 h-24 bg-white rounded-full blur-sm" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default FloatingClouds;