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
      <div className="scanlines pointer-events-none absolute inset-0 z-10 mix-blend-multiply" />
      <header className="relative z-20 mx-auto max-w-6xl px-4 pt-5 sm:px-6">
        <Link to="/home" className="block no-underline">
          <h1 className="gold-foil text-center font-display text-3xl font-bold tracking-[0.18em] sm:text-4xl">
            {site.shortName}
          </h1>
        </Link>
        <p className="mt-2 text-center font-display text-xs tracking-[0.35em] text-muted">
          {site.motto}
        </p>
        <div
          onClick={onHeadClick}
          title="click for music — double-click for home"
          className="mx-auto mt-4 w-fit cursor-pointer touch-manipulation select-none"
        >
          <SpinningBadge className="size-20 sm:size-28" />
        </div>
        <hr className="gold-rule mx-auto mt-4 max-w-3xl" />

        <nav className="mt-4 hidden flex-wrap items-center justify-center gap-x-3 gap-y-2 sm:flex">
          {nav.map((item, i) => (
            <span key={item.to} className="flex items-center gap-3">
              {i > 0 ? <span className="text-gold">★</span> : null}
              <Link
                to={item.to}
                className="nav-link font-display text-xs tracking-[0.22em] text-gold-bright no-underline hover:text-cream"
                activeProps={{ className: "text-cream underline decoration-gold underline-offset-4" }}
              >
                {item.label}
                {"badge" in item && item.badge ? (
                  <sup className="blink ml-1 font-body text-2xs text-oxblood">{item.badge}</sup>
                ) : null}
              </Link>
            </span>
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
            <ul className="mt-2 border border-gold bg-ink-soft">
              {nav.map((item) => (
                <li key={item.to} className="border-b border-gold/30 last:border-0">
                  <Link
                    to={item.to}
                    onClick={() => setOpen(false)}
                    className="flex min-h-11 items-center px-4 font-display text-sm tracking-[0.2em] text-gold-bright no-underline"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </header>

      <div className="relative z-20 mx-auto mt-4 max-w-6xl overflow-hidden border-y border-gold/40 bg-ink-soft/80">
        <div className="marquee-track flex w-max gap-16 py-2 text-xs tracking-[0.2em] text-gold whitespace-nowrap">
          {Array.from({ length: 2 }).map((_, k) => (
            <p key={k} className="flex gap-16 px-8">
              <span>WELCOME TO THE OFFICIAL SITE — {site.tagline.toUpperCase()}</span>
              <span>AN ABSURD GO GETTER</span>
              <span>HOPE YOU FIND'S ME WELL</span>
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
            © 1998–2026 {site.name}. This page is a loving 90s tribute, not an actual 1998 server.
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
      <h2 className="mt-2 font-display text-2xl font-semibold tracking-[0.16em] text-cream sm:text-3xl">
        {title}
      </h2>
      <hr className="gold-rule mx-auto mt-4 max-w-md" />
    </header>
  );
}
