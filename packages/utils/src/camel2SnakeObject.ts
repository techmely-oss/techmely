import type { CamelToSnakeNested } from "@techmely/types";
import { camel2snake } from "./camel2Snake";

// biome-ignore lint/complexity/noBannedTypes: Ignore typing
export function camel2SnakeObject<T extends Object>(obj: T) {
  return Object.entries(obj).reduce(
    // biome-ignore lint/performance/noAccumulatingSpread: Ignore here
    (acc, cur) => ({ ...acc, [camel2snake(cur[0])]: cur[1] }),
    {} as CamelToSnakeNested<T>,
  );
}
