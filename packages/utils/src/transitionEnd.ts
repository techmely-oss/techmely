import { nextEvent } from "./nextEvent";

export function transitionEnd(element: HTMLElement) {
  return nextEvent(element, "transitionend");
}
