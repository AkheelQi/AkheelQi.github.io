import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { SiteShell, PageTitle } from "@/components/site-shell";

export const Route = createFileRoute("/books")({ component: Books });

/* The webmaster's shelf — books loved & read so far.
 * bg/fg/spine are flat hex colors for the pixel cover art. */
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
    id: "karamazov",
    title: "THE BROTHERS KARAMAZOV",
    author: "Fyodor Dostoevsky",
    year: "1880",
    notes:
      "Three brothers, one murdered father, and every big question — faith, doubt, free will — put on trial. The Grand Inquisitor chapter alone earns its place on the shelf.",
    bg: "#6b1c23",
    fg: "#fff7e3",
    spine: "#4a1216",
  },
  {
    id: "white-nights",
    title: "WHITE NIGHTS",
    author: "Fyodor Dostoevsky",
    year: "1848",
    notes:
      "A dreamer and a girl, four nights in Petersburg. Dostoevsky's tenderest short novel — longing, almost-happiness, and the morning after.",
    bg: "#22304c",
    fg: "#fff7e3",
    spine: "#16203a",
  },
  {
    id: "heights-of-despair",
    title: "ON THE HEIGHTS OF DESPAIR",
    author: "Emil Cioran",
    year: "1934",
    notes:
      "Cioran at twenty-three: insomnia, despair, and lyric philosophy. The first book of a man who made pessimism a craft.",
    bg: "#141414",
    fg: "#e8643f",
    spine: "#2b2b2b",
  },
  {
    id: "five-rings",
    title: "THE BOOK OF FIVE RINGS",
    author: "Miyamoto Musashi",
    year: "1645",
    notes:
      "Musashi's five scrolls of strategy — earth, water, fire, wind, void — written in a cave near the end of his life. A swordsman's manual that reads like a mindset.",
    bg: "#8a3b32",
    fg: "#fff7e3",
    spine: "#5e2a24",
  },
  {
    id: "godot",
    title: "WAITING FOR GODOT",
    author: "Samuel Beckett",
    year: "1953",
    notes:
      "Two men, one tree, and someone who never arrives. Nothing happens — twice. The funniest despair ever staged.",
    bg: "#2f8a63",
    fg: "#fff7e3",
    spine: "#1f4a30",
  },
  {
    id: "zarathustra",
    title: "THUS SPOKE ZARATHUSTRA",
    author: "Friedrich Nietzsche",
    year: "1883",
    notes:
      "The prophet comes down the mountain: the Übermensch, eternal recurrence, and everything you were told to believe, revalued.",
    bg: "#b87333",
    fg: "#141414",
    spine: "#8a5620",
  },
  {
    id: "tao",
    title: "TAO TE CHING",
    author: "Laozi",
    year: "c. 400 BCE",
    notes:
      "Eighty-one verses on the Way — wu wei, softness over hardness, and the usefulness of emptiness. The oldest book here, still the quietest.",
    bg: "#fff7e3",
    fg: "#141414",
    spine: "#c9a227",
  },
  {
    id: "sapiens",
    title: "SAPIENS",
    author: "Yuval Noah Harari",
    year: "2011",
    notes:
      "From forager bands to empires, money, and algorithms — Harari's sweep through how shared stories ran the species.",
    bg: "#ffc23d",
    fg: "#141414",
    spine: "#c98f2b",
  },
  {
    id: "kappirikal",
    title: "KAPPIRIKALUDE NATTIL",
    author: "S.K. Pottekkatt",
    year: "1951",
    notes:
      "Pottekkatt's 1949 African journey in Malayalam — East Africa under white rule, its peoples, landscapes, and liberation struggles. Expedition notes with a pulse.",
    bg: "#5aa0e6",
    fg: "#141414",
    spine: "#3d7bc0",
  },
  {
    id: "nile-diary",
    title: "NILE DIARY",
    author: "S.K. Pottekkatt",
    year: "1949",
    notes:
      "The Nile journey begun at Ripon Falls in November 1949 — villages, people, and the river, told in Malayalam by the master of the travelogue.",
    bg: "#4fe3e0",
    fg: "#141414",
    spine: "#2fa8a5",
  },
];

function CoverArt({ book }: { book: ShelfBook }) {
  return (
    <div
      className="relative flex h-full w-full flex-col justify-between overflow-hidden border-3 border-outline p-2.5 shadow-[3px_3px_0_#101018]"
      style={{ background: book.bg, color: book.fg }}
    >
      <span aria-hidden className="absolute inset-y-0 left-0 w-2" style={{ background: book.spine }} />
      <div className="pl-2.5">
        <span aria-hidden className="mx-auto mb-2 block h-0.5 w-8 bg-current opacity-60" />
        <p className="font-display text-[0.6rem] leading-snug tracking-[0.03em] sm:text-[0.72rem]">
          {book.title}
        </p>
      </div>
      <div className="pl-2.5">
        <span aria-hidden className="mb-1.5 block h-0.5 w-5 bg-current opacity-40" />
        <p className="text-[0.55rem] tracking-[0.08em] opacity-90 sm:text-[0.62rem]">{book.author}</p>
        <p className="mt-0.5 font-display text-[0.5rem] tracking-[0.16em] opacity-60">{book.year}</p>
      </div>
    </div>
  );
}

function BookModal({ book, onClose }: { book: ShelfBook; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4"
      onClick={onClose}
    >
      <div
        className="pixel-panel relative w-full max-w-md p-5"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-label={`${book.title} — liner notes`}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close book notes"
          className="bevel-ghost absolute right-3 top-3 flex size-9 items-center justify-center text-base"
        >
          ×
        </button>
        <div className="flex items-start gap-4">
          <span className="block h-32 w-20 shrink-0">
            <CoverArt book={book} />
          </span>
          <div className="pr-8">
            <span className="pixel-plaque text-2xs tracking-[0.14em]">{book.year}</span>
            <h3 className="mt-2 font-display text-lg font-semibold leading-tight tracking-[0.04em] text-outline">
              {book.title}
            </h3>
            <p className="mt-1 text-sm text-[#5c5647]">{book.author}</p>
            <span className="pixel-tag mt-2 text-2xs">READ ✓</span>
          </div>
        </div>
        <div className="mt-4 border-2 border-outline bg-white px-3 py-2 shadow-[3px_3px_0_#101018]">
          <p className="text-sm leading-relaxed text-outline">{book.notes}</p>
        </div>
      </div>
    </div>
  );
}

function Books() {
  const [open, setOpen] = useState<ShelfBook | null>(null);
  const rows = [SHELF.slice(0, 5), SHELF.slice(5)];
  return (
    <SiteShell>
      <PageTitle kicker="THE STACK" title="BOOKS" />
      <p className="mx-auto mb-8 max-w-2xl text-center text-sm text-muted">
        Books the webmaster loves and has read so far — philosophy, strategy, despair, and
        expedition notes. Tap a cover for the liner notes.
      </p>

      {/* the pixel case */}
      <div className="relative mx-auto max-w-4xl border-3 border-outline bg-[#3d2914] p-3 shadow-[6px_6px_0_#101018] sm:p-5">
        <div className="mb-4 text-center">
          <span className="pixel-plaque text-2xs tracking-[0.18em] sm:text-xs">
            THE WEBMASTER&apos;S SHELF · {SHELF.length} VOLUMES
          </span>
        </div>
        <div className="space-y-4">
          {rows.map((row, i) => (
            <div key={i}>
              <div className="flex flex-wrap items-end justify-center gap-3 px-1 sm:gap-4">
                {row.map((book, j) => (
                  <button
                    key={book.id}
                    type="button"
                    onClick={() => setOpen(book)}
                    aria-label={`Open notes for ${book.title}`}
                    className={`block shrink-0 transition-transform hover:-translate-y-1 ${
                      j % 2 === 0 ? "h-[150px] w-[96px] sm:h-[180px] sm:w-[118px]" : "h-[138px] w-[96px] sm:h-[166px] sm:w-[118px]"
                    }`}
                  >
                    <CoverArt book={book} />
                  </button>
                ))}
              </div>
              {/* shelf plank */}
              <div className="mt-0 h-3 border-y-3 border-outline bg-wood-light sm:h-4" aria-hidden />
            </div>
          ))}
        </div>
        {/* base plinth */}
        <div className="mt-2 h-4 border-3 border-outline bg-[#2a1a0c]" aria-hidden />
      </div>

      {open ? <BookModal book={open} onClose={() => setOpen(null)} /> : null}
    </SiteShell>
  );
}