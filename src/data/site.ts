export const site = {
  name: "Muhammed Akheel L C",
  shortName: "AKHEEL",
  title: "Cybersecurity Researcher",
  motto: "Build/Hack/Secure and Automate!",
  tagline: "An absurd being.",
  location: "Kerala, India",
  email: "muhammedakheelqi@gmail.com",
  phone: "+91 8281545181",
  linkedin: "https://linkedin.com/in/muakheel",
  github: "https://github.com/akheeltester",
  githubHandle: "akheeltester",
  summary:
    "Pentesting, vulnerability research, bug bounty, and SOC operations — with a taste for automation, SIEM, and teaching people how the tricks actually work. Responsible disclosures to NASA, EC-Council, Yahoo, DeHaat and more.",
} as const;

export const nav = [
  { to: "/home", label: "HOME" },
  { to: "/bio", label: "BIO" },
  { to: "/bibliography", label: "BIBLIOGRAPHY" },
  { to: "/fame", label: "HALL OF FAME" },
  { to: "/activity", label: "ACTIVITY" },
  { to: "/gear", label: "GEAR" },
  { to: "/guestbook", label: "GUESTBOOK", badge: "NEW" },
  { to: "/contact", label: "CONTACT" },
] as const;

export const portraits = [
  {
    src: "/art/portrait-studio.jpg",
    alt: "Studio still — gold light, white shirt, velvet waistcoat",
    caption: "Studio still, '26",
    rotate: -2.4,
  },
  {
    src: "/art/portrait-leather.jpg",
    alt: "Leather jacket beside a glowing CRT",
    caption: "Backstage / CRT",
    rotate: 1.8,
  },
  {
    src: "/art/portrait-monitors.jpg",
    alt: "At a wall of monitors",
    caption: "Command center",
    rotate: -1.2,
  },
  {
    src: "/art/still-glasses.jpg",
    alt: "Glasses reflecting a gold star",
    caption: "Detail",
    rotate: 3.1,
  },
] as const;

export const albums = [
  {
    slug: "demogorgon",
    title: "DEMOGORGON",
    year: "2026",
    kind: "LP",
    cover: "/art/Demogorgon.png",
    subtitle: "Autonomous Bug Bounty Research Agent",
    href: "https://github.com/akheeltester/Demogorgon",
    blurb:
      "An LLM-driven, scope-aware hunting organism with human-in-the-loop brakes. It reads program policy, maps the attack surface, hypothesizes, executes only through a safety gateway, then writes the report like a grown-up.",
    tracks: [
      "Scope Parser (HackerOne / Bugcrowd mix)",
      "Laya — Dual-Model Decision Engine",
      "ActionGateway (HITL)",
      "Subdomain Rhapsody",
      "Attack-Surface Mapping",
      "Deterministic Executors (SSRF, IDOR, Upload…)",
      "Bug-Chain Detection",
      "CVSS 3.1 + PoC Reprise",
    ],
    stack: "Python",
  },
  {
    slug: "training",
    title: "Exploit & Fix",
    year: "2026",
    kind: "LP",
    cover: "/art/bb-platform.png",
    subtitle: "Bug Bounty & Cybersecurity Training Platform",
    href: "https://github.com/akheeltester/Bug_Bounty-platform",
    blurb:
      "A full-stack lab where organizations run disclosure programs and researchers file reports for real (play) money. JWT at the door, FastAPI in the booth, React on the floor.",
    tracks: [
      "JWT",
      "Program Board (severity-priced)",
      "PoC Upload",
      "Admin Review",
      "Leaderboard",
      "105-assertion E2E encore",
    ],
    stack: "FastAPI, MongoDB, JWT, React, Tailwind, Docker",
  },
 /*  {
    slug: "soc",
    title: "After Dark",
    year: "2026",
    kind: "EP",
    cover: "/art/album-soc.jpg",
    subtitle: "Enterprise-Grade SOC & Threat Monitoring Lab",
    href: "https://github.com/akheeltester",
    blurb:
      "A homegrown SOC: Wazuh for the hunt, Splunk for the story, pfSense for the walls. Threat monitoring, log analysis, detection, and network segmentation — Currently Down.",
    tracks: [
      "Wazuh Sunrise",
      "Splunk After Dark",
      "pfSense Interlude",
      "VLAN / VPN Segmentation",
      "Incident Response Reprise",
    ],
    stack: "Wazuh, Splunk, pfSense, Docker",
  },
  {
    slug: "idam",
    title: "IDAM",
    year: "2026",
    kind: "APP",
    cover: "/art/IDAM.png",
    subtitle: "Kerala Real Estate Platform",
    href: "https://kerala-re-l14fnc95u-idam6.vercel.app/",
    blurb:
      "A modern real estate discovery and listing platform built for Kerala. Connect property owners, agents, and builders with buyers and renters across all 14 districts.",
    note: "IDAM License",
    tracks: [
      "Buy — Houses, apartments, villas for sale",
      "Rent — Residential and commercial rentals",
      "Lease — Long-term commercial leases",
      "Plots & Land — Land parcels with PostGIS spatial queries",
      "PG / Hostel — Paying guest accommodations with bed management, availability calendar, and room pricing",
      ],
    sections: [
      {
        heading: "PROPERTY CATEGORIES",
        items: [
          "Residential — Apartment, Independent House, Villa, Room",
          "Commercial — Shop, Office, Warehouse",
          "Land — Plot, Land parcel",
          "Hostel — PG, Hostel, Co-living",
        ],
      },
      {
        heading: "AUTHENTICATION (PASSWORDLESS)",
        items: [
          "Phone OTP — 6-digit SMS verification (Twilio / console fallback)",
          "WhatsApp OTP — WhatsApp Cloud API delivery",
          "Email Magic Link — HMAC-signed, single-use, 10-minute expiry",
          "Google OAuth 2.0 — Social login via Passport.js",
        ],
      },
      {
        heading: "MAP & SEARCH",
        items: [
          "Interactive Map — MapLibre GL JS with CartoDB Positron vector tiles",
          "Kerala State Boundary — 14-district GeoJSON outline on the map",
          "Category-Specific Pins — Color-coded icons for each property type",
          "Draw-to-Search — Polygon search on the map",
          "Full-Text Search — OpenSearch-powered with autocomplete suggestions",
          "Geo-Bounding Box — Map viewport filtering",
        ],
      },
      {
        heading: "USER FEATURES",
        items: [
          "Favorites/Save — Save properties to a wishlist",
          "Enquiries — Contact property owners directly",
          "Site Visits — Schedule and manage property visits",
          "Profile Management — Edit name, email, role, RERA ID",
          "My Listings Dashboard — Manage your own properties",
        ],
      },
      {
        heading: "AGENT & BUILDER SYSTEM",
        items: [
          "Agent Registration — RERA ID verification",
          "Builder Accounts — Project and plot management",
          "Admin Moderation — RERA verify listings, verify agents",
        ],
      },
      {
        heading: "LEGAL PAGES",
        items: [
          "About — Platform overview and positioning",
          "Terms & Conditions — 32-section comprehensive legal draft",
          "Privacy Policy — 20-section policy based on actual data practices",
        ],
      },
      {
        heading: "TECH · FRONTEND",
        items: [
          "Next.js 14 — React framework (App Router)",
          "React 18 — UI library",
          "TypeScript — Type safety",
          "Tailwind CSS — Utility-first styling",
          "MapLibre GL JS — Interactive maps (vector tiles)",
        ],
      },
      {
        heading: "TECH · BACKEND",
        items: [
          "NestJS — Node.js framework (TypeORM + Modules)",
          "TypeORM — ORM with auto-sync in development",
          "Passport.js — Authentication (JWT + Google OAuth)",
          "JWT — Access tokens (15min) + Refresh tokens (7d)",
        ],
      },
      {
        heading: "TECH · DATABASE & SEARCH",
        items: [
          "PostgreSQL 16 — Primary database",
          "PostGIS — Spatial queries, map geometry",
          "Redis — OTP storage, rate limiting, sessions, caching",
          "OpenSearch — Full-text search, autocomplete, geo queries",
        ],
      },
      {
        heading: "TECH · STORAGE & SERVICES",
        items: [
          "MinIO — S3-compatible object storage (property photos)",
          "Twilio — SMS OTP delivery",
          "WhatsApp Cloud API — WhatsApp OTP delivery",
          "Google OAuth — Social authentication",
          "nodemailer — Email magic links (console in dev)",
        ],
      },
      {
        heading: "TECH · INFRASTRUCTURE",
        items: [
          "Turborepo — Monorepo build system",
          "Docker — PostgreSQL, Redis, OpenSearch, MinIO containers",
          "Vite / Webpack — Bundling (via Next.js / NestJS CLI)",
        ],
      },
    ],
    stack:
      "Next.js 14, React 18, TypeScript, Tailwind CSS, NestJS, TypeORM, Passport.js, PostgreSQL 16 + PostGIS, Redis, OpenSearch, MinIO, Twilio, WhatsApp Cloud API, Docker, Turborepo",
    cta: "Explore",
    },*/
] as const;

export const awards = [
  {
    year: "2024",
    title: "EC-Council Hall of Fame",
    detail: "Responsible disclosure of critical vulnerabilities.",
    doc: {
      href: "/art/EC-Council Bug bounty Certificate.pdf",
      thumb: "/art/thumb-ec-council.png",
      alt: "EC-Council certificate of appreciation",
    },
  },
  {
    year: "2024",
    title: "NASA — via Bugcrowd",
    detail: "High-impact web vulnerabilities, reported clean.",
    doc: {
      href: "/art/VDP20of20-20.pdf",
      thumb: "/art/thumb-nasa-vdp.png",
      alt: "NASA Vulnerability Disclosure Program letter of appreciation",
    },
  },
  {
    year: "2025",
    title: "LG Electronics",
    detail: "Appreciation for a critical web application finding.",
    doc: {
      href: "/art/LG-LOA.png",
      thumb: "/art/thumb-lg.png",
      alt: "LG Electronics letter of appreciation",
    },
  },
  {
    year: "2026",
    title: "Yahoo, DeHaat & more",
    detail: "Quiet reports. Loud fixes. No press tour required.",
    doc: null,
  },
] as const;

export type PostKind = "blog" | "paper" | "video" | "quote";

export type ActivityPost = {
  id: string;
  kind: PostKind;
  title: string;
  date: string;
  excerpt?: string;
  body?: string[];
  quote?: string;
  by?: string;
  href?: string;
  linkLabel?: string;
  thumb?: string;
  video?: string;
  likes?: number;
};

export const postKindLabels: Record<PostKind, string> = {
  blog: "BLOG",
  paper: "PAPER",
  video: "VIDEO",
  quote: "QUOTE",
};

export const postKindFiles: Record<PostKind, string> = {
  blog: "BLOG.TXT",
  paper: "PAPER.PDF",
  video: "VIDEO.MPG",
  quote: "QUOTE.NFO",
};

/**
 * Publish a post by adding an entry to this array — it appears on the
 * ACTIVITY page instantly. Examples you can copy:
 *
 * {
 *   id: "first-post",
 *   kind: "blog",
 *   title: "HOW I BROKE THE THING",
 *   date: "2026.09",
 *   excerpt: "One-line teaser shown in the feed.",
 *   body: ["First paragraph.", "Second paragraph."],
 *   href: "https://example.com/full-post",
 *   linkLabel: "READ THE FULL POST →",
 *   likes: 0,
 * },
 * { id: "first-paper", kind: "paper", title: "RESEARCH TITLE", date: "2026.09",
 *   excerpt: "Abstract.", href: "/art/paper.pdf", linkLabel: "READ PAPER →" },
 * { id: "first-video", kind: "video", title: "DEMO WALKTHROUGH", date: "2026.09",
 *   video: "YOUTUBE_ID", excerpt: "What is in the box." },
 * { id: "first-quote", kind: "quote", title: "ON SECURITY", date: "2026.09",
 *   quote: "The only secure system is one that is unplugged.", by: "SOMEONE" },
 */
export const posts: ActivityPost[] = [];

export const education = {
  degree: "Bachelor of Computer Science",
  school: "University of Calicut, Kerala, India",
  years: "2019 – 2022",
  cert: "CICSA — Certified IT Infrastructure and Cyber SOC Analyst",
} as const;

export const gear = [
  {
    group: "Security",
    items: ["Penetration Testing", "VAPT", "Vulnerability Research", "Bug Bounty Hunting"],
  },
  {
    group: "Web Security",
    items: ["XSS", "SQL Injection", "IDOR", "CSRF", "Authentication Bypass", "Session Hijacking"],
  },
  {
    group: "SOC / Blue Team",
    items: ["SOC Operations", "Threat Detection", "Incident Response", "Log Analysis", "SIEM"],
  },
  {
    group: "Network",
    items: ["Firewalling", "VLANs", "VPNs", "Network Segmentation"],
  },
  {
    group: "Programming",
    items: ["Python", "Bash", "JavaScript", "HTML", "CSS", "FastAPI", "React"],
  },
  {
    group: "Tools",
    items: ["Burp Suite", "Nmap", "Nessus", "Metasploit", "Hydra", "SQLMap", "Wireshark", "Shodan"],
  },
  {
    group: "Platforms",
    items: ["Wazuh", "Splunk", "pfSense", "Docker"],
  },
  {
    group: "Frameworks",
    items: ["OWASP Top 10", "MITRE ATT&CK", "NIST CSF", "PCI-DSS"],
  },
] as const;

export const news = [
  {
    date: "SEP 2026",
    headline: "Official site goes live — gold vinyl edition",
    body: "The webmaster finally finished the frames. Guestbook is open. Let us Chat",
  },
  {
    date: "2026",
    headline: "DEMOGORGON released",
    body: "Autonomous, scope-aware, human-overridable bug bounty research agent.",
  },
] as const;

export const aiQuotes = [
  {
    text: "Machines take me by surprise with great frequency.",
    source: "Alan Turing, Computing Machinery and Intelligence",
  },
  {
    text: "The development of full artificial intelligence could spell the end of the human race.",
    source: "Stephen Hawking, BBC News",
  },
  {
    text: "Before the prospect of an intelligence explosion, we humans are like small children playing with a bomb.",
    source: "Nick Bostrom, Superintelligence",
  },
  {
    text: "The question of whether a computer can think is no more interesting than the question of whether a submarine can swim.",
    source: "Edsger W. Dijkstra",
  },
  {
    text: "I'm sorry, Dave. I'm afraid I can't do that.",
    source: "HAL 9000, 2001: A Space Odyssey",
  },
  {
    text: "The Answer to the Great Question of Life, the Universe and Everything is Forty-two.",
    source: "Douglas Adams, The Hitchhiker's Guide to the Galaxy",
  },
] as const;

/* ── MUSIC (edit me) ──────────────────────────────────────────────────────
 * Change the site's mood track whenever you like:
 *   artist / song  → what the CURRENT MOOD popup shows
 *   youtubeId      → a bare YouTube ID *or* a full URL
 *                    (watch?v= / youtu.be / shorts — all work)
 *   quote          → the small quote under the popup title
 */
export const mood = {
  artist: "Radiohead",
  song: "No Surprises",
  youtubeId: "u5CVsCnxyXg",
  quote: "No alarms and no surprises.",
};

export const seedGuestbook = [
  {
    id: "seed-1",
    name: "root",
    location: "127.0.0.1",
    message: "nice site dude. the gold is almost illegal. don't pad the xss.",
    at: Date.UTC(2026, 8, 12),
  },
  {
    id: "seed-2",
    name: "laya",
    location: "the upside down",
    message: "he built me a decision engine and called it a bandmate. 10/10 would hunt again.",
    at: Date.UTC(2026, 8, 18),
  },
  {
    id: "seed-3",
    name: "netscape_user",
    location: "Calicut",
    message: "first!!! best viewed at 800x600. signed, a person who still has a webring.",
    at: Date.UTC(2026, 8, 20),
  },
] as const;
