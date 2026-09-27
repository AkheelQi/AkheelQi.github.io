import { useEffect, useState } from "react";
import { isRetroMuted, playSfx, setRetroMuted } from "@/lib/retro-audio";

export function MuteKnob() {
  const [muted, setMuted] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMuted(isRetroMuted());
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <button
      type="button"
      aria-pressed={muted}
      aria-label={muted ? "Unmute retro sound effects" : "Mute retro sound effects"}
      onClick={() => {
        const next = !muted;
        setRetroMuted(next);
        setMuted(next);
        if (!next) playSfx("blip");
      }}
      className="flex items-center gap-2 border border-gold bg-ink-soft px-2 py-1.5 transition hover:border-gold-bright"
    >
      <span className="relative block size-8 rounded-full border-2 border-gold bg-ink shadow-[inset_1px_1px_0_rgba(243,230,196,0.25)]">
        <span
          className="absolute inset-0 transition-transform duration-300"
          style={{ transform: `rotate(${muted ? 225 : 45}deg)` }}
        >
          <span className="absolute top-0.5 left-1/2 h-3 w-0.5 -translate-x-1/2 bg-gold-bright" />
        </span>
        <span
          className={`absolute -right-0.5 -bottom-0.5 size-2 rounded-full ${
            muted ? "bg-oxblood" : "bg-gold-bright"
          }`}
        />
      </span>
      <span className="font-display text-2xs tracking-[0.2em] text-gold">
        {muted ? "SOUND OFF" : "SOUND ON"}
      </span>
    </button>
  );
}
