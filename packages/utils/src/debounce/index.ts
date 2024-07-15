/**
 * @description Debouncing is a useful technique to optimize web applications by reducing unnecessary or
 * repeated function calls that might affect the performance or user experience
 */
export function debounce<Func extends (...args: any[]) => void>(
  func: Func,
  delay: number,
  immediate = false,
) {
  let timeoutId: ReturnType<typeof setTimeout> | null;

  return function (this: ThisParameterType<Func>, ...args: Parameters<Func>) {
    const callNow = immediate && !timeoutId;
    if (timeoutId) clearTimeout(timeoutId);

    timeoutId = setTimeout(() => {
      timeoutId = null;
      if (!immediate) {
        func.apply(this, args);
      }
    }, delay);

    if (callNow) {
      func.apply(this, args);
    }
  } as Func;
}
