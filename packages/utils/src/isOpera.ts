export function isOpera() {
  return typeof window !== "undefined" && typeof window.opr !== "undefined";
}

declare global {
  interface Window {
    opr: any;
  }
}
