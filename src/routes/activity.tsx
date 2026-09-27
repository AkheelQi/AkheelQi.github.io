import { useEffect, useState } from "react";
import { Link, createFileRoute } from "@tanstack/react-router";
import { SiteShell } from "@/components/site-shell";
import { CrtOverlay } from "@/components/crt-overlay";
import { BootSequence } from "@/components/boot-sequence";
import { PowerButton } from "@/components/power-button";
import { MuteKnob } from "@/components/mute-knob";
import { ActivityFeed } from "@/components/activity-feed";
import { PowerGate } from "@/components/power-gate";
import { MoodPopup } from "@/components/mood-popup";
import { posts } from "@/data/site";
import { installRetroAudioUnlock } from "@/lib/retro-audio";

export const Route = createFileRoute("/activity")({ component: Activity });

function Activity() {
  const [hits, setHits] = useState("0000000");
  const [powered, setPowered] = useState(false);

  useEffect(() => {
    installRetroAudioUnlock();
    const key = "akheel-log-views";
    const next = Number(window.localStorage.getItem(key) || "0") + 1;
    window.localStorage.setItem(key, String(next));
    setHits(String(next).padStart(7, "0"));
  }, []);

  if (!powered) {
    return (
      <>
        <PowerGate
          onPowerOn={() => {
            window.scrollTo(0, 0);
            setPowered(true);
          }}
        />
        <MoodPopup />
      </>
    );
  }

  return (
    <>
      <SiteShell>
        <header className="text-center">
          <p className="font-display text-2xs tracking-[0.4em] text-gold">
            WELCOME, NETSURFER — YOU ARE INSIDE
          </p>
          <h2 className="crt-fringe mt-3 font-display text-3xl leading-tight font-bold tracking-[0.14em] text-gold-bright sm:text-4xl">
            AKHEEL'S ACTIVITY LOG
          </h2>
          <p className="mt-3">
            <span className="blink inline-block -rotate-2 border-2 border-ink bg-gold-bright px-2 py-0.5 font-display text-2xs font-bold tracking-[0.2em] text-ink shadow-[2px_2px_0_#000]">
              UNDER CONSTRUCTION
            </span>
          </p>
          <div className="mx-auto mt-6 max-w-xl border border-gold/60 bg-gold/10 px-4 py-2 text-center font-display text-xs tracking-[0.12em] text-gold">
            CHECK OUT MY <Link to="/bibliography">NEW PORTFOLIO HERE!</Link> — LATEST UPDATE:
            2026.09.25
          </div>
          <p className="mx-auto mt-6 max-w-2xl text-sm leading-relaxed text-muted">
            Posts, papers, videos and quotes — posted here first. Read one, like it, argue in the
            comments, share the link. Empty folders keep the lights on with placeholders until the
            next transmission. Drag windows by their title bars (desktop only), close them with ✕,
            bring everything back with SHOW ALL. The POWER button bottom-right kills the tube. The
            knob controls the beeps.
          </p>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-4">
            <div className="flex items-center gap-2 text-xs text-gold">
              <span className="tracking-[0.2em]">LOG VIEWS</span>
              <span className="flex" aria-label={`Log views ${Number(hits)}`}>
                {hits.split("").map((d, i) => (
                  <span
                    key={`${d}-${i}`}
                    className="inline-block min-w-4 border border-gold/40 bg-ink px-1 py-0.5 text-center font-display text-cream tabular-nums"
                  >
                    {d}
                  </span>
                ))}
              </span>
            </div>
            <MuteKnob />
          </div>
        </header>

        <ActivityFeed posts={posts} />
      </SiteShell>
      <CrtOverlay />
      <BootSequence />
      <PowerButton onPowerDown={() => setPowered(false)} />
    </>
  );
}
