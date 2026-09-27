import { seedGuestbook } from "@/data/site";

const KEY = "akheel-guestbook-v1";

export type GuestNote = {
  id: string;
  name: string;
  location: string;
  message: string;
  at: number;
};

export function loadGuestbook(): GuestNote[] {
  const seeds: GuestNote[] = seedGuestbook.map((s) => ({ ...s }));
  if (typeof window === "undefined") return seeds;
  try {
    const raw = window.localStorage.getItem(KEY);
    const extra: GuestNote[] = raw ? (JSON.parse(raw) as GuestNote[]) : [];
    return [...seeds, ...extra].sort((a, b) => b.at - a.at);
  } catch {
    return seeds;
  }
}

export function addGuestbookNote(input: {
  name: string;
  location: string;
  message: string;
}): GuestNote {
  const note: GuestNote = {
    id: crypto.randomUUID(),
    name: input.name.trim().slice(0, 40) || "anonymous",
    location: input.location.trim().slice(0, 40) || "somewhere",
    message: input.message.trim().slice(0, 280),
    at: Date.now(),
  };
  const raw = window.localStorage.getItem(KEY);
  const extra: GuestNote[] = raw ? (JSON.parse(raw) as GuestNote[]) : [];
  extra.push(note);
  window.localStorage.setItem(KEY, JSON.stringify(extra));
  return note;
}
