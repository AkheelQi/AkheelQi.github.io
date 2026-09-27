import type { ErrorComponentProps } from "@tanstack/react-router";

const FALLBACK_MESSAGE = "An unexpected error occurred. Try reloading the page.";

function errorMessage(error: unknown): string {
  if (error instanceof Error && error.message) return error.message;
  if (typeof error === "string" && error) return error;
  return FALLBACK_MESSAGE;
}

export function AppErrorComponent({ error }: ErrorComponentProps) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-3 bg-ink px-6 text-center text-cream">
      <p className="font-display text-2xs tracking-[0.4em] text-gold">SYSTEM INTERRUPT</p>
      <h1 className="gold-foil font-display text-xl tracking-[0.16em]">Something went wrong</h1>
      <p className="max-w-md text-sm break-words text-muted">{errorMessage(error)}</p>
    </main>
  );
}
