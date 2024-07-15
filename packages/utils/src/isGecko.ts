/**
 * Usually to check is Firefox browser
 */
export function isGecko() {
  return typeof navigator !== "undefined" && /gecko\/(\d+)/i.test(navigator.userAgent);
}
