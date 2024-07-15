import { isServer } from "../isServer";

/**
 * Smooth-scrolls to the top of the page.
 * Use Window.requestAnimationFrame() to animate the scrolling
 */
export function scrollToTop() {
  if (isServer()) return;

  const c = document.documentElement.scrollTop || document.body.scrollTop;
  if (c > 0) {
    window.requestAnimationFrame(scrollToTop);
    window.scrollTo(0, c - c / 8);
  }
}
