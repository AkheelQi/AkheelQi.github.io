import { createFileRoute } from "@tanstack/react-router";
import { SiteShell, PageTitle } from "@/components/site-shell";
import { albums } from "@/data/site";
import { asset } from "@/lib/asset";

export const Route = createFileRoute("/bibliography")({ component: Discography });

function Discography() {
  return (
    <SiteShell>
      <PageTitle kicker="THE CATALOGUE" title="BIBLIOGRAPHY" />
      <p className="mx-auto mb-10 max-w-2xl text-center text-sm text-muted">
        Two Builds. One organism that hunts. One platform where disclosure programs run for real
        (play) money. Click a sleeve for the liner notes.
      </p>
      <div className="space-y-12">
        {albums.map((a, i) => {
          const meta = a as { note?: string; cta?: string };
          return (
            <article
              key={a.slug}
              className="grid items-start gap-6 border border-gold bg-ink-soft p-4 sm:grid-cols-[220px_1fr] sm:p-6"
            >
              <a href={a.href} target="_blank" rel="noreferrer" className="block">
                <div className="frame-gold p-1.5">
                  <img
                    src={asset(a.cover)}
                    alt={`${a.title} cover`}
                    className="aspect-square w-full bg-ink object-contain"
                  />
                </div>
              </a>
              <div>
                <p className="font-display text-2xs tracking-[0.3em] text-gold">
                  {String(i + 1).padStart(2, "0")} · {a.kind} · {a.year}
                </p>
                <h3 className="mt-1 font-display text-xl tracking-[0.14em] text-gold-bright">
                  {a.title}
                </h3>
                <p className="text-sm text-cream">{a.subtitle}</p>
                <p className="mt-3 text-sm leading-relaxed">{a.blurb}</p>
                {meta.note ? (
                  <p className="mt-2 font-display text-2xs tracking-[0.25em] text-gold">
                    {meta.note}
                  </p>
                ) : null}
                <ol className="mt-4 space-y-1 text-sm">
                  {a.tracks.map((t, n) => (
                    <li key={t} className="flex gap-3">
                      <span className="w-6 tabular-nums text-gold">{n + 1}.</span>
                      <span>{t}</span>
                    </li>
                  ))}
                </ol>
                <p className="mt-4 text-xs tracking-[0.12em] text-muted">MADE WITH · {a.stack}</p>
                <a
                  href={a.href}
                  target="_blank"
                  rel="noreferrer"
                  className="bevel mt-4 inline-flex min-h-11 items-center px-4 font-display text-xs tracking-[0.2em] no-underline"
                >
                  {meta.cta ?? "Explore"}
                </a>
              </div>
            </article>
          );
        })}
      </div>
    </SiteShell>
  );
}
