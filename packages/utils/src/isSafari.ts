export function isSafari() {
  return (
    typeof navigator !== "undefined" &&
    navigator.vendor.indexOf("Apple") > -1 &&
    navigator.userAgent.indexOf("CriOS") === -1 &&
    navigator.userAgent.indexOf("FxiOS") === -1
  );
}
