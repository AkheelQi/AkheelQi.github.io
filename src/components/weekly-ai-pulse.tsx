import { useEffect, useState } from "react";

type AiStory = {
  title: string;
  summary: string;
  source_url: string;
  image_url: string;
  date: string;
};

const pollinationsFallback = (title: string) =>
  `https://image.pollinations.ai/prompt/${encodeURIComponent(
    `${title}, dramatic retro gold and black editorial collage, grainy`,
  )}?width=600&height=800&nologo=true`;

function SkeletonCard() {
  return (
    <figure className="frame-gold p-1.5">
      <div className="flex aspect-portrait items-center justify-center bg-ink">
        <p className="animate-pulse px-3 text-center font-display text-2xs tracking-[0.25em] text-muted">
          TUNING THE SIGNAL…
        </p>
      </div>
      <figcaption className="bg-ink px-2 py-1.5 text-center text-xs text-gold">—</figcaption>
    </figure>
  );
}

export function WeeklyAiPulse() {
  const [stories, setStories] = useState<AiStory[] | null>(null);
  const [failed, setFailed] = useState(false);
  const [open, setOpen] = useState<number | null>(null);
  const [broken, setBroken] = useState<Record<string, 1 | 2>>({});

  useEffect(() => {
    let alive = true;
    fetch(`${import.meta.env.BASE_URL}data/ai-news.json`, { cache: "no-store" })
      .then((r) => {
        if (!r.ok) throw new Error(String(r.status));
        return r.json();
      })
      .then((data: unknown) => {
        if (!alive) return;
        if (Array.isArray(data)) setStories(data.slice(0, 4) as AiStory[]);
        else setFailed(true);
      })
      .catch(() => {
        if (alive) setFailed(true);
      });
    return () => {
      alive = false;
    };
  }, []);

  const onImgError = (s: AiStory) => {
    setBroken((b) => {
      const state = b[s.source_url];
      if (state === 2) return b;
      return { ...b, [s.source_url]: state === 1 ? 2 : 1 };
    });
  };

  const imgSrc = (s: AiStory) =>
    broken[s.source_url] === 1 && s.image_url !== pollinationsFallback(s.title)
      ? pollinationsFallback(s.title)
      : s.image_url;

  return (
    <section aria-label="Weekly AI Pulse">
      <header className="mb-4 text-center">
        <p className="font-display text-2xs tracking-[0.3em] text-gold">WEEKLY AI PULSE</p>
        <p className="mt-1 text-xs text-muted">THE FOUR THAT BROKE BRAINS THIS MONDAY</p>
      </header>

      <div className="grid grid-cols-2 gap-4 sm:gap-6">
        {failed ? (
          <figure className="frame-gold col-span-2 p-1.5">
            <div className="flex aspect-video items-center justify-center bg-ink px-4">
              <p className="text-center font-display text-xs tracking-[0.2em] text-gold">
                SIGNAL LOST — NO DISPATCH ON FILE. CHECK BACK MONDAY.
              </p>
            </div>
          </figure>
        ) : !stories ? (
          <>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </>
        ) : stories.length === 0 ? (
          <figure className="frame-gold col-span-2 p-1.5">
            <div className="flex aspect-video items-center justify-center bg-ink px-4">
              <p className="text-center font-display text-xs tracking-[0.2em] text-gold">
                THE AIRWAVES ARE QUIET — NO DISPATCH THIS WEEK.
              </p>
            </div>
          </figure>
        ) : (
          stories.map((s, i) => (
            <figure
              key={s.source_url + i}
              className={`ai-card-frame frame-gold p-1.5 ${open === i ? "is-open" : ""}`}
              onClick={() => setOpen(open === i ? null : i)}
            >
              <div className="relative aspect-portrait overflow-hidden bg-ink">
                {broken[s.source_url] === 2 ? (
                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-ink via-ink-soft to-gold/20">
                    <span className="font-display text-2xs tracking-[0.3em] text-gold">NO IMAGE</span>
                  </div>
                ) : (
                  <img
                    src={imgSrc(s)}
                    alt={s.title}
                    loading="lazy"
                    className="ai-card-image"
                    onError={() => onImgError(s)}
                  />
                )}
                <div className="ai-card-overlay">
                  <p className="line-clamp-6 text-2xs leading-relaxed text-cream">{s.summary}</p>
                  <a
                    href={s.source_url}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-1 self-start border border-gold bg-gold/10 px-2 py-1 font-display text-2xs tracking-[0.2em] text-gold-bright no-underline hover:bg-gold/25"
                    onClick={(e) => e.stopPropagation()}
                  >
                    READ DISPATCH →
                  </a>
                </div>
              </div>
              <figcaption className="bg-ink px-2 py-1.5 text-center">
                <span className="line-clamp-2 block text-xs text-gold">{s.title}</span>
                <span className="mt-0.5 block font-display text-2xs tracking-[0.2em] text-muted">
                  {s.date}
                </span>
              </figcaption>
            </figure>
          ))
        )}
      </div>
    </section>
  );
}
