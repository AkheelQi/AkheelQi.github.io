import { useCallback, useEffect, useRef, useState } from "react";
import type { PDFDocumentProxy } from "pdfjs-dist";
import { bookUrl, downloadBook, fileKind, formatSize, isReadable, type ShelfBook } from "@/lib/books";

type Pdfjs = Awaited<ReturnType<typeof import("@/lib/books").loadPdfjs>>;

/** Fullscreen reader — opens on the cover (page 1); page with buttons or swipe. */
export function BookReader({ book, onClose }: { book: ShelfBook; onClose: () => void }) {
  const [numPages, setNumPages] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(isReadable(book));
  const [failed, setFailed] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const docRef = useRef<PDFDocumentProxy | null>(null);
  const taskRef = useRef<{ destroy(): Promise<void> } | null>(null);
  const touchX = useRef<number | null>(null);

  const readable = isReadable(book);

  const next = useCallback(() => setPage((p) => Math.min(p + 1, numPages || p)), [numPages]);
  const prev = useCallback(() => setPage((p) => Math.max(p - 1, 1)), []);

  /* load the document */
  useEffect(() => {
    if (!readable) return;
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const pdfjs: Pdfjs = await import("@/lib/books").then((m) => m.loadPdfjs());
        const url = bookUrl(book);
        const task = pdfjs.getDocument({ url });
        taskRef.current = task;
        const doc = await task.promise;
        if (cancelled) {
          await task.destroy();
          taskRef.current = null;
          return;
        }
        docRef.current = doc;
        setNumPages(doc.numPages);
        setPage(1);
        setFailed(false);
      } catch {
        if (!cancelled) setFailed(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
      docRef.current = null;
      void taskRef.current?.destroy();
      taskRef.current = null;
    };
  }, [book, readable]);

  /* render the current page */
  useEffect(() => {
    const doc = docRef.current;
    const canvas = canvasRef.current;
    if (!doc || !canvas || page < 1) return;
    let cancelled = false;
    let task: { cancel(): void; promise: Promise<void> } | null = null;
    (async () => {
      const pdfPage = await doc.getPage(page);
      if (cancelled) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const base = pdfPage.getViewport({ scale: 1 });
      const avail = Math.min(window.innerWidth - 40, 820);
      const availH = window.innerHeight - 190;
      const scale = Math.min(avail / base.width, availH / base.height) * dpr;
      const viewport = pdfPage.getViewport({ scale });
      canvas.width = Math.floor(viewport.width);
      canvas.height = Math.floor(viewport.height);
      canvas.style.width = `${Math.floor(viewport.width / dpr)}px`;
      canvas.style.height = `${Math.floor(viewport.height / dpr)}px`;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.fillStyle = "#fff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      task = pdfPage.render({ canvas, viewport });
      try {
        await task.promise;
      } catch {
        /* cancelled render */
      }
    })();
    return () => {
      cancelled = true;
      task?.cancel();
    };
  }, [page, numPages, loading]);

  /* keyboard + scroll lock */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [next, prev, onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Reading ${book.title}`}
      className="fixed inset-0 z-50 flex flex-col bg-[#0a0a0a]"
    >
      <header className="flex items-center gap-3 border-b border-gold/50 bg-ink px-4 py-3">
        <div className="min-w-0 flex-1">
          <p className="truncate font-display text-sm tracking-[0.14em] text-gold-bright">
            {book.title}
          </p>
          <p className="truncate text-2xs tracking-[0.12em] text-muted">
            {book.author}
            {book.year ? ` · ${book.year}` : ""} · {fileKind(book)} · {formatSize(book.size)}
          </p>
        </div>
        <button
          type="button"
          onClick={() => downloadBook(book)}
          className="bevel min-h-10 shrink-0 px-3 font-display text-2xs tracking-[0.2em]"
        >
          DOWNLOAD
        </button>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close reader"
          className="min-h-10 shrink-0 border border-gold px-3 font-display text-2xs tracking-[0.2em] text-gold-bright hover:bg-gold hover:text-ink"
        >
          ✕ CLOSE
        </button>
      </header>

      <div
        className="flex min-h-0 flex-1 items-center justify-center overflow-hidden px-2 py-3"
        onTouchStart={(e) => {
          touchX.current = e.touches[0].clientX;
        }}
        onTouchEnd={(e) => {
          if (touchX.current == null) return;
          const dx = e.changedTouches[0].clientX - touchX.current;
          touchX.current = null;
          if (Math.abs(dx) < 44) return;
          if (dx < 0) next();
          else prev();
        }}
      >
        {!readable || failed ? (
          <div className="mx-auto max-w-md border border-gold bg-ink-soft p-8 text-center">
            {book.cover ? (
              <img
                src={book.cover}
                alt=""
                className="mx-auto mb-4 max-h-64 border border-gold/60"
              />
            ) : (
              <p className="font-display text-3xl tracking-[0.2em] text-gold-bright">◆</p>
            )}
            <p className="font-display text-lg tracking-[0.16em] text-gold-bright">{book.title}</p>
            <p className="mt-1 text-sm text-cream">{book.author}</p>
            <p className="mt-4 text-sm text-muted">
              {failed
                ? "This PDF refused to open in the shelf reader."
                : `${fileKind(book)} files can't be paged in-browser — take the file and read it offline.`}
            </p>
            <button
              type="button"
              onClick={() => downloadBook(book)}
              className="bevel mt-5 min-h-11 px-6 font-display text-xs tracking-[0.25em]"
            >
              DOWNLOAD {fileKind(book)}
            </button>
          </div>
        ) : loading ? (
          book.cover ? (
            <img
              src={book.cover}
              alt="Cover"
              className="max-h-full border border-gold/40 shadow-[0_0_60px_rgba(201,162,39,0.15)]"
            />
          ) : (
            <p className="font-display text-sm tracking-[0.3em] text-gold">UNVEILING THE COVER…</p>
          )
        ) : (
          <canvas
            ref={canvasRef}
            className="max-h-full border border-gold/40 shadow-[0_0_60px_rgba(201,162,39,0.12)]"
          />
        )}
      </div>

      {readable && !failed && !loading && numPages > 0 ? (
        <footer className="flex items-center justify-center gap-4 border-t border-gold/50 bg-ink px-4 py-3">
          <button
            type="button"
            onClick={prev}
            disabled={page <= 1}
            className="bevel min-h-11 px-5 font-display text-xs tracking-[0.2em] disabled:opacity-40"
          >
            ‹ PREV
          </button>
          <p className="min-w-24 text-center font-display text-sm tabular-nums tracking-[0.15em] text-gold-bright">
            {page} / {numPages}
          </p>
          <button
            type="button"
            onClick={next}
            disabled={page >= numPages}
            className="bevel min-h-11 px-5 font-display text-xs tracking-[0.2em] disabled:opacity-40"
          >
            NEXT ›
          </button>
        </footer>
      ) : (
        <div className="border-t border-gold/40 bg-ink px-4 py-2 text-center">
          <p className="text-2xs tracking-[0.2em] text-muted">ESC TO LEAVE · ARROWS / SWIPE TO PAGE</p>
        </div>
      )}
    </div>
  );
}
