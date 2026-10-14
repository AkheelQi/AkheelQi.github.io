import { createFileRoute } from "@tanstack/react-router";
import { SiteShell, PageTitle } from "@/components/site-shell";

export const Route = createFileRoute("/books")({ component: Books });

/* Add books here later — same shape:
 * { id, title, author, year, notes, bg, fg, spine }
 * bg/fg/spine are hex colors for the cover art.
 */
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

const SHELF: ShelfBook[] = [];

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
  const rows = [SHELF.slice(0, 4), SHELF.slice(4, 7), SHELF.slice(7)];

  return (
    <SiteShell>
      <PageTitle kicker="THE STACK" title="BOOKS" />

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
                  <div
                    key={book.id}
                    className="group relative shrink-0"
                  >
                    <span
                      className="block h-[118px] w-[72px] sm:h-[148px] sm:w-[96px]"
                      style={{ boxShadow: "2px 4px 10px rgba(0,0,0,0.55)" }}
                    >
                      <CoverArt book={book} />
                    </span>
                  </div>
                ))}
                {row.length === 0 && i === 0 ? (
                  <p className="py-10 font-display text-2xs tracking-[0.3em] text-muted">
                    SHELF EMPTY — VOLUMES PENDING
                  </p>
                ) : null}
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
    </SiteShell>
  );
}
