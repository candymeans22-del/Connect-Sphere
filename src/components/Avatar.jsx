import Photo from "./Photo";

const gradients = [
  "from-primary-soft to-lavender-deep",
  "from-rose to-primary-soft",
  "from-sky to-primary",
  "from-blush to-lavender-deep",
];

function Avatar({ name = "?", photo, size = 40, className = "" }) {
  const g = gradients[name.charCodeAt(0) % gradients.length];
  return (
    <span
      className={`relative shrink-0 overflow-hidden rounded-full bg-linear-to-br ${g} flex items-center justify-center text-white font-semibold ${className}`}
      style={{ width: size, height: size, fontSize: size * 0.4 }}
    >
      {name[0].toUpperCase()}
      {photo && <Photo name={photo} />}
    </span>
  );
}

export default Avatar;