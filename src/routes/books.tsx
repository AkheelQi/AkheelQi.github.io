import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { SiteShell, PageTitle } from "@/components/site-shell";

export const Route = createFileRoute("/books")({ component: Books });

type ShelfBook = {
  id: string;
  title: string;
  author: string;
  year: string;
  notes: string;
  bg: string;
  fg: string;
  spine: string;
};

const SHELF: ShelfBook[] = [
  {
    id: "wahh",
    title: "The Web Application Hacker's Handbook",
    author: "Stuttard & Pinto",
    year: "2011",
    notes: "Still the bible of web app testing. Chapters on XSS and CSRF live rent-free.",
    bg: "#1a2744",
    fg: "#f3e6c4",
    spine: "#0e1628",
  },
  {
    id: "bhp",
    title: "Black Hat Python",
    author: "Justin Seitz",
    year: "2014",
    notes: "Python for pentesters — network tools, attackers, and the dark arts of sockets.",
    bg: "#0f1f14",
    fg: "#c9e0c9",
    spine: "#08120c",
  },
  {
    id: "hacking",
    title: "Hacking: The Art of Exploitation",
    author: "Jon Erickson",
    year: "2008",
    notes: "Stack overflows, format strings, and why the machine does what you tell it.",
    bg: "#2a1810",
    fg: "#f0d060",
    spine: "#150c08",
  },
  {
    id: "tangled",
    title: "The Tangled Web",
    author: "Michal Zalewski",
    year: "2011",
    notes: "Browser security from first principles. Zalewski at his most terrifying.",
    bg: "#1c1030",
    fg: "#d4c4f0",
    spine: "#0e0818",
  },
  {
    id: "ghost",
    title: "Ghost in the Wires",
    author: "Kevin Mitnick",
    year: "2011",
    notes: "Social engineering memoir. The most wanted hacker never cracked a crypto.",
    bg: "#3a1020",
    fg: "#f3e6c4",
    spine: "#1e0810",
  },
  {
    id: "metasploit",
    title: "Metasploit: The Penetration Tester's Guide",
    author: "Kennedy et al.",
    year: "2011",
    notes: "The framework that turned exploit delivery into an industry.",
    bg: "#4a2010",
    fg: "#f5d0a0",
    spine: "#261008",
  },
  {
    id: "deception",
    title: "The Art of Deception",
    author: "Kevin Mitnick",
    year: "2002",
    notes: "People are the weakest link. Mitnick proved it before phishing was a word.",
    bg: "#102830",
    fg: "#a8dce8",
    spine: "#081418",
  },
  {
    id: "ai-super",
    title: "AI Superpowers",
    author: "Kai-Fu Lee",
    year: "2018",
    notes: "China vs Silicon Valley in the race for AI. Still the best popular intro.",
    bg: "#3a2808",
    fg: "#f0d060",
    spine: "#1e1404",
  },
  {
    id: "human-compatible",
    title: "Human Compatible",
    author: "Stuart Russell",
    year: "2019",
    notes: "How to build AI that stays useful without maximizing the wrong objective.",
    bg: "#0c2038",
    fg: "#c4dcf5",
    spine: "#06101c",
  },
  {
    id: "deep-learning",
    title: "Deep Learning",
    author: "Goodfellow, Bengio & Courville",
    year: "2016",
    notes: "The textbook. Heavy. Worth every page if you care how the sausage is made.",
    bg: "#1a1a1a",
    fg: "#c9a227",
    spine: "#0c0c0c",
  },
];

function CoverArt({ book }: { book: ShelfBook }) {
  return (
    <div
      className="relative flex h-full w-full flex-col justify-between overflow-hidden border border-black/50 p-2.5 shadow-[inset_0_0_40px_rgba(0,0,0,0.45)]"
      style={{ background: book.bg, color: book.fg }}
    >
      <span
        aria-hidden
        className="absolute inset-y-0 left-0 w-1.5"
        style={{ background: book.spine }}
      />
      <span
        aria-hidden
        className="absolute inset-y-0 right-0 w-px opacity-40"
        style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.35))" }}
      />
      <div className="pl-2">
        <span aria-hidden className="mx-auto mb-2 block h-px w-8 bg-current opacity-50" />
        <p className="font-display text-[0.55rem] leading-snug tracking-[0.04em] sm:text-[0.7rem] sm:tracking-[0.08em]">
          {book.title}
        </p>
      </div>
      <div className="pl-2">
        <span aria-hidden className="mb-1.5 block h-px w-5 bg-current opacity-35" />
        <p className="text-[0.55rem] tracking-[0.12em] opacity-85 sm:text-[0.6rem]">
          {book.author}
        </p>
        <p className="mt-0.5 font-display text-[0.5rem] tracking-[0.2em] opacity-55">
          {book.year}
        </p>
      </div>
    </div>
  );
}

function Books() {
  const [active, setActive] = useState<ShelfBook | null>(null);
  const rows = [SHELF.slice(0, 4), SHELF.slice(4, 7), SHELF.slice(7)];

  return (
    <SiteShell>
      <PageTitle kicker="THE STACK" title="BOOKS" />
      <p className="mx-auto mb-10 max-w-2xl text-center text-sm text-muted">
        Face-out on the walnut, not spine-in. These are the volumes that shaped the
        craft — web hacking, social engineering, and the AI decade. Hover a cover for
        the dossier.
      </p>

      {/* the case */}
      <div
        className="relative mx-auto max-w-4xl overflow-hidden border-[10px] border-[#2a1a0c] p-2 shadow-[0_18px_50px_rgba(0,0,0,0.7)] sm:p-4"
        style={{
          background:
            "repeating-linear-gradient(90deg, transparent 0 4px, rgba(0,0,0,0.04) 4px 7px), linear-gradient(180deg, #3d2914 0%, #2a1c0e 40%, #1f140a 100%)",
        }}
      >
        {/* gold inner frame */}
        <div className="pointer-events-none absolute inset-1.5 border border-gold/35" aria-hidden />

        <div className="relative space-y-3 sm:space-y-4">
          {rows.map((row, i) => (
            <div key={i}>
              <div className="flex items-end justify-center gap-1.5 px-0.5 sm:gap-3 sm:px-1">
                {row.map((book) => (
                  <button
                    key={book.id}
                    type="button"
                    onMouseEnter={() => setActive(book)}
                    onMouseLeave={() => setActive((cur) => (cur?.id === book.id ? null : cur))}
                    onFocus={() => setActive(book)}
                    onBlur={() => setActive((cur) => (cur?.id === book.id ? null : cur))}
                    className="group relative shrink-0 outline-none"
                    aria-label={`${book.title} by ${book.author}`}
                  >
                    {/* dossier on hover */}
                    <div
                      className={`pointer-events-none absolute bottom-full left-1/2 z-30 mb-3 w-60 max-w-[70vw] -translate-x-1/2 border border-gold bg-ink p-3 shadow-[0_12px_34px_rgba(0,0,0,0.7)] transition duration-200 ${
                        active?.id === book.id
                          ? "opacity-100"
                          : "opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100"
                      }`}
                    >
                      <p className="font-display text-xs tracking-[0.16em] text-gold-bright">
                        {book.title}
                      </p>
                      <p className="mt-1 text-2xs text-cream">
                        {book.author} · {book.year}
                      </p>
                      <p className="mt-2 text-2xs leading-relaxed text-muted">{book.notes}</p>
                    </div>

                    <span
                      className="block h-[118px] w-[72px] origin-bottom transition-transform duration-200 group-hover:-translate-y-2 group-focus-visible:-translate-y-2 group-focus-visible:shadow-[0_0_0_1px_var(--color-gold)] sm:h-[148px] sm:w-[96px]"
                      style={{ boxShadow: "2px 4px 10px rgba(0,0,0,0.55)" }}
                    >
                      <CoverArt book={book} />
                    </span>
                  </button>
                ))}
              </div>
              {/* shelf plank */}
              <div
                className="mt-0 h-3 border-y border-black/50 sm:h-4"
                style={{
                  background:
                    "linear-gradient(180deg, #6b4420 0%, #4a2e14 35%, #3a2210 70%, #241408 100%)",
                  boxShadow: "0 4px 8px rgba(0,0,0,0.45)",
                }}
                aria-hidden
              />
            </div>
          ))}
        </div>

        {/* base plinth */}
        <div
          className="mt-1 h-4 border-t border-black/40 sm:h-5"
          style={{
            background:
              "repeating-linear-gradient(90deg, transparent 0 5px, rgba(0,0,0,0.05) 5px 8px), linear-gradient(180deg, #2a1a0c, #1a1008)",
          }}
          aria-hidden
        />
      </div>

      <p className="mt-6 text-center font-display text-2xs tracking-[0.25em] text-muted">
        TEN VOLUMES · NO OVERDUE FEES · NO UPLOADS — JUST THE SHELF
      </p>
    </SiteShell>
  );
}
