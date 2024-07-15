import { cacheStringFunction } from "./cacheStringFunc";

export const capitalizeFirst = cacheStringFunction((value: string) => {
  return value.replace(/^./, value[0].toUpperCase());
});
