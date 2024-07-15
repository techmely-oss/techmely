/**
 * Stops all active animations on the target element. Returns a promise that resolves after all animations are canceled.
 */
export function stopAnimations(el: HTMLElement) {
  return Promise.all(
    el.getAnimations().map((animation) => {
      return new Promise((resolve) => {
        const handleAnimationEvent = requestAnimationFrame(resolve);

        animation.addEventListener("cancel", () => handleAnimationEvent, { once: true });
        animation.addEventListener("finish", () => handleAnimationEvent, { once: true });
        animation.cancel();
        cancelAnimationFrame(handleAnimationEvent);
      });
    }),
  );
}
