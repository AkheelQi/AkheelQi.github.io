import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteShell } from "@/components/site-shell";
import { WeeklyAiPulse } from "@/components/weekly-ai-pulse";
import { MusicChip } from "@/components/music-chip";
import {
  Bookshelf,
  CrtTv,
  DeskMonitor,
  PixelPerson,
  PlantPot,
  Sofa,
} from "@/components/pixel-sprites";
import { albums, aiQuotes, site } from "@/data/site";

export const Route = createFileRoute("/home")({ component: Home });

const ROOMS = ["bio", "gear", "books", "guestbook", "activity"] as const;
type RoomId = (typeof ROOMS)[number];
const VISITED_KEY = "hq-rooms-visited";

function useVisitedRooms() {
  const [visited, setVisited] = useState<RoomId[]>([]);
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(VISITED_KEY);
      if (raw) setVisited(JSON.parse(raw) as RoomId[]);
    } catch {
      /* first visit */
    }
  }, []);
  const mark = (id: RoomId) => {
    setVisited((v) => {
      if (v.includes(id)) return v;
      const next = [...v, id];
      try {
        window.localStorage.setItem(VISITED_KEY, JSON.stringify(next));
      } catch {
        /* ignore */
      }
      return next;
    });
  };
  return { visited, mark };
}

function RoomPlaque({ label, badge }: { label: string; badge?: string | number }) {
  return (
    <span className="pixel-plaque text-2xs tracking-[0.12em] sm:text-xs">
      {label}
      {badge !== undefined ? (
        <span className="inline-flex min-w-5 items-center justify-center border-2 border-outline bg-gold-bright px-1 text-2xs">
          {badge}
        </span>
      ) : null}
    </span>
  );
}

function WelcomeModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
      <div className="pixel-panel relative w-full max-w-md p-5">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close welcome note"
          className="bevel-ghost absolute right-3 top-3 flex size-9 items-center justify-center text-base"
        >
          ×
        </button>
        <p className="font-display text-lg font-semibold tracking-[0.1em]">WELCOME TO AKHEEL HQ</p>
        <div className="mt-4 border-2 border-outline bg-white px-3 py-2 shadow-[3px_3px_0_#101018]">
          <p className="text-sm text-outline">
            Heyyy 👋 this is the office. Every room is a page — tap one to walk in. The board up
            top lists the builds, and the neon is non-negotiable.
          </p>
        </div>
        <div className="mt-3 inline-block border-2 border-outline bg-white px-3 py-1 shadow-[3px_3px_0_#101018]">
          <span className="font-display text-sm tracking-[0.3em]">• • •</span>
        </div>
      </div>
    </div>
  );
}

function Home() {
  const { visited, mark } = useVisitedRooms();
  // The training platform stays on /projects but is off the HQ wall board.
  const boardAlbums = albums.filter((a) => a.slug !== "training");
  const [welcome, setWelcome] = useState(false);
  useEffect(() => {
    try {
      if (!window.sessionStorage.getItem("hq-welcomed")) {
        setWelcome(true);
        window.sessionStorage.setItem("hq-welcomed", "1");
      }
    } catch {
      /* ignore */
    }
  }, []);

  const room = (id: RoomId) => ({
    onClick: () => mark(id),
  });

  return (
    <SiteShell>
      {/* HUD bar */}
      <div className="sticky top-0 z-40 -mx-4 mb-6 flex flex-wrap items-center justify-end gap-2 border-b-3 border-outline bg-ink/95 px-4 py-2 backdrop-blur sm:-mx-6 sm:px-6">
        <span className="bevel-ghost mr-auto inline-flex min-h-10 items-center gap-2 px-3 py-1 text-sm">
          <span className="pixel-coin" aria-hidden />
          {visited.length}/{ROOMS.length}
        </span>
        <Link
          to="/projects"
          className="bevel inline-flex min-h-10 items-center px-3 py-1 text-sm no-underline"
        >
          Project board ({albums.length})
        </Link>
        <MusicChip />
      </div>

      {/* ── THE HQ MAP ── */}
      <div className="pixel-panel-dark overflow-hidden">
        {/* brick wall band */}
        <div className="brick-wall border-b-3 border-outline p-4 sm:p-5">
          <div className="flex flex-wrap items-stretch justify-center gap-4 lg:justify-between">
            {/* cork project board */}
            <div className="cork-board min-w-[260px] flex-1 p-3 lg:max-w-xl">
              <p className="border-2 border-outline bg-gold-bright px-2 py-1 text-center font-display text-2xs font-semibold tracking-[0.14em] text-outline sm:text-xs">
                PROJECT BOARD: {boardAlbums.length} BUILDS
              </p>
              <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
                {boardAlbums.map((a, i) => (
                  <a
                    key={a.slug}
                    href={a.href}
                    target="_blank"
                    rel="noreferrer"
                    className="block border-2 border-outline bg-paper px-2 py-1.5 no-underline shadow-[2px_2px_0_#101018] transition hover:-translate-y-0.5"
                    style={{ transform: `rotate(${i % 2 === 0 ? -1 : 1}deg)` }}
                  >
                    <span className="block font-display text-2xs font-semibold leading-tight text-outline sm:text-xs">
                      {a.title}
                    </span>
                    <span className="mt-0.5 block text-[0.6rem] leading-snug text-[#5c5647]">
                      {a.subtitle}
                    </span>
                  </a>
                ))}
              </div>
              <p className="mt-2 text-center font-display text-2xs tracking-[0.2em] text-[#4a2e1a]">
                tap a card to visit the build · full liner notes in PROJECTS
              </p>
            </div>

            {/* neon sign */}
            <div className="neon-board flex min-w-[180px] flex-col items-center justify-center px-5 py-4">
              <p className="neon-text neon-text-pixel text-xl leading-tight sm:text-2xl">
                Hey folks,
              </p>
              <p className="neon-text neon-text-pixel neon-text-cyan mt-1 text-xl leading-tight sm:text-2xl">
                How is GTA 6?!
              </p>
              <span className="sparkle-dot mt-2 text-xs text-neon-pink" aria-hidden>
                ✦ ✧ ✦
              </span>
            </div>
          </div>

          {/* shelf plants */}
          <div className="mt-4 flex items-end justify-around border-t-3 border-[#4a2e1a] pt-2" aria-hidden>
            {Array.from({ length: 8 }).map((_, i) => (
              <PlantPot key={i} className="w-6 sm:w-7" />
            ))}
          </div>
        </div>

        {/* rooms */}
        <div className="grid grid-cols-1 gap-4 bg-[#101018] p-4 sm:grid-cols-2 lg:grid-cols-3 sm:p-5">
          {/* BIO — command center */}
          <Link to="/bio" {...room("bio")} className="room wood-floor block min-h-48 p-3 no-underline">
            <RoomPlaque label="COMMAND CENTER" />
            <span className="float-y absolute right-3 top-3 text-xl" aria-hidden>
              ☀
            </span>
            <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between gap-2">
              <div className="relative">
                <DeskMonitor className="w-24 sm:w-28" />
                <PixelPerson
                  sitting
                  className="absolute -right-5 bottom-0 w-8"
                  shirt="#e8643f"
                />
              </div>
              <span className="pixel-tag max-w-[130px] text-2xs leading-tight">
                Akheel
                <br />
                <span className="text-[#5c5647]">Cybersecurity Researcher</span>
              </span>
            </div>
          </Link>

          {/* GEAR */}
          <Link to="/gear" {...room("gear")} className="room tile-floor block min-h-48 p-3 no-underline">
            <RoomPlaque label="GEAR ROOM" badge={8} />
            <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between gap-2">
              <Bookshelf className="w-20 sm:w-24" />
              <div className="flex flex-col items-end gap-1">
                {["BURP", "NMAP", "WIRESHARK"].map((t) => (
                  <span key={t} className="pixel-tag text-2xs">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </Link>

          {/* BOOKS */}
          <Link to="/books" {...room("books")} className="room wood-floor block min-h-48 p-3 no-underline">
            <RoomPlaque label="LIBRARY" badge="NEW" />
            <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between gap-2">
              <Bookshelf className="w-24 sm:w-28" />
              <span className="pixel-tag max-w-[120px] text-2xs leading-tight">
                shelf empty — volumes pending
              </span>
            </div>
          </Link>

          {/* GUESTBOOK */}
          <Link
            to="/guestbook"
            {...room("guestbook")}
            className="room tile-floor block min-h-48 p-3 no-underline"
          >
            <RoomPlaque label="LOUNGE · GUESTBOOK" />
            <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between gap-2">
              <Sofa className="w-24 sm:w-28" />
              <div className="relative">
                <span className="pixel-tag absolute -top-8 right-0 whitespace-nowrap text-2xs">
                  sign the book!
                </span>
                <PixelPerson className="w-8" shirt="#2f8a63" />
              </div>
            </div>
          </Link>

          {/* ACTIVITY — life story archive (wide room fills the grid) */}
          <Link
            to="/activity"
            {...room("activity")}
            className="room wood-floor block min-h-48 p-3 no-underline lg:col-span-2"
          >
            <RoomPlaque label="THE ARCHIVE · LIFE STORY" badge="NEW" />
            <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between gap-2">
              <div className="flex items-end gap-3">
                <Bookshelf className="w-20 sm:w-24" />
                <CrtTv className="hidden w-16 sm:block" />
              </div>
              <span className="pixel-tag max-w-[160px] text-2xs leading-tight">
                once upon a time… the whole story, in pixels
              </span>
            </div>
          </Link>
        </div>

        {/* footer socials — on the office floor */}
        <div className="wood-floor flex flex-wrap items-center justify-center gap-3 border-t-3 border-outline px-4 py-4">
          <a
            href={site.github}
            target="_blank"
            rel="noreferrer"
            className="bevel-ghost inline-flex min-h-10 items-center gap-2 px-3 py-1 text-sm no-underline"
          >
            <span aria-hidden>◎</span> @{site.githubHandle}
          </a>
          <a
            href={site.linkedin}
            target="_blank"
            rel="noreferrer"
            className="bevel-ghost inline-flex min-h-10 items-center gap-2 px-3 py-1 text-sm no-underline"
          >
            <span aria-hidden>in</span> LinkedIn
          </a>
          <a
            href={`mailto:${site.email}`}
            className="bevel-ghost inline-flex min-h-10 items-center gap-2 px-3 py-1 text-sm no-underline"
          >
            <span aria-hidden>✉</span> Email
          </a>
        </div>
      </div>

      {/* ── DISPATCHES BELOW THE MAP ── */}
      <div className="mt-10 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <section>
          <WeeklyAiPulse />
        </section>
        <section>
          <article className="pixel-panel p-5">
            <p className="font-display text-2xs tracking-[0.3em] text-[#8a6b16]">
              WISDOM OF THE MACHINE
            </p>
            <ul className="mt-3 space-y-3">
              {aiQuotes.map((q) => (
                <li key={q.text} className="border-t-2 border-outline/15 pt-3 first:border-0 first:pt-0">
                  <blockquote className="text-sm leading-relaxed text-outline">“{q.text}”</blockquote>
                  <p className="mt-1.5 text-right font-display text-2xs tracking-[0.14em] text-[#8d8672]">
                    — {q.source}
                  </p>
                </li>
              ))}
            </ul>
          </article>
        </section>
      </div>

      {welcome ? <WelcomeModal onClose={() => setWelcome(false)} /> : null}
    </SiteShell>
  );
}