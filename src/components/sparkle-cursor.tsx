import { useEffect } from "react";

export function SparkleCursor() {
  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const coarse = window.matchMedia("(pointer: coarse)");
    if (motion.matches || coarse.matches) return;

    const dots: HTMLSpanElement[] = [];

    function sparkle(e: MouseEvent) {
      const el = document.createElement("span");
      el.textContent = "★";
      el.style.cssText = [
        "position:fixed",
        `left:${e.clientX}px`,
        `top:${e.clientY}px`,
        "pointer-events:none",
        "z-index:80",
        "font-size:10px",
        "color:#f0d060",
        "transform:translate(-50%,-50%)",
        "transition:opacity 420ms ease, transform 420ms ease",
      ].join(";");
      document.body.appendChild(el);
      dots.push(el);
      requestAnimationFrame(() => {
        el.style.opacity = "0";
        el.style.transform = "translate(-50%,-120%) scale(0.4)";
      });
      window.setTimeout(() => {
        el.remove();
      }, 450);
      if (dots.length > 24) dots.shift()?.remove();
    }

    window.addEventListener("mousemove", sparkle);
    return () => {
      window.removeEventListener("mousemove", sparkle);
      dots.forEach((d) => d.remove());
    };
  }, []);

  return null;
}
