import { createFileRoute } from "@tanstack/react-router";
import { SiteShell, PageTitle } from "@/components/site-shell";
import { awards } from "@/data/site";
import { asset } from "@/lib/asset";

export const Route = createFileRoute("/fame")({ component: Fame });

function Fame() {
  return (
    <SiteShell>
      <PageTitle kicker="GOLD VINYL" title="HALL OF FAME" />
      <p className="mx-auto mb-10 max-w-2xl text-center text-sm text-muted">
        Responsible disclosure, not a victory lap. These are the plaques on the wall — NASA,
        EC-Council, LG, and the quieter rooms that still patched.
      </p>
      <ul className="grid gap-5 sm:grid-cols-2">
        {awards.map((a) => (
          <li key={a.title} className="flex flex-col border border-gold bg-ink-soft p-5">
            <p className="font-display text-2xs tracking-[0.3em] text-gold">{a.year}</p>
            <h3 className="mt-2 font-display text-lg tracking-[0.12em] text-gold-bright">{a.title}</h3>
            <p className="mt-2 min-h-12 text-sm text-cream">{a.detail}</p>
            {a.doc && (
              <a
                href={asset(a.doc.href)}
                target="_blank"
                rel="noreferrer"
                className="group mt-auto block border border-gold bg-white p-1.5 transition hover:border-gold-bright"
              >
                <span className="flex h-36 items-center justify-center overflow-hidden">
                  <img
                    src={asset(a.doc.thumb)}
                    alt={a.doc.alt}
                    loading="lazy"
                    className="h-full w-auto max-w-full object-contain"
                  />
                </span>
                <span className="mt-2 block text-center font-display text-2xs tracking-[0.25em] text-gold transition group-hover:text-gold-bright">
                  VIEW DOCUMENT
                </span>
              </a>
            )}
          </li>
        ))}
      </ul>
      <p className="mt-10 text-center text-xs tracking-[0.2em] text-muted">
        NO AUTOGRAPHS AT THE STAGE DOOR · SEND A WRITEUP INSTEAD
      </p>
    </SiteShell>
  );
}
