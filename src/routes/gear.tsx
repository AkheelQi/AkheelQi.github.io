import { createFileRoute } from "@tanstack/react-router";
import { SiteShell, PageTitle } from "@/components/site-shell";

export const Route = createFileRoute("/gear")({ component: Gear });

function Gear() {
  return (
    <SiteShell>
      <PageTitle kicker="ON STAGE" title="GEAR" />
      <div className="pixel-panel mx-auto max-w-xl p-10 text-center">
        <p className="font-display text-3xl font-bold tracking-[0.08em] text-outline sm:text-4xl">
          GEARS &amp; MERCHS
        </p>
        <p className="mt-4 font-display text-xl tracking-[0.3em] text-[#8a6b16]">
          COMING SOON<span className="blink">▮</span>
        </p>
        <p className="mt-4 text-sm text-[#5c5647]">
          The merch table is being stocked. Check back later.
        </p>
      </div>
    </SiteShell>
  );
}