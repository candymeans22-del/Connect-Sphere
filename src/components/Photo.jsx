function Photo({ name, className = "" }) {
  return (
    <img
      src={`/images/${name}.jpg`}
      alt=""
      loading="lazy"
      draggable="false"
      onError={(e) => { e.currentTarget.style.display = "none"; }}
      className={`absolute inset-0 w-full h-full object-cover ${className}`}
    />
  );
}

export default Photo;