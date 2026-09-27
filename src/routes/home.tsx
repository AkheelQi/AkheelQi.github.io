import { createFileRoute } from "@tanstack/react-router";
import { SiteShell, PageTitle } from "@/components/site-shell";
import { WeeklyAiPulse } from "@/components/weekly-ai-pulse";
import { aiQuotes, news } from "@/data/site";

export const Route = createFileRoute("/home")({ component: Home });

function Home() {
  return (
    <SiteShell>
      <PageTitle kicker="" title="LET YOU KNOW!" />

      <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <section>
          <WeeklyAiPulse />
        </section>

        <section className="space-y-5">
          <article className="border border-gold bg-ink-soft p-5">
            <p className="font-display text-2xs tracking-[0.3em] text-gold">WISDOM OF THE MACHINE</p>
            <ul className="mt-3 space-y-3">
              {aiQuotes.map((q) => (
                <li key={q.text} className="border-t border-gold/20 pt-3 first:border-0 first:pt-0">
                  <blockquote className="text-sm leading-relaxed text-cream">“{q.text}”</blockquote>
                  <p className="mt-1.5 text-right font-display text-2xs tracking-[0.2em] text-muted">
                    — {q.source}
                  </p>
                </li>
              ))}
            </ul>
          </article>

          <article className="border border-gold bg-ink-soft p-5">
            <p className="font-display text-2xs tracking-[0.3em] text-gold">MY updates</p>
            <ul className="mt-3 space-y-3">
              {news.map((n) => (
                <li key={n.headline} className="border-t border-gold/20 pt-3 first:border-0 first:pt-0">
                  <p className="text-2xs tracking-[0.2em] text-muted">{n.date}</p>
                  <p className="text-sm text-cream">{n.headline}</p>
                  <p className="text-xs text-muted">{n.body}</p>
                </li>
              ))}
            </ul>
          </article>
        </section>
      </div>
    </SiteShell>
  );
}
