/**
 * THE LIFE STORY — chapter data for the /activity archive.
 * The webmaster's own timeline, in his words (lightly cleaned up).
 * Add/reorder freely; the page renders them in array order.
 * `image` is optional and pixelated on render (PixelPhoto) when present —
 * the timeline runs text-only for now.
 */

export type StoryChapter = {
  id: string;
  chapter: string;
  year: string;
  title: string;
  body: string[];
  image?: { src: string; alt: string };
  artifacts?: string[];
};

export const story: StoryChapter[] = [
  {
    id: "fighting-years",
    chapter: "CHAPTER I",
    year: "2019",
    title: "THE FIGHTING YEARS",
    body: [
      "Started a life fully engaged by boxing and martial arts — training all day, every day, for three years continuous.",
      "The training never stopped; it ran alongside the CS degree, round after round.",
    ],
    artifacts: ["Boxing", "Martial arts", "3 years of all-day training"],
  },
  {
    id: "medical-store",
    chapter: "CHAPTER II",
    year: "2022",
    title: "THE MEDICAL STORE",
    body: [
      "Worked part-time at a medical store and learned about thousands of medicines.",
      "Did self-research and writings along the way, as much as possible — the counter was the first lab bench.",
    ],
    artifacts: ["Part-time", "Thousands of medicines", "Self-research & writing"],
  },
  {
    id: "degree-archives",
    chapter: "CHAPTER III",
    year: "2023",
    title: "DEGREE & THE ARCHIVES",
    body: [
      "Completed the CS degree and started research on my own — self-study of history and science.",
      "Collected various science papers and historic notes: expedition stories on the Amazon rainforest and its surroundings, among them.",
    ],
    artifacts: ["CS degree", "History & science self-study", "Amazon expedition notes"],
  },
  {
    id: "the-switch",
    chapter: "CHAPTER IV",
    year: "2024",
    title: "THE SWITCH TO SECURITY",
    body: [
      "Moved my career completely into cybersecurity. Within months of learning, found vulnerabilities on NASA, EC-Council, LG, and the Government of UK.",
    ],
    artifacts: ["NASA", "EC-Council", "LG", "Government of UK"],
  },
  {
    id: "researcher-web3",
    chapter: "CHAPTER V",
    year: "2025",
    title: "RESEARCHER & WEB3",
    body: [
      "Worked as a security researcher.",
      "Also spent time on crypto and Web3 — new surfaces, new tricks.",
    ],
    artifacts: ["Security research", "Crypto", "Web3"],
  },
  {
    id: "trainer-automation",
    chapter: "CHAPTER VI",
    year: "2026",
    title: "TRAINER & AUTOMATION",
    body: [
      "Worked as a trainer again.",
      "Currently focusing on deeper security automation projects — automation on both defence and offence — and actively participating in security bounty programs around the internet.",
    ],
    artifacts: ["Training", "Defence + offence automation", "Bug bounty programs"],
  },
];