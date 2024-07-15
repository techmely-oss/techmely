// Using `typeof window !== 'undefined'` alone is not enough because some users use https://www.npmjs.com/package/ssr-window
export function isBrowser() {
  return typeof window !== "undefined";
}
