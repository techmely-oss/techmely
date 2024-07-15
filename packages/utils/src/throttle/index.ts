/**
 * @description Limit how often a function can be called in a given period of time.
 * It is useful for improving the performance and responsiveness of web pages
 * that have event listeners that trigger heavy or expensive operations
 */
export function throttle<F extends (...args: any[]) => void>(func: F, limit: number) {
  let inThrottle = false;

  return function (this: ThisParameterType<F>, ...args: Parameters<F>) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  } as F;
}
