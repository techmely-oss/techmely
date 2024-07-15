export function isWebkit() {
  return typeof document !== "undefined" && "webkitFontSmoothing" in document.documentElement.style;
}
