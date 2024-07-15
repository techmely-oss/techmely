export function isIOSChrome() {
  return typeof navigator !== "undefined" && navigator.userAgent.match("CriOS");
}
