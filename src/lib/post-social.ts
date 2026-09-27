export type PostComment = {
  id: string;
  name: string;
  text: string;
  at: number;
};

const LIKES_KEY = "akheel-post-likes-v1";
const COMMENTS_KEY = "akheel-post-comments-v1";

type CommentMap = Record<string, PostComment[]>;

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write(key: string, value: unknown): void {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // storage full / private mode — interaction just won't persist
  }
}

export function loadLiked(): Record<string, boolean> {
  return read<Record<string, boolean>>(LIKES_KEY, {});
}

export function saveLiked(postId: string, liked: boolean): void {
  const map = loadLiked();
  if (liked) map[postId] = true;
  else delete map[postId];
  write(LIKES_KEY, map);
}

export function loadComments(): CommentMap {
  return read<CommentMap>(COMMENTS_KEY, {});
}

export function addComment(postId: string, input: { name: string; text: string }): PostComment[] {
  const map = loadComments();
  const comment: PostComment = {
    id: crypto.randomUUID(),
    name: input.name.trim().slice(0, 40) || "anonymous",
    text: input.text.trim().slice(0, 400),
    at: Date.now(),
  };
  const list = [...(map[postId] ?? []), comment];
  map[postId] = list;
  write(COMMENTS_KEY, map);
  return list;
}
