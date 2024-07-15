import { isServer } from "../isServer";

export function onClickOutside(element: HTMLElement, callback: CallableFunction) {
  if (isServer()) return;
  document.addEventListener("click", (e) => {
    if (!element.contains(e.target as any)) callback();
  });
}
