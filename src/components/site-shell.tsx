import { useRef, useState, type MouseEvent, type ReactNode } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { nav, site } from "@/data/site";
import { SparkleCursor } from "@/components/sparkle-cursor";
import { SpinningBadge } from "@/components/spinning-badge";
import { VisitorCounter } from "@/components/visitor";
import { MoodPopup } from "@/components/mood-popup";
import { moodToggle } from "@/lib/mood-player";

export function SiteShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const clickTimer = useRef<number | undefined>(undefined);

  const onHeadClick = (e: MouseEvent) => {
    if (clickTimer.current !== undefined) {
      window.clearTimeout(clickTimer.current);
      clickTimer.current = undefined;
      void navigate({ to: "/home" });
      return;
    }
    e.preventDefault();
    clickTimer.current = window.setTimeout(() => {
      clickTimer.current = undefined;
      moodToggle();
    }, 300);
  };

  return (
    <div className="relative min-h-screen">
      <SparkleCursor />
      <header className="relative z-20 mx-auto max-w-6xl px-4 pt-5 sm:px-6">
        <Link to="/home" className="block no-underline">
          <h1 className="gold-foil text-center font-display text-3xl font-bold tracking-[0.14em] sm:text-4xl">
            {site.shortName}
          </h1>
        </Link>
        <p className="mt-2 text-center font-display text-xs tracking-[0.3em] text-muted">
          {site.motto}
        </p>
        <div
          onClick={onHeadClick}
          title="click for music — double-click for home"
          className="mx-auto mt-4 w-fit cursor-pointer touch-manipulation select-none"
        >
          <SpinningBadge className="size-16 sm:size-20" />
        </div>
        <hr className="gold-rule mx-auto mt-4 max-w-3xl" />

        <nav className="mt-4 hidden flex-wrap items-center justify-center gap-2 sm:flex">
          {nav.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="nav-link bevel-ghost px-3 py-1 font-display text-xs tracking-[0.14em] no-underline"
              activeProps={{ className: "bevel text-outline" }}
            >
              {item.label}
              {"badge" in item && item.badge ? (
                <sup className="blink ml-1 font-body text-2xs text-oxblood">{item.badge}</sup>
              ) : null}
            </Link>
          ))}
        </nav>

        <div className="mt-3 sm:hidden">
          <button
            type="button"
            className="bevel min-h-11 w-full font-display text-sm tracking-[0.3em]"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
          >
            {open ? "CLOSE MENU" : "MENU"}
          </button>
          {open ? (
            <ul className="mt-2 border-3 border-outline bg-cream shadow-[5px_5px_0_#101018]">
              {nav.map((item) => (
                <li key={item.to} className="border-b-2 border-outline/15 last:border-0">
                  <Link
                    to={item.to}
                    onClick={() => setOpen(false)}
                    className="flex min-h-11 items-center px-4 font-display text-sm tracking-[0.14em] text-outline no-underline"
                    activeProps={{ className: "bg-gold-bright" }}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </header>

      <div className="relative z-20 mx-auto mt-4 max-w-6xl overflow-hidden border-y-3 border-outline bg-cream">
        <div className="marquee-track flex w-max gap-16 py-2 font-display text-xs tracking-[0.18em] text-outline whitespace-nowrap">
          {Array.from({ length: 2 }).map((_, k) => (
            <p key={k} className="flex gap-16 px-8">
              <span>WELCOME TO AKHEEL HQ — {site.tagline.toUpperCase()}</span>
              <span className="text-oxblood">▚▚</span>
              <span>AN ABSURD GO GETTER</span>
              <span className="text-oxblood">▚▚</span>
              <span>HOPE YOU FIND'S ME WELL</span>
              <span className="text-oxblood">▚▚</span>
              <span>SIGN THE GUESTBOOK · DO NOT XSS THE COUNTER</span>
            </p>
          ))}
        </div>
      </div>

      <main className="relative z-20 mx-auto max-w-6xl px-4 py-8 sm:px-6">{children}</main>

      <footer className="site-footer relative z-20 mx-auto max-w-6xl px-4 pb-10 sm:px-6">
        <hr className="gold-rule mb-5" />
        <div className="flex flex-col items-center gap-4 text-center">
          <VisitorCounter />
          <p className="max-w-xl text-xs leading-snug text-muted">
            Unauthorized vulnerability testing of this guestbook is still unauthorized.
          </p>
        </div>
      </footer>
      <MoodPopup />
    </div>
  );
}

export function PageTitle({ kicker, title }: { kicker: string; title: string }) {
  return (
    <header className="mb-8 text-center">
      <p className="font-display text-2xs tracking-[0.4em] text-gold">{kicker}</p>
      <h2 className="mt-2 font-display text-2xl font-semibold tracking-[0.1em] text-cream sm:text-3xl">
        {title}
      </h2>
      <hr className="gold-rule mx-auto mt-4 max-w-md" />
    </header>
  );
}