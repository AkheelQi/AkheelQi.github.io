import { useSyncExternalStore } from "react";
import { getMoodSnapshot, moodToggle, subscribeMood } from "@/lib/mood-player";

/** Fam-style “♪ off / ♪ on” chunky chip wired to the site mood player. */
export function MusicChip({ className = "" }: { className?: string }) {
  const snap = useSyncExternalStore(subscribeMood, getMoodSnapshot, getMoodSnapshot);
  const on = snap.status === "playing" || snap.status === "loading";
  return (
    <button
      type="button"
      onClick={moodToggle}
      aria-pressed={on}
      title={on ? "Pause the mood track" : "Play the mood track"}
      className={`bevel-ghost min-h-10 px-3 py-1 text-sm tracking-[0.08em] ${className}`}
    >
      ♪ {on ? "on" : "off"}
    </button>
  );
}