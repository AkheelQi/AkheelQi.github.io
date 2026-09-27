import { useState } from "react";
import { playSfx } from "@/lib/retro-audio";

export function PowerGate({ onPowerOn }: { onPowerOn: () => void }) {
  const [igniting, setIgniting] = useState(false);

  const ignite = () => {
    if (igniting) return;
    setIgniting(true);
    playSfx("powerUp");
    window.setTimeout(onPowerOn, 470);
  };

  return (
    <div
      className={`fixed inset-0 z-[70] flex flex-col items-center justify-center gap-8 overflow-hidden px-6 pointer-events-none ${
        igniting ? "power-ignite" : ""
      }`}
      role="dialog"
      aria-modal="true"
      aria-label="Activity log in standby — press power to enter"
    >
      <div className="scanlines pointer-events-none absolute inset-0" aria-hidden />

      <div
        className={`relative flex flex-col items-center gap-6 text-center ${
          igniting ? "pointer-events-none" : "pointer-events-auto"
        }`}
      >
        <p className="font-display text-2xs tracking-[0.4em] text-gold">
          AKHEEL'S ACTIVITY LOG
        </p>
        <p className="crt-fringe font-display text-xl tracking-[0.2em] text-gold-bright sm:text-2xl">
          CRT STANDBY
        </p>

        <button
          type="button"
          onClick={ignite}
          aria-label="Power on — enter the activity log"
          className="group flex flex-col items-center gap-4"
        >
          <span className="relative flex size-28 items-center justify-center rounded-full border-4 border-gold bg-ink-soft text-gold-bright shadow-[4px_4px_0_#1a1404,inset_2px_2px_0_rgba(243,230,196,0.25),0_0_48px_rgba(201,162,39,0.35)] transition group-hover:text-cream group-hover:shadow-[4px_4px_0_#1a1404,inset_2px_2px_0_rgba(243,230,196,0.25),0_0_72px_rgba(201,162,39,0.6)] group-active:translate-y-px sm:size-32">
            <svg
              viewBox="0 0 24 24"
              className="size-14 sm:size-16"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              aria-hidden
            >
              <path d="M12 3.5v7.5" />
              <path d="M6.6 6.6a7.5 7.5 0 1 0 10.8 0" />
            </svg>
          </span>
          <span className="font-display text-sm tracking-[0.45em] text-gold transition group-hover:text-gold-bright">
            POWER
          </span>
        </button>

        <p className="font-display text-2xs tracking-[0.3em] text-muted">
          PRESS POWER TO ENTER <span className="blink">▮</span>
        </p>
      </div>

      <div className="power-line absolute inset-0 bg-cream" aria-hidden />
    </div>
  );
}
