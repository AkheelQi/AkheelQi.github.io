export function SpinningBadge({ className = "" }: { className?: string }) {
  return (
    <span className={`block overflow-hidden rounded-full border-4 border-gold ${className}`}>
      <img
        src={`${import.meta.env.BASE_URL}art/portrait-badge.jpg`}
        alt="Muhammed Akheel badge portrait"
        className="spin-slow size-full object-cover"
      />
    </span>
  );
}
