/**
 * Tiny hand-drawn pixel sprites for the HQ map. All SVG rect grids with
 * crispEdges so they scale like nearest-neighbour pixel art.
 */

type SpriteProps = { className?: string };

export function PixelPerson({
  className = "",
  shirt = "#e8643f",
  hair = "#2b2118",
  skin = "#e8b088",
  sitting = false,
}: SpriteProps & { shirt?: string; hair?: string; skin?: string; sitting?: boolean }) {
  if (sitting) {
    return (
      <svg viewBox="0 0 12 12" className={`pixel-sprite ${className}`} aria-hidden>
        <rect x="3" y="0" width="6" height="2" fill={hair} />
        <rect x="3" y="2" width="6" height="3" fill={skin} />
        <rect x="4" y="3" width="1" height="1" fill="#101018" />
        <rect x="7" y="3" width="1" height="1" fill="#101018" />
        <rect x="2" y="5" width="8" height="4" fill={shirt} />
        <rect x="1" y="5" width="1" height="3" fill={shirt} />
        <rect x="10" y="5" width="1" height="3" fill={shirt} />
        <rect x="2" y="9" width="8" height="2" fill="#3a4258" />
        <rect x="9" y="9" width="2" height="3" fill="#3a4258" />
        <rect x="9" y="11" width="3" height="1" fill="#101018" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 12 16" className={`pixel-sprite ${className}`} aria-hidden>
      <rect x="3" y="0" width="6" height="3" fill={hair} />
      <rect x="3" y="3" width="6" height="3" fill={skin} />
      <rect x="4" y="4" width="1" height="1" fill="#101018" />
      <rect x="7" y="4" width="1" height="1" fill="#101018" />
      <rect x="2" y="6" width="8" height="5" fill={shirt} />
      <rect x="1" y="6" width="1" height="4" fill={shirt} />
      <rect x="10" y="6" width="1" height="4" fill={shirt} />
      <rect x="1" y="10" width="1" height="1" fill={skin} />
      <rect x="10" y="10" width="1" height="1" fill={skin} />
      <rect x="3" y="11" width="2" height="3" fill="#3a4258" />
      <rect x="7" y="11" width="2" height="3" fill="#3a4258" />
      <rect x="2" y="14" width="3" height="2" fill="#101018" />
      <rect x="7" y="14" width="3" height="2" fill="#101018" />
    </svg>
  );
}

export function PlantPot({ className = "" }: SpriteProps) {
  return (
    <svg viewBox="0 0 12 14" className={`pixel-sprite ${className}`} aria-hidden>
      <rect x="5" y="2" width="2" height="6" fill="#2f8a63" />
      <rect x="3" y="4" width="2" height="3" fill="#3fae8f" />
      <rect x="7" y="3" width="2" height="4" fill="#2f8a63" />
      <rect x="2" y="6" width="2" height="2" fill="#3fae8f" />
      <rect x="8" y="6" width="2" height="2" fill="#3fae8f" />
      <rect x="2" y="8" width="8" height="2" fill="#c9ced6" />
      <rect x="3" y="10" width="6" height="4" fill="#a9b1be" />
    </svg>
  );
}

export function DeskMonitor({ className = "" }: SpriteProps) {
  return (
    <svg viewBox="0 0 24 16" className={`pixel-sprite ${className}`} aria-hidden>
      <rect x="7" y="1" width="10" height="8" fill="#101018" />
      <rect x="8" y="2" width="8" height="6" fill="#7fb2e6" />
      <rect x="9" y="3" width="4" height="1" fill="#d8ecff" />
      <rect x="9" y="5" width="6" height="1" fill="#a8cdf2" />
      <rect x="11" y="9" width="2" height="1" fill="#101018" />
      <rect x="0" y="10" width="24" height="2" fill="#b87333" />
      <rect x="2" y="12" width="2" height="4" fill="#6b4423" />
      <rect x="20" y="12" width="2" height="4" fill="#6b4423" />
    </svg>
  );
}

export function Bookshelf({ className = "" }: SpriteProps) {
  const rowA = [
    ["#e8643f", 6], ["#ffc23d", 7], ["#2f8a63", 5],
    ["#5aa0e6", 7], ["#b07fe0", 6], ["#e86a8a", 5],
  ] as const;
  const rowB = [
    ["#5aa0e6", 7], ["#e86a8a", 5], ["#ffc23d", 6],
    ["#2f8a63", 7], ["#e8643f", 5], ["#b07fe0", 6],
  ] as const;
  return (
    <svg viewBox="0 0 26 22" className={`pixel-sprite ${className}`} aria-hidden>
      <rect x="0" y="0" width="26" height="22" fill="#6b4423" />
      <rect x="2" y="2" width="22" height="8" fill="#4a2e1a" />
      <rect x="2" y="12" width="22" height="8" fill="#4a2e1a" />
      {rowA.map(([c, h], i) => (
        <rect key={`a${i}`} x={3 + i * 3.5} y={10 - h} width="3" height={h} fill={c} />
      ))}
      {rowB.map(([c, h], i) => (
        <rect key={`b${i}`} x={3 + i * 3.5} y={20 - h} width="3" height={h} fill={c} />
      ))}
    </svg>
  );
}

export function Sofa({ className = "" }: SpriteProps) {
  return (
    <svg viewBox="0 0 28 14" className={`pixel-sprite ${className}`} aria-hidden>
      <rect x="1" y="2" width="26" height="5" fill="#c0392b" />
      <rect x="1" y="7" width="26" height="4" fill="#d44a3a" />
      <rect x="13" y="7" width="2" height="4" fill="#a5301f" />
      <rect x="0" y="4" width="3" height="7" fill="#a5301f" />
      <rect x="25" y="4" width="3" height="7" fill="#a5301f" />
      <rect x="2" y="11" width="2" height="3" fill="#101018" />
      <rect x="24" y="11" width="2" height="3" fill="#101018" />
    </svg>
  );
}

export function Trophy({ className = "" }: SpriteProps) {
  return (
    <svg viewBox="0 0 12 14" className={`pixel-sprite ${className}`} aria-hidden>
      <rect x="2" y="1" width="8" height="5" fill="#ffc23d" />
      <rect x="3" y="2" width="2" height="2" fill="#ffe9a8" />
      <rect x="0" y="2" width="2" height="3" fill="#e8a23a" />
      <rect x="10" y="2" width="2" height="3" fill="#e8a23a" />
      <rect x="4" y="6" width="4" height="1" fill="#e8a23a" />
      <rect x="5" y="7" width="2" height="3" fill="#e8a23a" />
      <rect x="3" y="10" width="6" height="2" fill="#8a6b16" />
      <rect x="2" y="12" width="8" height="2" fill="#6b4423" />
    </svg>
  );
}

export function CrtTv({ className = "" }: SpriteProps) {
  return (
    <svg viewBox="0 0 20 16" className={`pixel-sprite ${className}`} aria-hidden>
      <rect x="0" y="0" width="20" height="13" fill="#2b2b2b" />
      <rect x="2" y="2" width="13" height="9" fill="#7fb2e6" />
      <rect x="2" y="4" width="13" height="1" fill="#a8cdf2" />
      <rect x="2" y="7" width="13" height="1" fill="#a8cdf2" />
      <rect x="3" y="3" width="5" height="2" fill="#d8ecff" />
      <rect x="16" y="3" width="2" height="2" fill="#ffc23d" />
      <rect x="16" y="6" width="2" height="2" fill="#e8643f" />
      <rect x="3" y="13" width="3" height="3" fill="#101018" />
      <rect x="14" y="13" width="3" height="3" fill="#101018" />
    </svg>
  );
}

export function PixelTree({ className = "" }: SpriteProps) {
  return (
    <svg viewBox="0 0 16 20" className={`pixel-sprite ${className}`} aria-hidden>
      <rect x="6" y="12" width="4" height="8" fill="#5a3a1c" />
      <rect x="2" y="4" width="12" height="8" fill="#1f4a30" />
      <rect x="4" y="2" width="8" height="8" fill="#2f7d4e" />
      <rect x="6" y="0" width="4" height="4" fill="#2f7d4e" />
      <rect x="4" y="4" width="4" height="3" fill="#3fae8f" />
    </svg>
  );
}

export function PixelBird({ className = "" }: SpriteProps) {
  return (
    <svg viewBox="0 0 16 12" className={`pixel-sprite ${className}`} aria-hidden>
      <rect x="2" y="4" width="8" height="4" fill="#e8a23a" />
      <rect x="10" y="3" width="4" height="3" fill="#e8a23a" />
      <rect x="14" y="4" width="2" height="1" fill="#faa629" />
      <rect x="11" y="4" width="1" height="1" fill="#101018" />
      <rect x="4" y="1" width="4" height="3" fill="#faa629" />
      <rect x="0" y="5" width="2" height="2" fill="#faa629" />
      <rect x="4" y="8" width="2" height="3" fill="#c98f2b" />
      <rect x="7" y="8" width="2" height="3" fill="#c98f2b" />
    </svg>
  );
}