const bubbles = [
  { left: "6%", top: "18%", size: 90, color: "#EBBAC7", duration: 8 },
  { left: "82%", top: "12%", size: 60, color: "#C9CDDD", duration: 6 },
  { left: "75%", top: "60%", size: 130, color: "#E1B8C6", duration: 10 },
  { left: "12%", top: "70%", size: 70, color: "#A0A4CF", duration: 7 },
  { left: "45%", top: "85%", size: 40, color: "#DE89A0", duration: 9 },
  { left: "30%", top: "8%", size: 36, color: "#8EA5D4", duration: 5 },
];

function FloatingBubbles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {bubbles.map((b, i) => (
        <div
          key={i}
          className="bubble"
          style={{
            left: b.left,
            top: b.top,
            width: b.size,
            height: b.size,
            backgroundColor: b.color,
            opacity: 0.5,
            animationDuration: `${b.duration}s`,
            animationDelay: `${i * -1.3}s`,
          }}
        />
      ))}
    </div>
  );
}

export default FloatingBubbles;