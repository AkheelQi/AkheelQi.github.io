/**
 * THE LIFE STORY — chapter data for the /activity archive.
 *
 * Each chapter is one era of the timeline. Add/reorder freely; the page
 * renders them in array order as a pixelated historical timeline.
 * `image` is pixelated on render (PixelPhoto), so any photo works.
 *
 * NOTE: these seed chapters are drawn from the existing bio. The webmaster
 * is uploading the full detailed timeline — replace/extend as it arrives.
 */

export type StoryChapter = {
  id: string;
  chapter: string; // roman numeral / era label
  year: string;
  title: string;
  body: string[];
  image?: { src: string; alt: string };
  artifacts?: string[];
};

export const story: StoryChapter[] = [
  {
    id: "origins",
    chapter: "CHAPTER I",
    year: "THE BEGINNING",
    title: "MALABAR ORIGINS",
    body: [
      "Every story starts somewhere. This one starts on the Malabar coast, Kerala — where an absurd being first logged on.",
      "Curiosity shipped early: take things apart, see how the tricks work, put them back together slightly different.",
    ],
    image: { src: "/art/bio.png", alt: "The webmaster, early archives" },
    artifacts: ["Kerala, India", "self-certified philosopher"],
  },
  {
    id: "calicut",
    chapter: "CHAPTER II",
    year: "2019 – 2022",
    title: "THE CALICUT YEARS",
    body: [
      "Bachelor of Computer Science at the University of Calicut. The formal patch of the story.",
      "Somewhere between lectures and labs, the security rabbit hole opened — and never closed. CICSA certification followed: Certified IT Infrastructure and Cyber SOC Analyst.",
    ],
    image: { src: "/art/portrait-monitors.jpg", alt: "At a wall of monitors" },
    artifacts: ["B.Sc Computer Science", "CICSA"],
  },
  {
    id: "disclosures",
    chapter: "CHAPTER III",
    year: "2024",
    title: "THE QUIET WORK GETS LOUD",
    body: [
      "Responsible disclosure season. EC-Council puts the webmaster in the Hall of Fame. NASA, via Bugcrowd, takes high-impact web findings. LG Electronics sends thanks for a critical application bug.",
      "Yahoo and DeHaat patch in the same season. Quiet reports, loud fixes, no press tour.",
    ],
    image: { src: "/art/portrait-leather.jpg", alt: "Leather jacket beside a glowing CRT" },
    artifacts: ["EC-Council HOF", "NASA VDP", "LG LOA", "Yahoo · DeHaat"],
  },
  {
    id: "teaching",
    chapter: "CHAPTER IV",
    year: "THE SIDE QUESTS",
    title: "TEACHING THE TRICKS",
    body: [
      "The through-line: map the surface, respect the scope, keep a human in the loop, file evidence a tired triager can actually use.",
      "Offenso Hackers Academy and Red Team Hacker Academy both put the webmaster on the bill — teaching people how the tricks actually work.",
    ],
    image: { src: "/art/portrait-studio.jpg", alt: "Studio still, gold light" },
    artifacts: ["Offenso Hackers Academy", "Red Team Hacker Academy"],
  },
  {
    id: "builds",
    chapter: "CHAPTER V",
    year: "2026",
    title: "BUILDING THE TOOLS",
    body: [
      "DEMOGORGON ships: an autonomous, scope-aware, human-overridable bug bounty research agent. The tools he wished he had at 2 a.m. now exist.",
      "The official site goes live. TEEMS and CloudBridge join the board. The archive you are reading is the next chapter.",
    ],
    image: { src: "/art/Demogorgon.png", alt: "DEMOGORGON cover art" },
    artifacts: ["DEMOGORGON", "TEEMS", "CloudBridge", "this site"],
  },
];