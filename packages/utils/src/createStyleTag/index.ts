import { invariant } from "../invariant";
import { isBrowser } from "../isBrowser";

interface CreateStyleTagOptions extends Record<string, any> {
  id: string;
}

export function createStyleTag(style: string, options: CreateStyleTagOptions): HTMLStyleElement {
  invariant(isBrowser());

  const { id, ...rest } = options;
  const styleTag = document.querySelector(`style[#${id}]`) as HTMLStyleElement;
  if (styleTag) return styleTag;

  const styleNode = document.createElement("style");

  const values = Object.entries(rest);
  for (const [k, v] of values) {
    styleNode.setAttribute(k, v);
  }

  styleNode.setAttribute("id", id);
  styleNode.innerHTML = style;
  document.getElementsByTagName("head")[0].appendChild(styleNode);

  return styleNode;
}
