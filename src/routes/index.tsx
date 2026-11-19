import { createFileRoute, Link } from "@tanstack/react-router";
import { site } from "@/data/site";
import { MoodPopup } from "@/components/mood-popup";
import { MusicChip } from "@/components/music-chip";
import { DeskMonitor, PixelBird, PixelPerson, PixelTree } from "@/components/pixel-sprites";

export const Route = createFileRoute("/")({ component: Splash });

function LitWindow({ dark = false }: { dark?: boolean }) {
  return (
    <div
      className={`relative flex h-16 items-end justify-center border-2 border-outline sm:h-20 ${
        dark ? "bg-[#22304c]" : "bg-tan"
      }`}
    >
      {dark ? null : (
        <>
          <DeskMonitor className="absolute bottom-1 left-1 w-10 sm:w-12" />
          <PixelPerson sitting className="absolute bottom-0 right-1 w-6 sm:w-7" shirt="#5aa0e6" />
        </>
      )}
      <span className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-black/25" aria-hidden />
    </div>
  );
}

function Splash() {
  return (
    <main className="night-sky relative flex min-h-screen flex-col items-center overflow-hidden px-4 pb-16">
      {/* stars */}
      <div className="star-field absolute inset-0 opacity-80" style={{ backgroundColor: "transparent" }} aria-hidden />
      {/* moon */}
      <div
        className="absolute right-[10%] top-[8%] size-14 rounded-full bg-[#f3f0cf] sm:size-20"
        style={{ boxShadow: "0 0 40px 14px rgba(243,240,207,0.35)" }}
        aria-hidden
      />
      {/* ground + fence */}
      <div className="absolute inset-x-0 bottom-0 h-[24%] bg-[#0d1018]" aria-hidden />
      <div className="absolute inset-x-0 bottom-[22%] flex items-end justify-between px-2" aria-hidden>
        <div className="absolute inset-x-0 bottom-8 h-2 bg-[#3c4d6e]" />
        <div className="absolute inset-x-0 bottom-3 h-2 bg-[#22304c]" />
        {Array.from({ length: 14 }).map((_, i) => (
          <div key={i} className="relative h-14 w-3 bg-[#343b4c]" />
        ))}
      </div>
      {/* trees */}
      <PixelTree className="absolute bottom-[20%] left-[4%] w-14 sm:w-20" />
      <PixelTree className="absolute bottom-[19%] left-[13%] w-10 sm:w-14" />
      <PixelTree className="absolute bottom-[20%] right-[4%] w-14 sm:w-20" />
      <PixelTree className="absolute bottom-[19%] right-[13%] w-10 sm:w-14" />

      {/* top-right sound chip */}
      <div className="relative z-20 mt-4 flex w-full max-w-5xl justify-end">
        <MusicChip />
      </div>

      {/* the building */}
      <div className="relative z-10 mt-[4vh] w-[min(92vw,560px)]">
        <div className="border-3 border-outline bg-[#141414] px-4 py-3">
          <div className="flex items-center justify-between gap-3">
            <h1 className="font-display text-2xl font-bold tracking-[0.14em] text-cream sm:text-3xl">
              {site.shortName}
            </h1>
            <PixelBird className="w-10 shrink-0 sm:w-12" />
          </div>
          <p className="mt-1 font-display text-2xs tracking-[0.22em] text-muted">{site.motto}</p>
        </div>
        <div className="h-2 border-x-3 border-outline bg-amber" aria-hidden />
        <div className="space-y-2 border-x-3 border-outline bg-[#1c1c1c] p-2 sm:p-3">
          <div className="grid grid-cols-3 gap-2">
            <LitWindow />
            <LitWindow dark />
            <LitWindow />
          </div>
          <div className="h-2 bg-[#101018]" aria-hidden />
          <div className="grid grid-cols-3 gap-2">
            <LitWindow dark />
            <LitWindow />
            <LitWindow />
          </div>
          <div className="h-2 bg-[#101018]" aria-hidden />
          <div className="grid grid-cols-3 gap-2">
            <LitWindow />
            <LitWindow />
            <LitWindow dark />
          </div>
        </div>
        <div className="h-3 border-3 border-outline bg-[#101018]" aria-hidden />
      </div>

      {/* press start */}
      <div className="relative z-20 mt-8 flex flex-col items-center gap-3">
        <Link
          to="/home"
          className="bevel-start inline-flex min-h-12 items-center gap-3 px-8 text-lg font-semibold tracking-[0.12em] no-underline"
        >
          <span aria-hidden>▶</span> PRESS START
        </Link>
        <p className="border-2 border-outline bg-[#141414]/90 px-3 py-1 font-display text-xs tracking-[0.1em] text-[#d8d8d8]">
          Come on in — the scope is open.
        </p>
      </div>

      <p className="relative z-20 mt-6 max-w-md text-center text-sm text-cream">{site.tagline}</p>
      <p className="relative z-20 mt-2 max-w-lg text-center font-display text-2xs tracking-[0.2em] text-muted">
        PENTESTING · BUG HUNTING · SOC · DEVELOPMENT
      </p>
      <p className="relative z-20 mt-8 text-center font-display text-2xs tracking-[0.25em] text-muted">
        BEST VIEWED IN A NON-JUDGY WAY
      </p>
      <MoodPopup />
    </main>
  );
}