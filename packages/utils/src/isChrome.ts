import { isEdgeBrowser } from "./isEdgeBrowser";
import { isOpera } from "./isOpera";

export function isChrome() {
  if (typeof window === "undefined") return false;

  const isChromium = window.chrome;
  const vendor = window.navigator.vendor;

  return (
    isChromium !== null &&
    typeof isChromium !== "undefined" &&
    vendor === "Google Inc." &&
    isOpera() === false &&
    isEdgeBrowser() === false
  );
}

declare global {
  interface Window {
    chrome: any;
  }
}
