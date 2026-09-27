import { useEffect, useRef, useState } from "react";
import { playSfx } from "@/lib/retro-audio";

const BOOT_KEY = "retro-booted";

const LINES = [
  "AKHEEL SYSTEM BIOS v4.2   (C) 1998-2026",
  "CPU: CURIOSITY @ 4.80 GHZ ............ OK",
  "SYSTEM MEMORY 640K ................... OK",
  "CHECKING SKILLS HARDWARE:",
  "  PENTEST / VAPT ..................... OK",
  "  BUG BOUNTY ......................... OK",
  "  SOC / SIEM .......................... OK",
  "  AUTOMATION .......................... OK",
  "MOUNTING /ACTIVITY/LOG ................ OK",
  "CRT / VHS DISPLAY MODE ................ OK",
  "AUDIO CHIP: MECHANICAL ............... OK",
  "",
  "BOOTING ACTIVITY LOG ...",
];

export function BootSequence() {
  const [phase, setPhase] = useState<"checking" | "booting" | "done">("checking");
  const [count, setCount] = useState(0);
  const timers = useRef<number[]>([]);

  const finish = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    try {
      window.sessionStorage.setItem(BOOT_KEY, "1");
    } catch {
      /* ignore */
    }
    setPhase("done");
  };

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.sessionStorage.getItem(BOOT_KEY)) {
      setPhase("done");
      return;
    }
    setPhase("booting");

    LINES.forEach((_, i) => {
      const id = window.setTimeout(() => {
        setCount(i + 1);
        playSfx("tick");
      }, 70 + i * 85);
      timers.current.push(id);
    });

    const finishId = window.setTimeout(() => finish(), 70 + LINES.length * 85 + 550);
    timers.current.push(finishId);

    return () => timers.current.forEach(clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (phase !== "booting") return;
    const skip = () => finish();
    window.addEventListener("pointerdown", skip);
    window.addEventListener("keydown", skip);
    return () => {
      window.removeEventListener("pointerdown", skip);
      window.removeEventListener("keydown", skip);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  if (phase === "done") return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black px-6"
      role="status"
      aria-label="System boot sequence"
    >
      {phase === "booting" ? (
        <div className="w-full max-w-xl">
          {LINES.slice(0, count).map((line, i) => (
            <p
              key={i}
              className={`font-display text-xs leading-relaxed tracking-[0.08em] sm:text-sm ${
                line.includes("OK") ? "text-gold-bright" : "text-gold"
              }`}
            >
              {line || "\u00A0"}
            </p>
          ))}
          <p className="font-display text-xs text-cream sm:text-sm">
            <span className="blink">█</span>
          </p>
          <p className="mt-6 text-center font-display text-2xs tracking-[0.3em] text-muted">
            CLICK ANYWHERE TO SKIP
          </p>
        </div>
      ) : null}
    </div>
  );
}
