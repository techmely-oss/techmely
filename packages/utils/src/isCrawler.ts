// Crawl from https://github.com/johannschopplich/unlazy/blob/main/packages/core/src/utils/index.ts#LL4C1-L4C122
export function isCrawler() {
  return (
    typeof window !== "undefined" &&
    (!("onscroll" in window) || /(gle|ing|ro)bot|crawl|spider/i.test(navigator.userAgent))
  );
}
