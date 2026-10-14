import { useCallback, useEffect, useMemo, useState, type FormEvent } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { SiteShell, PageTitle } from "@/components/site-shell";
import { BookReader } from "@/components/book-reader";
import {
  addBook,
  deleteBook,
  fileKind,
  formatSize,
  listBooks,
  type ShelfBook,
} from "@/lib/books";

export const Route = createFileRoute("/books")({ component: Books });

const SPINE_COLORS = [
  "#7a2e38",
  "#5c1f28",
  "#8a6a1f",
  "#6e5a2a",
  "#2a4a3a",
  "#243a52",
  "#4a2a4a",
  "#3a3a2e",
];

function spineHash(title: string): number {
  let h = 0;
  for (let i = 0; i < title.length; i++) h = (h * 31 + title.charCodeAt(i)) >>> 0;
  return h;
}

function Books() {
  const [books, setBooks] = useState<ShelfBook[]>([]);
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [reading, setReading] = useState<ShelfBook | null>(null);

  const refresh = useCallback(async () => {
    try {
      setBooks(await listBooks());
    } catch {
      setBooks([]);
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const file = fd.get("file");
    if (!(file instanceof File) || file.size === 0) {
      setError("Pick a file — a shelf without books is just furniture.");
      return;
    }
    setError("");
    setBusy(true);
    try {
      await addBook({
        title: String(fd.get("title") ?? ""),
        author: String(fd.get("author") ?? ""),
        year: String(fd.get("year") ?? ""),
        notes: String(fd.get("notes") ?? ""),
        file,
      });
      form.reset();
      await refresh();
    } catch {
      setError("The shelf refused the donation — browser storage may be full.");
      await refresh();
    } finally {
      setBusy(false);
    }
  }

  async function onDelete(book: ShelfBook) {
    if (!window.confirm(`Burn "${book.title}" from the shelf?`)) return;
    await deleteBook(book.id);
    if (reading?.id === book.id) setReading(null);
    await refresh();
  }

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return books;
    return books.filter((b) =>
      [b.title, b.author, b.notes, b.fileName].some((s) => s.toLowerCase().includes(q)),
    );
  }, [books, query]);

  return (
    <SiteShell>
      <PageTitle kicker="THE SHELF" title="BOOKS" />
      <p className="mx-auto mb-8 max-w-2xl text-center text-sm text-muted">
        Stacked the old way. Hover a spine for the dossier — click it and the book opens right
        here: cover first, then page by page with the buttons, arrow keys, or a swipe. Uploads
        stay in this browser, no server, no overdue fees.
      </p>

      {loaded && books.length > 0 ? (
        <label className="mx-auto mb-8 block max-w-md text-xs tracking-[0.2em] text-gold">
          SEARCH THE SHELF
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="inset-field mt-1 min-h-11 w-full bg-ink px-3 text-sm text-cream"
            placeholder="title, author, notes…"
          />
        </label>
      ) : null}

      {loaded && books.length === 0 ? (
        <div className="mx-auto max-w-xl border border-dashed border-gold/60 bg-ink-soft p-10 text-center">
          <p className="font-display text-lg tracking-[0.25em] text-gold-bright">SHELF EMPTY</p>
          <p className="mt-3 text-sm text-muted">
            Nothing here yet. Upload a PDF below — it gets a spine, a cover, and a reader. It
            stays on this machine, like the guestbook, forever.
          </p>
        </div>
      ) : null}

      {visible.length > 0 ? (
        <div className="mx-auto mb-12 max-w-4xl">
          <div className="flex flex-wrap items-end justify-center">
            {visible.map((book) => {
              const h = spineHash(book.title);
              const color = SPINE_COLORS[h % SPINE_COLORS.length];
              const height = 150 + (h % 5) * 14;
              const width = 30 + (h % 3) * 5;
              return (
                <div key={book.id} className="group relative">
                  {/* hover dossier */}
                  <div className="pointer-events-none absolute bottom-full left-1/2 z-30 mb-3 w-64 max-w-[72vw] -translate-x-1/2 border border-gold bg-ink p-3 opacity-0 shadow-[0_12px_34px_rgba(0,0,0,0.65)] transition duration-200 group-hover:opacity-100 group-focus-within:opacity-100">
                    <p className="font-display text-xs tracking-[0.16em] text-gold-bright">
                      {book.title}
                    </p>
                    <p className="mt-1 text-2xs text-cream">
                      {book.author}
                      {book.year ? ` · ${book.year}` : ""}
                    </p>
                    {book.notes ? (
                      <p className="mt-2 line-clamp-3 text-2xs leading-relaxed text-muted">
                        {book.notes}
                      </p>
                    ) : null}
                    <p className="mt-2 text-2xs tracking-[0.15em] text-gold">
                      {fileKind(book)} · {formatSize(book.size)} ·{" "}
                      {isReadableLabel(book)} · CLICK TO OPEN
                    </p>
                    <div className="pointer-events-auto mt-2 flex gap-2">
                      <button
                        type="button"
                        onClick={() => void onDelete(book)}
                        className="min-h-8 border border-oxblood px-2 font-display text-2xs tracking-[0.18em] text-oxblood hover:bg-oxblood hover:text-cream"
                      >
                        BURN
                      </button>
                    </div>
                  </div>

                  {/* the spine */}
                  <button
                    type="button"
                    onClick={() => setReading(book)}
                    aria-label={`Open ${book.title} by ${book.author}`}
                    style={{ background: color, height, width }}
                    className="relative flex items-center justify-center border-x border-black/40 transition-transform duration-200 group-hover:-translate-y-2.5 focus-visible:-translate-y-2.5 focus-visible:outline focus-visible:outline-gold"
                  >
                    <span
                      aria-hidden
                      className="pointer-events-none absolute inset-0"
                      style={{
                        background:
                          "linear-gradient(90deg, rgba(0,0,0,0.4), transparent 28%, transparent 72%, rgba(0,0,0,0.45))",
                      }}
                    />
                    <span
                      aria-hidden
                      className="absolute inset-x-1 top-2 h-px bg-gold/70"
                    />
                    <span
                      aria-hidden
                      className="absolute inset-x-1 bottom-3 h-px bg-gold/70"
                    />
                    <span
                      className="relative line-clamp-2 px-1 font-display text-2xs tracking-[0.08em] text-cream/95"
                      style={{ writingMode: "vertical-rl" }}
                    >
                      {book.title}
                    </span>
                  </button>
                  {/* shelf plank under this spine */}
                  <div className="h-0 border-b-2 border-gold/80" />
                </div>
              );
            })}
          </div>
        </div>
      ) : null}

      {loaded && books.length > 0 && visible.length === 0 ? (
        <p className="mb-10 text-center text-sm text-muted">No volume matches “{query}”.</p>
      ) : null}

      {/* donate form */}
      <form
        onSubmit={onSubmit}
        className="mx-auto max-w-xl space-y-3 border border-gold bg-ink-soft p-5"
      >
        <p className="font-display text-2xs tracking-[0.3em] text-gold">DONATE A BOOK</p>
        <label className="block text-xs tracking-[0.2em] text-gold">
          TITLE *
          <input
            name="title"
            required
            maxLength={120}
            className="inset-field mt-1 min-h-11 w-full bg-ink px-3 text-sm text-cream"
            placeholder="The Web Application Hacker's Handbook"
          />
        </label>
        <div className="grid gap-3 sm:grid-cols-[1fr_110px]">
          <label className="block text-xs tracking-[0.2em] text-gold">
            AUTHOR
            <input
              name="author"
              maxLength={80}
              className="inset-field mt-1 min-h-11 w-full bg-ink px-3 text-sm text-cream"
              placeholder="Stuttard & Pinto"
            />
          </label>
          <label className="block text-xs tracking-[0.2em] text-gold">
            YEAR
            <input
              name="year"
              maxLength={16}
              inputMode="numeric"
              className="inset-field mt-1 min-h-11 w-full bg-ink px-3 text-sm text-cream"
              placeholder="2011"
            />
          </label>
        </div>
        <label className="block text-xs tracking-[0.2em] text-gold">
          NOTES
          <textarea
            name="notes"
            rows={2}
            maxLength={600}
            className="inset-field mt-1 w-full bg-ink px-3 py-2 text-sm text-cream"
            placeholder="Why it earns shelf space."
          />
        </label>
        <label className="block text-xs tracking-[0.2em] text-gold">
          BOOK FILE *{" "}
          <span className="tracking-normal text-muted">(pdf · epub · mobi · fb2 · zip — 100 MB max)</span>
          <input
            name="file"
            type="file"
            required
            accept=".pdf,.epub,.mobi,.azw,.azw3,.fb2,.zip,.txt,application/pdf,application/epub+zip"
            className="inset-field mt-1 block w-full cursor-pointer bg-ink px-3 py-2 text-sm text-cream file:mr-3 file:cursor-pointer file:border file:border-gold file:bg-ink-soft file:px-3 file:py-1.5 file:font-display file:text-2xs file:tracking-[0.2em] file:text-gold"
          />
        </label>
        {error ? <p className="text-sm text-oxblood">{error}</p> : null}
        <button
          type="submit"
          disabled={busy}
          className="bevel min-h-11 px-6 font-display text-xs tracking-[0.25em] disabled:opacity-50"
        >
          {busy ? "SHELVING…" : "SHELF IT"}
        </button>
      </form>

      {reading ? <BookReader book={reading} onClose={() => setReading(null)} /> : null}
    </SiteShell>
  );
}

function isReadableLabel(book: ShelfBook): string {
  const ext = book.fileName.split(".").pop()?.toLowerCase() ?? "";
  return /pdf/i.test(book.fileType) || ext === "pdf" ? "READABLE" : "DOWNLOAD ONLY";
}
