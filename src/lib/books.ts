/* Personal shelf — books the owner donates from the browser.
   Files live in IndexedDB (localStorage's ~5 MB quota cannot hold PDFs),
   same local-first spirit as the guestbook: no server, no accounts. */

const DB_NAME = "akheel-shelf-v1";
const STORE = "books";
const MAX_BYTES = 100 * 1024 * 1024;

export type ShelfBook = {
  id: string;
  title: string;
  author: string;
  year: string;
  notes: string;
  fileName: string;
  fileType: string;
  size: number;
  addedAt: number;
  blob: Blob;
  /** JPEG data-URL of page 1, rendered when a PDF is shelved. */
  cover?: string;
};

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => {
      if (!req.result.objectStoreNames.contains(STORE)) {
        req.result.createObjectStore(STORE, { keyPath: "id" });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

function txDone(tx: IDBTransaction): Promise<void> {
  return new Promise((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
    tx.onabort = () => reject(tx.error);
  });
}

function mimeFor(name: string): string {
  const ext = name.split(".").pop()?.toLowerCase() ?? "";
  const map: Record<string, string> = {
    pdf: "application/pdf",
    epub: "application/epub+zip",
    mobi: "application/x-mobipocket-ebook",
    azw3: "application/vnd.amazon.ebook",
    fb2: "application/fb2+xml",
    zip: "application/zip",
    txt: "text/plain",
  };
  return map[ext] ?? "application/octet-stream";
}

export function fileKind(book: Pick<ShelfBook, "fileName" | "fileType">): string {
  const ext = book.fileName.split(".").pop()?.toLowerCase() ?? "";
  if (/pdf/i.test(book.fileType) || ext === "pdf") return "PDF";
  if (/epub/i.test(book.fileType) || ext === "epub") return "EPUB";
  if (ext) return ext.toUpperCase().slice(0, 6);
  return "FILE";
}

export function isReadable(book: Pick<ShelfBook, "fileName" | "fileType">): boolean {
  const ext = book.fileName.split(".").pop()?.toLowerCase() ?? "";
  return /pdf/i.test(book.fileType) || ext === "pdf";
}

/** pdf.js, loaded lazily on the client only (worker via Vite ?url). */
export async function loadPdfjs() {
  const pdfjs = await import("pdfjs-dist");
  const worker = await import("pdfjs-dist/build/pdf.worker.min.mjs?url");
  pdfjs.GlobalWorkerOptions.workerSrc = worker.default;
  return pdfjs;
}

/** Render page 1 of a PDF to a small JPEG data-URL (the shelf cover). */
async function makeCover(file: File): Promise<string | undefined> {
  try {
    const pdfjs = await loadPdfjs();
    const task = pdfjs.getDocument({ data: await file.arrayBuffer() });
    const doc = await task.promise;
    const page = await doc.getPage(1);
    const base = page.getViewport({ scale: 1 });
    const scale = Math.min(380 / base.width, 540 / base.height);
    const viewport = page.getViewport({ scale });
    const canvas = document.createElement("canvas");
    canvas.width = Math.ceil(viewport.width);
    canvas.height = Math.ceil(viewport.height);
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      await task.destroy();
      return undefined;
    }
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    await page.render({ canvas, viewport }).promise;
    const cover = canvas.toDataURL("image/jpeg", 0.78);
    await task.destroy();
    return cover;
  } catch {
    return undefined;
  }
}

export function downloadBook(book: ShelfBook): void {
  const url = URL.createObjectURL(book.blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = book.fileName || "book";
  document.body.appendChild(a);
  a.click();
  a.remove();
  revokeUrl(url);
}

export function formatSize(bytes: number): string {
  if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  if (bytes >= 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${bytes} B`;
}

export async function listBooks(): Promise<ShelfBook[]> {
  const db = await openDb();
  const req = db.transaction(STORE, "readonly").objectStore(STORE).getAll();
  const rows = await new Promise<ShelfBook[]>((resolve, reject) => {
    req.onsuccess = () => resolve(req.result as ShelfBook[]);
    req.onerror = () => reject(req.error);
  });
  return rows.sort((a, b) => b.addedAt - a.addedAt);
}

export async function addBook(input: {
  title: string;
  author: string;
  year: string;
  notes: string;
  file: File;
}): Promise<ShelfBook> {
  if (input.file.size > MAX_BYTES) {
    throw new Error("file-too-large");
  }
  const book: ShelfBook = {
    id: crypto.randomUUID(),
    title: input.title.trim().slice(0, 120) || "Untitled",
    author: input.author.trim().slice(0, 80) || "Unknown",
    year: input.year.trim().slice(0, 16),
    notes: input.notes.trim().slice(0, 600),
    fileName: input.file.name.slice(0, 160),
    fileType: input.file.type || mimeFor(input.file.name),
    size: input.file.size,
    addedAt: Date.now(),
    blob: input.file,
  };
  if (isReadable(book)) {
    const cover = await makeCover(input.file);
    if (cover) book.cover = cover;
  }
  const db = await openDb();
  const tx = db.transaction(STORE, "readwrite");
  tx.objectStore(STORE).put(book);
  await txDone(tx);
  return book;
}

export async function deleteBook(id: string): Promise<void> {
  const db = await openDb();
  const tx = db.transaction(STORE, "readwrite");
  tx.objectStore(STORE).delete(id);
  await txDone(tx);
}

export function bookUrl(book: ShelfBook): string {
  return URL.createObjectURL(book.blob);
}

export function revokeUrl(url: string): void {
  window.setTimeout(() => URL.revokeObjectURL(url), 30_000);
}
