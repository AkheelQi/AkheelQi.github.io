import { createFileRoute } from "@tanstack/react-router";
import { SiteShell, PageTitle } from "@/components/site-shell";
import { gear } from "@/data/site";

export const Route = createFileRoute("/gear")({ component: Gear });

function Gear() {
  return (
    <SiteShell>
      <PageTitle kicker="ON STAGE" title="GEAR" />
      <p className="mx-auto mb-10 max-w-2xl text-center text-sm text-muted">
        Lenny had a Les Paul. Akheel has Burp Suite, a terminal, and strong opinions about scope.
        Same energy. Worse merch.
      </p>
      <div className="grid gap-5 sm:grid-cols-2">
        {gear.map((g) => (
          <section key={g.group} className="border border-gold bg-ink-soft p-5">
            <h3 className="font-display text-sm tracking-[0.22em] text-gold">{g.group.toUpperCase()}</h3>
            <ul className="mt-3 flex flex-wrap gap-2">
              {g.items.map((item) => (
                <li
                  key={item}
                  className="border border-gold/50 px-2 py-1 text-xs tracking-wide text-cream"
                >
                  {item}
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </SiteShell>
  );
}
