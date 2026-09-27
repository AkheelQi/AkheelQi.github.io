import { useEffect, useState } from "react";
import { playSfx } from "@/lib/retro-audio";

type Cleanup = () => void;

function setup() {
  const overlay = document.createElement("div");
  overlay.className = "crt-power-overlay";
  const beam = document.createElement("div");
  beam.className = "crt-power-beam";
  overlay.appendChild(beam);
  document.documentElement.appendChild(overlay);

  const body = document.body;
  const prev = {
    transition: body.style.transition,
    transform: body.style.transform,
    transformOrigin: body.style.transformOrigin,
    filter: body.style.filter,
  };

  const timers: number[] = [];
  const at = (ms: number, fn: () => void) => timers.push(window.setTimeout(fn, ms));

  const cleanup = () => {
    timers.forEach(clearTimeout);
    body.style.transition = prev.transition;
    body.style.transform = prev.transform;
    body.style.transformOrigin = prev.transformOrigin;
    body.style.filter = prev.filter;
    overlay.remove();
  };

  return { overlay, beam, body, at, cleanup };
}

export function runPowerDown(onDone: () => void): void {
  const { overlay, beam, body, at, cleanup } = setup();

  playSfx("powerDown");

  at(20, () => {
    overlay.classList.add("on");
    body.style.transformOrigin = "50% 50%";
    body.style.transition = "transform 0.3s ease-in, filter 0.3s ease-in";
    body.style.transform = "scaleY(0.004)";
    body.style.filter = "brightness(2.8)";
  });

  at(330, () => beam.classList.add("on"));
  at(900, () => beam.classList.add("off"));
  at(1250, () => {
    cleanup();
    onDone();
  });
}

function runPowerCycle(): Cleanup {
  const { overlay, beam, body, at, cleanup } = setup();

  playSfx("powerDown");

  at(20, () => {
    overlay.classList.add("on");
    body.style.transformOrigin = "50% 50%";
    body.style.transition = "transform 0.3s ease-in, filter 0.3s ease-in";
    body.style.transform = "scaleY(0.004)";
    body.style.filter = "brightness(2.8)";
  });

  at(330, () => beam.classList.add("on"));
  at(900, () => beam.classList.add("off"));

  at(1300, () => {
    playSfx("powerUp");
    body.style.transition = "transform 0.38s ease-out, filter 0.38s ease-out";
    body.style.transform = "scaleY(1)";
    body.style.filter = "brightness(1)";
    overlay.classList.remove("on");
  });

  at(1750, cleanup);
  return cleanup;
}

type PowerButtonProps = {
  onPowerDown?: () => void;
};

export function PowerButton({ onPowerDown }: PowerButtonProps) {
  const [busy, setBusy] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <button
      type="button"
      aria-label="Power — CRT shutdown"
      title="POWER"
      disabled={busy}
      onClick={() => {
        if (busy) return;
        setBusy(true);
        if (onPowerDown) {
          runPowerDown(() => {
            onPowerDown();
            setBusy(false);
          });
        } else {
          runPowerCycle();
          window.setTimeout(() => setBusy(false), 1800);
        }
      }}
      className="power-dock fixed right-4 bottom-4 z-50 flex flex-col items-center gap-1.5"
    >
      <span className="flex size-16 items-center justify-center rounded-full border-4 border-gold bg-ink-soft text-gold-bright shadow-[3px_3px_0_#1a1404,inset_2px_2px_0_rgba(243,230,196,0.25)] transition hover:text-cream hover:shadow-[3px_3px_0_#1a1404,inset_2px_2px_0_rgba(243,230,196,0.25),0_0_28px_rgba(201,162,39,0.45)] active:translate-y-px">
        <svg
          viewBox="0 0 24 24"
          className="size-8"
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
      <span className="font-display text-2xs tracking-[0.25em] text-muted">POWER</span>
    </button>
  );
}
