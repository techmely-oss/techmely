export function windowMatchMedia() {
  return typeof window !== "undefined" ? window.matchMedia || window.msMatchMedia : undefined;
}

declare global {
  interface Window {
    msMatchMedia(query: string): MediaQueryList;
  }
}
