import { useEffect, useState, type FormEvent } from "react";
import { RetroWindow } from "@/components/retro-window";
import { postKindFiles, postKindLabels, type ActivityPost, type PostKind } from "@/data/site";
import {
  addComment,
  loadComments,
  loadLiked,
  saveLiked,
  type PostComment,
} from "@/lib/post-social";
import { playSfx } from "@/lib/retro-audio";
import { asset } from "@/lib/asset";

type Filter = PostKind | "all";

const KIND_ORDER: PostKind[] = ["blog", "paper", "video", "quote"];

const FILTERS: { key: Filter; label: string }[] = [
  { key: "all", label: "ALL" },
  { key: "blog", label: "BLOG" },
  { key: "paper", label: "PAPER" },
  { key: "video", label: "VIDEO" },
  { key: "quote", label: "QUOTE" },
];

function PlaceholderWindow({ kind, align }: { kind: PostKind; align: "left" | "right" }) {
  return (
    <li className={`relative w-full max-w-2xl ${align === "right" ? "sm:ml-auto" : ""}`}>
      <div className="relative flex flex-col border-2 border-dashed border-gold/60 bg-ink-soft/70 shadow-[4px_4px_0_rgba(0,0,0,0.7)]">
        <div className="flex items-center justify-between gap-2 border-b-2 border-gold/60 bg-gradient-to-b from-gold/70 to-gold/40 px-2 py-1 select-none">
          <span className="truncate font-display text-2xs font-bold tracking-[0.18em] text-ink sm:text-xs">
            {postKindFiles[kind]}
          </span>
          <span className="shrink-0 border border-ink px-1 font-display text-[10px] leading-tight font-bold text-ink">
            SOON
          </span>
        </div>
        <div className="p-4 text-center">
          <p className="font-display text-2xs tracking-[0.3em] text-gold">
            {postKindLabels[kind]} — EMPTY FOLDER
          </p>
          <p className="mt-3 font-display text-lg text-gold-bright">
            I will post it wait! <span className="blink">▮</span>
          </p>
          <p className="mt-3 text-2xs tracking-[0.15em] text-muted">
            THIS FOLDER IS ALREADY WAITING FOR ITS FIRST {postKindLabels[kind]}.
          </p>
        </div>
      </div>
    </li>
  );
}

export function ActivityFeed({ posts }: { posts: ActivityPost[] }) {
  const [filter, setFilter] = useState<Filter>("all");
  const [openMap, setOpenMap] = useState<Record<string, boolean>>({});
  const [focused, setFocused] = useState<string | null>(null);
  const [liked, setLiked] = useState<Record<string, boolean>>({});
  const [comments, setComments] = useState<Record<string, PostComment[]>>({});
  const [thread, setThread] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    setLiked(loadLiked());
    setComments(loadComments());
  }, []);

  useEffect(() => {
    if (!toast) return;
    const t = window.setTimeout(() => setToast(null), 2400);
    return () => window.clearTimeout(t);
  }, [toast]);

  useEffect(() => {
    if (!window.location.hash) return;
    const el = document.getElementById(window.location.hash.slice(1));
    if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
  }, []);

  const visible = filter === "all" ? posts : posts.filter((p) => p.kind === filter);
  const emptyKinds: PostKind[] =
    filter === "all"
      ? KIND_ORDER.filter((k) => !posts.some((p) => p.kind === k))
      : posts.some((p) => p.kind === filter)
        ? []
        : [filter];

  const likeCount = (p: ActivityPost) => (p.likes ?? 0) + (liked[p.id] ? 1 : 0);
  const commentCount = (id: string) => comments[id]?.length ?? 0;

  const toggleLike = (p: ActivityPost) => {
    const next = !liked[p.id];
    setLiked((m) => ({ ...m, [p.id]: next }));
    saveLiked(p.id, next);
    playSfx(next ? "chirp" : "blip");
  };

  const share = async (p: ActivityPost) => {
    playSfx("blip");
    const url = `${window.location.origin}/activity#${p.id}`;
    const data = { title: p.title, text: p.excerpt ?? p.quote ?? p.title, url };
    if (typeof navigator.share === "function") {
      try {
        await navigator.share(data);
        return;
      } catch {
        // user cancelled or share failed — fall back to clipboard
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      setToast("LINK COPIED TO CLIPBOARD");
    } catch {
      setToast(url);
    }
  };

  const onComment = (e: FormEvent<HTMLFormElement>, postId: string) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const name = String(fd.get("name") ?? "");
    const text = String(fd.get("text") ?? "");
    if (text.trim().length < 2) {
      setToast("THE WIRE NEEDS AT LEAST TWO CHARACTERS");
      return;
    }
    playSfx("chirp");
    const list = addComment(postId, { name, text });
    setComments((m) => ({ ...m, [postId]: list }));
    e.currentTarget.reset();
  };

  return (
    <div>
      <div className="mt-8 flex flex-wrap items-center gap-1.5 border-2 border-gold bg-ink p-2">
        <button
          type="button"
          onClick={() => {
            playSfx("clunk");
            setFilter("all");
            setOpenMap({});
            setThread(null);
          }}
          className="bevel px-3 py-1.5 font-display text-2xs tracking-[0.25em]"
        >
          SHOW ALL
        </button>
        {FILTERS.map((f) => {
          const count = f.key === "all" ? posts.length : posts.filter((p) => p.kind === f.key).length;
          return (
            <button
              key={f.key}
              type="button"
              onClick={() => {
                playSfx("blip");
                setFilter(f.key);
                setThread(null);
              }}
              className={`border px-2 py-1.5 font-display text-2xs tracking-[0.12em] transition ${
                filter === f.key
                  ? "border-gold bg-gold/20 text-gold-bright"
                  : "border-gold/40 text-muted hover:text-gold"
              }`}
            >
              {f.label}
              {count > 0 ? ` (${count})` : ""}
            </button>
          );
        })}
        <span className="ml-auto px-2 font-display text-2xs tracking-[0.25em] text-muted">
          BLOG.EXE
        </span>
      </div>

      <ol className="mt-8 flex flex-col gap-10">
        {visible.map((p, i) => (
          <RetroWindow
            key={p.id}
            title={`${postKindFiles[p.kind]} · ${p.date}`}
            open={openMap[p.id] !== false}
            focused={focused === p.id}
            align={i % 2 === 1 ? "right" : "left"}
            onFocus={() => setFocused(p.id)}
            onClose={() => {
              setOpenMap((m) => ({ ...m, [p.id]: false }));
              setThread(null);
            }}
          >
            <div className="flex items-center justify-between gap-3 text-2xs tracking-[0.25em]">
              <span className="text-gold">{postKindLabels[p.kind]}</span>
              <span className="text-muted">{p.date}</span>
            </div>
            <h3
              id={p.id}
              className="crt-fringe mt-2 font-display text-lg tracking-[0.12em] text-gold-bright"
            >
              {p.title}
            </h3>

            {p.kind === "quote" && p.quote ? (
              <blockquote className="mt-3 border-l-2 border-gold pl-3 text-sm leading-relaxed text-cream">
                “{p.quote}”
                {p.by ? (
                  <footer className="mt-2 text-right font-display text-2xs tracking-[0.2em] text-muted">
                    — {p.by}
                  </footer>
                ) : null}
              </blockquote>
            ) : (
              <>
                {p.excerpt ? <p className="mt-2 text-sm text-cream">{p.excerpt}</p> : null}
                {p.body?.map((para) => (
                  <p key={para.slice(0, 24)} className="mt-2 text-sm leading-relaxed text-cream">
                    {para}
                  </p>
                ))}
              </>
            )}

            {p.video ? (
              <div className="mt-3 aspect-video w-full border border-gold/50 bg-ink">
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${p.video}`}
                  title={p.title}
                  loading="lazy"
                  allow="accelerometer; encrypted-media; picture-in-picture; fullscreen"
                  allowFullScreen
                  className="h-full w-full"
                />
              </div>
            ) : null}
            {p.thumb && !p.video ? (
              <img
                src={asset(p.thumb)}
                alt=""
                loading="lazy"
                className="mt-3 w-full border border-gold/50 object-cover"
              />
            ) : null}

            {p.href ? (
              <a
                href={asset(p.href)}
                onClick={() => playSfx("blip")}
                target={/^https?:/i.test(p.href) ? "_blank" : undefined}
                rel={/^https?:/i.test(p.href) ? "noreferrer" : undefined}
                className="bevel mt-4 inline-block px-3 py-1 font-display text-xs tracking-[0.2em] no-underline"
              >
                {p.linkLabel ?? "OPEN LINK →"}
              </a>
            ) : null}

            <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-gold/40 pt-3">
              <button
                type="button"
                aria-pressed={Boolean(liked[p.id])}
                onClick={() => toggleLike(p)}
                className={`border px-2 py-1.5 font-display text-2xs tracking-[0.18em] transition ${
                  liked[p.id]
                    ? "border-oxblood bg-oxblood/30 text-cream"
                    : "border-gold/50 text-gold hover:text-gold-bright"
                }`}
              >
                {liked[p.id] ? "♥ LIKED" : "♡ LIKE"} · {likeCount(p)}
              </button>
              <button
                type="button"
                onClick={() => {
                  playSfx("blip");
                  setThread((t) => (t === p.id ? null : p.id));
                }}
                className="border border-gold/50 px-2 py-1.5 font-display text-2xs tracking-[0.18em] text-gold transition hover:text-gold-bright"
              >
                ✎ COMMENTS · {commentCount(p.id)}
              </button>
              <button
                type="button"
                onClick={() => share(p)}
                className="border border-gold/50 px-2 py-1.5 font-display text-2xs tracking-[0.18em] text-gold transition hover:text-gold-bright"
              >
                ↗ SHARE
              </button>
            </div>

            {thread === p.id ? (
              <div className="mt-3 border border-gold/50 bg-ink p-3">
                {commentCount(p.id) > 0 ? (
                  <ul className="space-y-3">
                    {comments[p.id]?.map((c) => (
                      <li key={c.id} className="border-b border-gold/20 pb-2 last:border-0 last:pb-0">
                        <p className="font-display text-2xs tracking-[0.15em] text-gold-bright">
                          {c.name}{" "}
                          <span className="text-muted">{new Date(c.at).toLocaleDateString()}</span>
                        </p>
                        <p className="mt-1 text-sm text-cream">{c.text}</p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-2xs tracking-[0.15em] text-muted">
                    NO COMMENTS YET — BE THE FIRST TO BREAK THE ICE.
                  </p>
                )}
                <form
                  onSubmit={(e) => onComment(e, p.id)}
                  className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-end"
                >
                  <label className="flex-1 text-2xs tracking-[0.18em] text-gold">
                    NAME
                    <input
                      name="name"
                      maxLength={40}
                      autoComplete="nickname"
                      placeholder="anonymous"
                      className="inset-field mt-1 min-h-11 w-full bg-ink px-3 text-sm text-cream"
                    />
                  </label>
                  <label className="flex-[2] text-2xs tracking-[0.18em] text-gold">
                    COMMENT
                    <textarea
                      name="text"
                      rows={2}
                      required
                      maxLength={400}
                      placeholder="say something nice (or honest)..."
                      className="inset-field mt-1 w-full bg-ink px-3 py-2 text-sm text-cream"
                    />
                  </label>
                  <button
                    type="submit"
                    className="bevel min-h-11 shrink-0 px-4 font-display text-2xs tracking-[0.2em]"
                  >
                    POST
                  </button>
                </form>
              </div>
            ) : null}
          </RetroWindow>
        ))}
        {emptyKinds.map((k, i) => (
          <PlaceholderWindow
            key={k}
            kind={k}
            align={(visible.length + i) % 2 === 1 ? "right" : "left"}
          />
        ))}
      </ol>

      {visible.length === 0 && emptyKinds.length === 0 ? (
        <p className="mt-10 text-center text-sm text-muted">
          EVERY WINDOW IN THIS FOLDER IS MINIMIZED — HIT “SHOW ALL”.
        </p>
      ) : null}

      {toast ? (
        <div
          role="status"
          className="fixed inset-x-4 bottom-20 z-50 mx-auto w-fit border-2 border-gold bg-ink px-4 py-2 text-center font-display text-2xs tracking-[0.2em] break-words text-gold-bright shadow-[3px_3px_0_#000]"
        >
          {toast}
        </div>
      ) : null}
    </div>
  );
}
