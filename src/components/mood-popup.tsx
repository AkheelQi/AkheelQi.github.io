import { useEffect, useSyncExternalStore } from "react";
import { mood } from "@/data/site";
import { getMoodSnapshot, moodMaybeResume, subscribeMood } from "@/lib/mood-player";

export function MoodPopup() {
  const snap = useSyncExternalStore(subscribeMood, getMoodSnapshot, getMoodSnapshot);

  useEffect(() => {
    moodMaybeResume();
  }, []);

  if (snap.status !== "loading" && snap.status !== "playing") return null;

  return (
    <div
      className="mood-popup mood-enter pointer-events-none fixed bottom-4 left-4 z-[55] w-[min(16rem,calc(100vw-2rem))] border-2 border-gold bg-ink-soft shadow-[4px_4px_0_rgba(0,0,0,0.7)]"
      role="status"
      aria-label="Current mood"
    >
      <div className="border-b-2 border-gold bg-gradient-to-b from-gold-bright to-gold px-2 py-1 select-none">
        <span className="font-display text-2xs font-bold tracking-[0.18em] text-ink sm:text-xs">
          CURRENT MOOD
        </span>
      </div>
      <div className="p-3">
        <p className="crt-fringe font-display text-sm leading-snug tracking-[0.08em] text-gold-bright sm:text-base">
          {mood.artist.toUpperCase()} — {mood.song.toUpperCase()}
        </p>
        <p className="mt-2 text-2xs leading-relaxed tracking-[0.1em] text-muted italic">
          “{mood.quote}”
        </p>
      </div>
    </div>
  );
}
