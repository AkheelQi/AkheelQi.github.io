#!/usr/bin/env python3
"""Weekly AI Pulse pipeline — fetch RSS, rank with a free LLM, write JSON.

Stdlib only (no pip installs). Reads one of (first found):
  GEMINI_API_KEY  -> Google Gemini Flash (free tier)
  GROQ_API_KEY    -> Groq (free tier)
  XAI_API_KEY     -> xAI Grok
With no key, falls back to a recency + keyword heuristic so the pipeline
still runs 100% free.

Writes the top 4 stories to:
  data/ai-news.json            (canonical, committed by CI)
  public/data/ai-news.json     (served to the frontend)
"""

from __future__ import annotations

import datetime as dt
import email.utils
import html
import json
import os
import re
import sys
import urllib.parse
import urllib.request
import xml.etree.ElementTree as ET
from pathlib import Path

FEEDS = [
    "https://feeds.arstechnica.com/arstechnica/technology-lab",
    "https://techcrunch.com/category/artificial-intelligence/feed/",
    "https://huggingface.co/blog/feed.xml",
]

ROOT = Path(__file__).resolve().parent.parent
OUT_PATHS = [ROOT / "data" / "ai-news.json", ROOT / "public" / "data" / "ai-news.json"]

MAX_CANDIDATES = 12
KEEP_DAYS = 10
UA = "Mozilla/5.0 (X11; Linux x86_64) WeeklyAiPulse/1.0"

HOT_WORDS = [
    "ai", "a.i.", "artificial intelligence", "model", "gpt", "llm", "openai",
    "anthropic", "claude", "gemini", "deepmind", "google", "meta", "llama",
    "xai", "grok", "mistral", "agentic", "agent", "robot", "humanoid",
    "benchmark", "reasoning", "open-source", "jailbreak", "safety", "chip",
    "gpu", "data center", "training", "superintelligence", "video", "image",
    "coding", "research", "breakthrough", "launch", "release", "browser",
    "waymo", "tesla", "nvidia", "quantum", "drone", "military", "startup",
]


def http_get(url: str, timeout: int = 20) -> bytes:
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=timeout) as resp:
        return resp.read()


def strip_tags(text: str) -> str:
    text = re.sub(r"<(script|style)[^>]*>.*?</\1>", " ", text, flags=re.S | re.I)
    text = re.sub(r"<[^>]+>", " ", text)
    return re.sub(r"\s+", " ", html.unescape(text)).strip()


def parse_date(raw: str | None) -> dt.datetime | None:
    if not raw:
        return None
    raw = raw.strip()
    try:
        d = email.utils.parsedate_to_datetime(raw)
        if d:
            return d if d.tzinfo else d.replace(tzinfo=dt.timezone.utc)
    except Exception:
        pass
    try:
        d = dt.datetime.fromisoformat(raw.replace("Z", "+00:00"))
        return d if d.tzinfo else d.replace(tzinfo=dt.timezone.utc)
    except Exception:
        return None


def parse_feed(data: bytes) -> list[dict]:
    """Parse RSS 2.0 or Atom into [{title, link, summary, date}]."""
    try:
        root = ET.fromstring(data)
    except ET.ParseError:
        return []
    items: list[dict] = []
    atom = root.tag.endswith("}feed")
    nodes = root.findall(".//{*}entry") if atom else root.findall(".//item")
    for node in nodes:
        def find(*tags: str) -> str | None:
            for t in tags:
                el = node.find(f"{{*}}{t}") if not atom else node.find(f"{{*}}{t}")
                if el is not None and el.text:
                    return el.text
            return None

        if atom:
            link_el = node.find("{*}link")
            link = link_el.get("href") if link_el is not None else None
        else:
            link = find("link")
        title = strip_tags(find("title") or "")
        summary_raw = find("description") or find("summary") or find("content") or ""
        date = parse_date(find("pubDate") or find("date") or find("updated") or find("published"))
        if title and link:
            items.append(
                {"title": title, "link": link.strip(), "summary": strip_tags(summary_raw), "date": date}
            )
    return items


def score(item: dict, now: dt.datetime) -> float:
    s = 0.0
    d = item.get("date")
    if d:
        age = max(0.0, (now - d).total_seconds() / 86400.0)
        s += max(0.0, 10.0 - age)
    text = (item["title"] + " " + item.get("summary", "")).lower()
    s += sum(1.5 for w in HOT_WORDS if w in text)
    if "ai" in item["title"].lower():
        s += 3.0
    return s


def truncate_sentences(text: str, max_chars: int = 300) -> str:
    parts = re.split(r"(?<=[.!?])\s+", text.strip())
    out = ""
    for p in parts[:2]:
        if len(out) + len(p) + 1 > max_chars:
            break
        out = (out + " " + p).strip()
    if not out:
        out = text[:max_chars].rsplit(" ", 1)[0]
    return out.rstrip(".") + "." if out and not out.endswith((".", "!", "?")) else out


def shorten_title(title: str, max_words: int = 8) -> str:
    words = title.split()
    if len(words) <= max_words:
        return title
    return " ".join(words[:max_words]).rstrip(" ,:;-") + "…"


def image_ok(url: str) -> bool:
    """True only if the URL answers 200 with an image content-type."""
    try:
        req = urllib.request.Request(url, headers={"User-Agent": UA})
        with urllib.request.urlopen(req, timeout=15) as resp:
            if resp.status != 200:
                return False
            ctype = (resp.headers.get("Content-Type") or "").lower()
            resp.read(1024)
            return ctype.startswith("image/") or not ctype
    except Exception:
        return False


def og_image(url: str) -> str | None:
    try:
        raw = http_get(url, timeout=15)[:600_000].decode("utf-8", "replace")
    except Exception:
        return None
    for prop in ("og:image", "twitter:image"):
        m = re.search(
            rf'<meta[^>]+(?:property|name)=["\']{prop}["\'][^>]+content=["\']([^"\']+)["\']',
            raw, re.I,
        ) or re.search(
            rf'<meta[^>]+content=["\']([^"\']+)["\'][^>]+(?:property|name)=["\']{prop}["\']',
            raw, re.I,
        )
        if m and m.group(1).startswith(("http://", "https://")):
            return m.group(1)
    return None


def pollinations_fallback(title: str) -> str:
    prompt = urllib.parse.quote(f"{title}, dramatic retro gold and black editorial collage, grainy")
    return f"https://image.pollinations.ai/prompt/{prompt}?width=600&height=800&nologo=true"


def llm_pick(candidates: list[dict]) -> list[dict] | None:
    """Ask a free-tier LLM to pick 4 stories. Returns items or None on any failure."""
    key = os.environ.get("GEMINI_API_KEY") or os.environ.get("GROQ_API_KEY") or os.environ.get("XAI_API_KEY")
    if not key:
        return None

    listing = "\n".join(
        f'{i}. [{c["date"].strftime("%Y-%m-%d") if c.get("date") else "unknown"}] {c["title"]} || {c.get("summary", "")[:220]}'
        for i, c in enumerate(candidates)
    )
    prompt = (
        "You curate a 'Weekly AI Pulse' for a cybersecurity researcher's retro portfolio site. "
        "From the numbered candidates below, pick the 4 most fascinating, crazy, or breakthrough "
        "AI stories (impact > clickbait; no duplicates of the same event).\n\n"
        f"{listing}\n\n"
        'Return ONLY a JSON array of exactly 4 objects, ordered most mind-bending first:\n'
        '[{"index": <candidate number>, "title": "<catchy headline, max 8 words>", '
        '"summary": "<2-sentence breakdown focused on why it matters>"}]'
    )

    try:
        if os.environ.get("GEMINI_API_KEY"):
            body = json.dumps(
                {
                    "contents": [{"parts": [{"text": prompt}]}],
                    "generationConfig": {"temperature": 0.6, "responseMimeType": "application/json"},
                }
            ).encode()
            req = urllib.request.Request(
                "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key="
                + key,
                data=body,
                headers={"Content-Type": "application/json"},
            )
            with urllib.request.urlopen(req, timeout=30) as resp:
                data = json.loads(resp.read())
            text = data["candidates"][0]["content"]["parts"][0]["text"]
        else:
            endpoint = (
                "https://api.groq.com/openai/v1/chat/completions"
                if os.environ.get("GROQ_API_KEY")
                else "https://api.x.ai/v1/chat/completions"
            )
            model = (
                "llama-3.3-70b-versatile"
                if os.environ.get("GROQ_API_KEY")
                else "grok-2-latest"
            )
            body = json.dumps(
                {
                    "model": model,
                    "messages": [{"role": "user", "content": prompt}],
                    "temperature": 0.6,
                    "response_format": {"type": "json_object"},
                }
            ).encode()
            req = urllib.request.Request(
                endpoint,
                data=body,
                headers={"Content-Type": "application/json", "Authorization": f"Bearer {key}"},
            )
            with urllib.request.urlopen(req, timeout=30) as resp:
                data = json.loads(resp.read())
            text = data["choices"][0]["message"]["content"]

        m = re.search(r"\[.*\]", text, re.S)
        picks = json.loads(m.group(0) if m else text)
        out = []
        for p in picks[:4]:
            c = candidates[int(p["index"])]
            out.append(
                {
                    "title": shorten_title(str(p.get("title") or c["title"])),
                    "summary": truncate_sentences(strip_tags(str(p.get("summary") or c.get("summary", "")))),
                    "source_url": c["link"],
                    "date": c,
                }
            )
        if len(out) == 4:
            return out
    except Exception as exc:  # noqa: BLE001 — any LLM failure falls back to heuristics
        print(f"[fetch_ai_news] LLM pick failed, using heuristic: {exc}", file=sys.stderr)
    return None


def heuristic_pick(candidates: list[dict]) -> list[dict]:
    picks: list[dict] = []
    used: set[str] = set()
    for c in candidates:
        raw = c.get("summary") or c["title"]
        sents = re.split(r"(?<=[.!?])\s+", raw.strip())
        summary = ""
        for i in range(0, len(sents), 2):
            window = " ".join(sents[i : i + 2]).strip()
            if window and window not in used:
                summary = truncate_sentences(window)
                break
        if not summary:
            summary = truncate_sentences(raw)
        used.add(summary)
        picks.append(
            {
                "title": shorten_title(c["title"]),
                "summary": summary,
                "source_url": c["link"],
                "date": c,
            }
        )
        if len(picks) == 4:
            break
    return picks


def main() -> int:
    now = dt.datetime.now(dt.timezone.utc)
    candidates: list[dict] = []
    seen_links: set[str] = set()

    for feed in FEEDS:
        try:
            items = parse_feed(http_get(feed))
        except Exception as exc:  # noqa: BLE001 — one dead feed must not kill the run
            print(f"[fetch_ai_news] feed failed {feed}: {exc}", file=sys.stderr)
            continue
        for it in items:
            if it["link"] in seen_links:
                continue
            seen_links.add(it["link"])
            candidates.append(it)

    if not candidates:
        print("[fetch_ai_news] no candidates from any feed", file=sys.stderr)
        return 1

    # Prefer the last KEEP_DAYS; if a feed is stale, keep the newest overall.
    fresh = [c for c in candidates if c["date"] and (now - c["date"]).total_seconds() <= KEEP_DAYS * 86400]
    pool = fresh or candidates
    pool.sort(key=lambda c: score(c, now), reverse=True)
    pool = pool[:MAX_CANDIDATES]

    picks = llm_pick(pool) or heuristic_pick(pool)

    stories = []
    for p in picks:
        src = p["date"]  # original candidate (dict with date object)
        date_obj = src.get("date") or now
        image = og_image(src["link"])
        if not image or not image_ok(image):
            image = pollinations_fallback(p["title"])
        stories.append(
            {
                "title": p["title"],
                "summary": p["summary"],
                "source_url": p["source_url"],
                "image_url": image,
                "date": date_obj.strftime("%b %d, %Y"),
            }
        )

    payload = json.dumps(stories, indent=2, ensure_ascii=False) + "\n"
    for path in OUT_PATHS:
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(payload, encoding="utf-8")
        print(f"[fetch_ai_news] wrote {path.relative_to(ROOT)} ({len(stories)} stories)")

    return 0 if stories else 1


if __name__ == "__main__":
    sys.exit(main())
