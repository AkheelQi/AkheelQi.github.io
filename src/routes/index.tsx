import { useRef, type MouseEvent } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { site } from "@/data/site";
import { SparkleCursor } from "@/components/sparkle-cursor";
import { SpinningBadge } from "@/components/spinning-badge";
import { MoodPopup } from "@/components/mood-popup";
import { moodToggle } from "@/lib/mood-player";

export const Route = createFileRoute("/")({ component: Splash });

function Splash() {
  const clickTimer = useRef<number | undefined>(undefined);

  const onHeadClick = (e: MouseEvent<HTMLAnchorElement>) => {
    if (clickTimer.current !== undefined) {
      window.clearTimeout(clickTimer.current);
      clickTimer.current = undefined;
      return;
    }
    e.preventDefault();
    clickTimer.current = window.setTimeout(() => {
      clickTimer.current = undefined;
      moodToggle();
    }, 300);
  };

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center px-4 py-12">
      <SparkleCursor />
      <div className="scanlines pointer-events-none absolute inset-0 z-10 mix-blend-multiply" />
      <h1 className="gold-foil relative z-20 text-center font-display text-4xl font-bold tracking-[0.18em]">
        {site.shortName}
      </h1>
      <p className="relative z-20 mt-3 text-center font-display text-sm tracking-[0.35em] text-muted">
        {site.motto}
      </p>

      <Link
        to="/home"
        onClick={onHeadClick}
        title="click for music — double-click to enter"
        aria-label="Enter the official site"
        className="relative z-20 mt-8 block touch-manipulation select-none no-underline"
      >
        <SpinningBadge className="mx-auto size-44 sm:size-56" />
      </Link>

      <p className="relative z-20 mt-6 max-w-md text-center text-sm text-cream">{site.tagline}</p>
      <p className="relative z-20 mt-2 max-w-lg text-center text-xs text-muted">
        Do Pentesting · Bug Hunting · SOC · Development.
      </p>

      <Link
        to="/home"
        className="bevel relative z-20 mt-8 inline-flex min-h-12 min-w-48 items-center justify-center px-8 font-display text-sm font-semibold tracking-[0.35em] no-underline"
      >
        GET-IN
      </Link>

      <p className="relative z-20 mt-10 text-center text-2xs tracking-[0.25em] text-muted">
        BEST VIEWED IN AN NON-JUDGY WAY
        <br />
      </p>
      <MoodPopup />
    </main>
  );
}
