import { createFileRoute } from "@tanstack/react-router";
import { SiteShell, PageTitle } from "@/components/site-shell";
import { PixelPhoto } from "@/components/pixel-photo";
import { story, type StoryChapter } from "@/data/story";
import { asset } from "@/lib/asset";

export const Route = createFileRoute("/activity")({ component: Activity });

function ChapterPanel({ c }: { c: StoryChapter }) {
  return (
    <article className="pixel-panel p-5">
      <div className="flex flex-wrap items-center gap-2">
        <span className="pixel-plaque text-2xs tracking-[0.14em]">{c.year}</span>
        <span className="font-display text-2xs tracking-[0.3em] text-[#8a6b16]">{c.chapter}</span>
      </div>
      <h3 className="mt-3 font-display text-xl font-semibold tracking-[0.06em] text-outline">
        {c.title}
      </h3>
      <div className="mt-3 space-y-2">
        {c.body.map((p) => (
          <p key={p.slice(0, 24)} className="text-sm leading-relaxed text-[#3d3a30]">
            {p}
          </p>
        ))}
      </div>
      {c.artifacts?.length ? (
        <ul className="mt-4 flex flex-wrap gap-2">
          {c.artifacts.map((a) => (
            <li key={a} className="pixel-tag text-2xs">
              {a}
            </li>
          ))}
        </ul>
      ) : null}
    </article>
  );
}

function ChapterRow({ c, i }: { c: StoryChapter; i: number }) {
  const flip = i % 2 === 1;
  return (
    <li className="relative pl-12 md:grid md:grid-cols-2 md:gap-16 md:pl-0">
      {/* timeline node */}
      <span
        className="absolute left-[19px] top-8 z-10 inline-block size-5 -translate-x-1/2 rounded-full border-3 border-outline bg-gold-bright shadow-[2px_2px_0_#101018] md:left-1/2"
        aria-hidden
      />
      <div className={flip ? "md:order-2" : "md:order-1"}>
        <ChapterPanel c={c} />
      </div>
      {c.image ? (
        <figure className={`mt-4 md:mt-0 ${flip ? "md:order-1" : "md:order-2"}`}>
          <div className="frame-gold p-1.5">
            <PixelPhoto src={asset(c.image.src)} alt={c.image.alt} pixels={56} />
          </div>
          <figcaption className="mt-2 text-center font-display text-2xs tracking-[0.2em] text-muted">
            {c.image.alt.toUpperCase()}
          </figcaption>
        </figure>
      ) : null}
    </li>
  );
}

function Activity() {
  return (
    <SiteShell>
      <PageTitle kicker="THE ARCHIVES" title="LIFE STORY" />
      <p className="mx-auto mb-12 max-w-2xl text-center text-sm text-muted">
        An absurd being, documented — the whole campaign so far, chapter by chapter, in pixels.
        Scroll the timeline; the archives grow as the webmaster uploads them.
      </p>

      <div className="relative mx-auto max-w-5xl">
        {/* the spine */}
        <span
          className="absolute bottom-0 left-[19px] top-0 w-1 -translate-x-1/2 md:left-1/2"
          style={{
            background:
              "repeating-linear-gradient(180deg, var(--color-gold) 0 12px, transparent 12px 22px)",
          }}
          aria-hidden
        />
        <ol className="space-y-12 md:space-y-16">
          {story.map((c, i) => (
            <ChapterRow key={c.id} c={c} i={i} />
          ))}

          {/* to be continued */}
          <li className="relative pl-12 md:pl-0">
            <span
              className="absolute left-[19px] top-6 z-10 inline-block size-5 -translate-x-1/2 rounded-full border-3 border-outline bg-oxblood shadow-[2px_2px_0_#101018] md:left-1/2"
              aria-hidden
            />
            <div className="pixel-panel mx-auto max-w-xl p-5 text-center md:ml-[calc(50%+2rem)] md:mr-0 md:text-left">
              <p className="font-display text-lg font-semibold tracking-[0.1em] text-outline">
                TO BE CONTINUED<span className="blink">▮</span>
              </p>
              <p className="mt-2 text-sm text-[#3d3a30]">
                The full timeline is being digitized. New chapters land here as the webmaster
                uploads them — same pixels, more history.
              </p>
            </div>
          </li>
        </ol>
      </div>
    </SiteShell>
  );
}