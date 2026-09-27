/**
 * Prefix a site-internal asset path ("/art/…", "/data/…") with the vite
 * base, so paths keep working when the site is served from a sub-path
 * (GitHub Pages project site, BASE_PATH="/repo/"). Absolute URLs,
 * data:, mailto: and # links pass through untouched.
 */
export function asset(path: string): string {
  if (/^(https?:|data:|mailto:|#)/.test(path)) return path;
  return import.meta.env.BASE_URL.replace(/\/$/, "") + (path.startsWith("/") ? path : `/${path}`);
}
