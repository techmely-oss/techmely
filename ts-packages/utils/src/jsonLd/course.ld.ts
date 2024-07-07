import { toJsonLd } from ".";
import { setProvider } from "./set.ld";
import type { JsonLdProvider } from "./types";

export function getCourseJsonLd(name: string, provider: JsonLdProvider, props?: any) {
  const data = {
    ...props,
    name,
    provider: setProvider(provider),
  };
  return toJsonLd("Course", data);
}
