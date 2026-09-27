import { useEffect, useState } from "react";

const BASE = 12847;

export function VisitorCounter() {
  const [n, setN] = useState(BASE);

  useEffect(() => {
    const key = "akheel-hits";
    const prev = Number(window.localStorage.getItem(key) || "0");
    const next = prev + 1;
    window.localStorage.setItem(key, String(next));
    setN(BASE + next);
  }, []);

  const digits = String(n).padStart(6, "0").split("");

  return (
    <div className="flex items-center gap-2 text-xs text-gold">
      <span className="tracking-[0.2em]">YOU ARE VISITOR</span>
      <span className="flex" aria-label={`Visitor number ${n}`}>
        {digits.map((d, i) => (
          <span
            key={`${d}-${i}`}
            className="inline-block min-w-4 border border-gold/40 bg-ink px-1 py-0.5 text-center font-display text-cream tabular-nums"
          >
            {d}
          </span>
        ))}
      </span>
    </div>
  );
}
