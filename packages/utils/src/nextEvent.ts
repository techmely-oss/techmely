export function nextEvent(element: HTMLElement, eventName: string) {
  return new Promise((resolve) =>
    element.addEventListener(eventName, (event) => resolve(event), { once: true }),
  );
}
