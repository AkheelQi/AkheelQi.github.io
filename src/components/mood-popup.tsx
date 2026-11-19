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
      className="mood-popup mood-enter pixel-panel pointer-events-none fixed bottom-4 left-4 z-[55] w-[min(16rem,calc(100vw-2rem))]"
      role="status"
      aria-label="Current mood"
    >
      <div className="border-b-3 border-outline bg-gold-bright px-2 py-1 select-none">
        <span className="font-display text-2xs font-bold tracking-[0.18em] text-outline sm:text-xs">
          CURRENT MOOD
        </span>
      </div>
      <div className="p-3">
        <p className="font-display text-sm leading-snug tracking-[0.04em] text-outline sm:text-base">
          {mood.artist.toUpperCase()} — {mood.song.toUpperCase()}
        </p>
        <p className="mt-2 text-2xs leading-relaxed tracking-[0.06em] text-[#5c5647] italic">
          “{mood.quote}”
        </p>
      </div>
    </div>
  );
}