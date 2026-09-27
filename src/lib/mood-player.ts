import { mood } from "@/data/site";

export type MoodStatus = "idle" | "loading" | "playing" | "paused" | "unavailable";

export type MoodSnapshot = {
  status: MoodStatus;
};

type YTPlayer = {
  playVideo(): void;
  pauseVideo(): void;
  getPlayerState(): number;
};

type YTApi = {
  Player: new (
    el: HTMLElement,
    opts: Record<string, unknown>,
  ) => YTPlayer;
};

type WindowWithYT = {
  YT?: YTApi;
  onYouTubeIframeAPIReady?: () => void;
};

let snapshot: MoodSnapshot = { status: "idle" };
const listeners = new Set<() => void>();

function set(patch: Partial<MoodSnapshot>): void {
  snapshot = { ...snapshot, ...patch };
  listeners.forEach((l) => l());
}

export function subscribeMood(l: () => void): () => void {
  listeners.add(l);
  return () => {
    listeners.delete(l);
  };
}

export function getMoodSnapshot(): MoodSnapshot {
  return snapshot;
}

let apiPromise: Promise<YTApi> | null = null;
let player: YTPlayer | null = null;
let verifyTimer: number | undefined;

function loadApi(): Promise<YTApi> {
  return new Promise((resolve, reject) => {
    const w = window as unknown as WindowWithYT;
    if (w.YT && w.YT.Player) {
      resolve(w.YT);
      return;
    }
    let settled = false;
    const prev = w.onYouTubeIframeAPIReady;
    w.onYouTubeIframeAPIReady = () => {
      prev?.();
      if (!settled && w.YT) {
        settled = true;
        resolve(w.YT);
      }
    };
    const s = document.createElement("script");
    s.src = "https://www.youtube.com/iframe_api";
    s.async = true;
    s.onerror = () => {
      if (!settled) {
        settled = true;
        s.remove();
        reject(new Error("mood: yt api failed"));
      }
    };
    document.head.appendChild(s);
    window.setTimeout(() => {
      if (!settled) {
        settled = true;
        const api = (window as unknown as WindowWithYT).YT;
        if (api && api.Player) resolve(api);
        else reject(new Error("mood: yt api timeout"));
      }
    }, 8000);
  });
}

function createPlayer(api: YTApi): Promise<YTPlayer> {
  return new Promise((resolve, reject) => {
    const videoId = resolveYoutubeId(mood.youtubeId);
    const wrapper = document.createElement("div");
    wrapper.id = "mood-audio-host";
    wrapper.style.cssText =
      "position:fixed;left:-9999px;top:-9999px;width:1px;height:1px;opacity:0;pointer-events:none;";
    const inner = document.createElement("div");
    wrapper.appendChild(inner);
    document.body.appendChild(wrapper);

    let settled = false;
    const timer = window.setTimeout(() => {
      if (!settled) {
        settled = true;
        reject(new Error("mood: player timeout"));
      }
    }, 9000);

    const p: YTPlayer = new api.Player(inner, {
      width: "1",
      height: "1",
      videoId,
      playerVars: {
        autoplay: 1,
        playsinline: 1,
        controls: 0,
        disablekb: 1,
        modestbranding: 1,
        rel: 0,
        loop: 1,
        playlist: videoId,
        origin: window.location.origin,
      },
      events: {
        onReady: () => {
          if (!settled) {
            settled = true;
            window.clearTimeout(timer);
            resolve(p);
          }
        },
        onStateChange: (e: { data: number }) => {
          if (e.data === 1 || e.data === 3) {
            if (snapshot.status !== "playing") set({ status: "playing" });
          } else if (e.data === 2) {
            set({ status: "paused" });
          }
        },
        onError: () => {
          if (!settled) {
            settled = true;
            window.clearTimeout(timer);
            reject(new Error("mood: video error"));
          } else {
            set({ status: "unavailable" });
          }
        },
      },
    });
  });
}

const WANT_KEY = "mood-want";

/** Bare YouTube ID, or any watch / youtu.be / shorts / embed URL. */
function resolveYoutubeId(raw: string): string {
  const s = raw.trim();
  if (/^[\w-]{11}$/.test(s)) return s;
  const m = s.match(/(?:youtu\.be\/|[?&]v=|shorts\/|embed\/)([\w-]{11})/);
  return m?.[1] ?? s;
}

function setWant(on: boolean): void {
  try {
    if (on) window.sessionStorage.setItem(WANT_KEY, "1");
    else window.sessionStorage.removeItem(WANT_KEY);
  } catch {
    /* ignore */
  }
}

function getWant(): boolean {
  try {
    return window.sessionStorage.getItem(WANT_KEY) === "1";
  } catch {
    return false;
  }
}

export function moodPlay(): void {
  if (snapshot.status === "loading" || snapshot.status === "playing") return;
  setWant(true);
  set({ status: "loading" });
  if (!apiPromise) apiPromise = loadApi();
  apiPromise
    .then(async (api) => {
      if (!player) player = await createPlayer(api);
      player.playVideo();
      window.clearTimeout(verifyTimer);
      verifyTimer = window.setTimeout(() => {
        if (
          player &&
          snapshot.status === "loading" &&
          player.getPlayerState() !== 1 &&
          player.getPlayerState() !== 3
        ) {
          set({ status: "paused" });
        }
      }, 4000);
    })
    .catch(() => {
      apiPromise = null;
      if (snapshot.status === "loading") set({ status: "unavailable" });
    });
}

export function moodPause(): void {
  setWant(false);
  window.clearTimeout(verifyTimer);
  player?.pauseVideo();
  set({ status: "paused" });
}

export function moodMaybeResume(): void {
  if (getWant() && snapshot.status === "idle") moodPlay();
}

export function moodToggle(): void {
  if (snapshot.status === "playing" || snapshot.status === "loading") moodPause();
  else moodPlay();
}
