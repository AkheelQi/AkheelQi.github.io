import { useEffect, useRef, useState, type ReactNode } from "react";
import { playSfx } from "@/lib/retro-audio";

type RetroWindowProps = {
  title: string;
  children: ReactNode;
  open: boolean;
  focused: boolean;
  align: "left" | "right";
  onFocus: () => void;
  onClose: () => void;
};

const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n));

export function RetroWindow({
  title,
  children,
  open,
  focused,
  align,
  onFocus,
  onClose,
}: RetroWindowProps) {
  const [fine, setFine] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [size, setSize] = useState<{ w?: number; h?: number }>({});
  const elRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setFine(window.matchMedia("(pointer: fine)").matches);
  }, []);

  if (!open) return null;

  const startDrag = (e: React.PointerEvent) => {
    if (!fine) return;
    if ((e.target as HTMLElement).closest("button")) return;
    e.preventDefault();
    onFocus();
    const sx = e.clientX;
    const sy = e.clientY;
    const ox = pos.x;
    const oy = pos.y;
    const move = (ev: PointerEvent) => {
      setPos({ x: ox + (ev.clientX - sx), y: oy + (ev.clientY - sy) });
    };
    const up = () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  };

  const startResize = (e: React.PointerEvent) => {
    if (!fine) return;
    e.preventDefault();
    e.stopPropagation();
    onFocus();
    const el = elRef.current;
    if (!el) return;
    const sx = e.clientX;
    const sy = e.clientY;
    const ow = el.offsetWidth;
    const oh = el.offsetHeight;
    const move = (ev: PointerEvent) => {
      setSize({
        w: clamp(ow + (ev.clientX - sx), 280, 1100),
        h: clamp(oh + (ev.clientY - sy), 150, 900),
      });
    };
    const up = () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  };

  return (
    <li
      className={`relative w-full max-w-2xl ${align === "right" ? "sm:ml-auto" : ""}`}
      style={{
        transform: `translate(${pos.x}px, ${pos.y}px)`,
        zIndex: focused ? 30 : 10,
      }}
    >
      <div
        ref={elRef}
        onPointerDown={onFocus}
        style={{ width: size.w, height: size.h }}
        className={`relative flex flex-col border-2 bg-ink-soft shadow-[4px_4px_0_rgba(0,0,0,0.7)] ${
          focused ? "border-cream" : "border-gold"
        }`}
      >
        <div
          onPointerDown={startDrag}
          className={`flex shrink-0 items-center justify-between gap-2 border-b-2 border-gold bg-gradient-to-b from-gold-bright to-gold px-2 py-1 select-none ${
            fine ? "cursor-grab active:cursor-grabbing" : ""
          }`}
        >
          <span className="truncate font-display text-2xs font-bold tracking-[0.18em] text-ink sm:text-xs">
            {title}
          </span>
          <span className="flex shrink-0 gap-1">
            <button
              type="button"
              aria-label={`Minimize ${title}`}
              onClick={() => {
                playSfx("clunk");
                onClose();
              }}
              className="flex size-4 items-center justify-center border border-ink bg-cream text-[10px] leading-none text-ink hover:bg-gold-bright"
            >
              _
            </button>
            <button
              type="button"
              aria-label={`Close ${title}`}
              onClick={() => {
                playSfx("clunk");
                onClose();
              }}
              className="flex size-4 items-center justify-center border border-ink bg-cream text-[10px] leading-none text-ink hover:bg-oxblood hover:text-cream"
            >
              ✕
            </button>
          </span>
        </div>

        <div className="min-h-0 flex-1 overflow-auto p-4">{children}</div>

        {fine ? (
          <div
            onPointerDown={startResize}
            className="absolute right-0 bottom-0 size-4 cursor-nwse-resize"
            style={{
              backgroundImage:
                "linear-gradient(135deg, transparent 50%, var(--color-gold) 50%, var(--color-gold) 60%, transparent 60%, transparent 70%, var(--color-gold) 70%, var(--color-gold) 80%, transparent 80%)",
            }}
            aria-hidden
          />
        ) : null}
      </div>
    </li>
  );
}
