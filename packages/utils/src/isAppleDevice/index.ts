export function isAppleDevice() {
  if (typeof navigator === "undefined") return false;
  return /(Mac|iPhone|iPod|iPad)/i.test(navigator.userAgent);
}
