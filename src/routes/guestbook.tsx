import { useEffect, useState, type FormEvent } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { SiteShell, PageTitle } from "@/components/site-shell";
import { addGuestbookNote, loadGuestbook, type GuestNote } from "@/lib/guestbook";

export const Route = createFileRoute("/guestbook")({ component: Guestbook });

function Guestbook() {
  const [notes, setNotes] = useState<GuestNote[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    setNotes(loadGuestbook());
  }, []);

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const name = String(fd.get("name") ?? "");
    const location = String(fd.get("location") ?? "");
    const message = String(fd.get("message") ?? "");
    if (message.trim().length < 4) {
      setError("The webmaster requires at least four characters of sincerity.");
      return;
    }
    setError("");
    addGuestbookNote({ name, location, message });
    setNotes(loadGuestbook());
    e.currentTarget.reset();
  }

  return (
    <SiteShell>
      <PageTitle kicker="" title="GUESTBOOK" />
      <p className="mx-auto mb-8 max-w-2xl text-center text-sm text-muted">
        A local, 1998-grade guestbook. Notes live in this browser. No server, no XSS prize, no
        NASA on the other end — unless you are NASA, in which case: hi.
      </p>

      <form onSubmit={onSubmit} className="mx-auto max-w-xl space-y-3 border border-gold bg-ink-soft p-5">
        <label className="block text-xs tracking-[0.2em] text-gold">
          NAME
          <input
            name="name"
            className="inset-field mt-1 min-h-11 w-full bg-ink px-3 text-sm text-cream"
            maxLength={40}
            autoComplete="nickname"
          />
        </label>
        <label className="block text-xs tracking-[0.2em] text-gold">
          LOCATION
          <input
            name="location"
            className="inset-field mt-1 min-h-11 w-full bg-ink px-3 text-sm text-cream"
            maxLength={40}
            placeholder="Calicut / 127.0.0.1"
          />
        </label>
        <label className="block text-xs tracking-[0.2em] text-gold">
          MESSAGE
          <textarea
            name="message"
            required
            rows={4}
            maxLength={280}
            className="inset-field mt-1 w-full bg-ink px-3 py-2 text-sm text-cream"
          />
        </label>
        {error ? <p className="text-sm text-oxblood">{error}</p> : null}
        <button type="submit" className="bevel min-h-11 px-6 font-display text-xs tracking-[0.25em]">
          SIGN THE BOOK
        </button>
      </form>

      <ol className="mx-auto mt-10 max-w-xl space-y-4">
        {notes.map((n) => (
          <li key={n.id} className="border border-gold/50 bg-ink-soft p-4">
            <p className="font-display text-sm tracking-[0.12em] text-gold-bright">
              {n.name}{" "}
              <span className="font-body text-xs tracking-normal text-muted">from {n.location}</span>
            </p>
            <p className="mt-2 text-sm">{n.message}</p>
            <p className="mt-2 text-2xs tracking-[0.15em] text-muted">
              {new Date(n.at).toLocaleDateString()}
            </p>
          </li>
        ))}
      </ol>
    </SiteShell>
  );
}
