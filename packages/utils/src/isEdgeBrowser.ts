export function isEdgeBrowser() {
  return typeof navigator !== "undefined" && navigator.userAgent.indexOf("Edg") > -1;
}
