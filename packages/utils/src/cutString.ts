/**
 *
 * * * *
 * Example:
 * ```typescript
 * import { cutString } from "@techmely/utils";
 *
 * const str = 'foolvkl';
 *
 * cutString(str, 3); // 'foo'
 * ```
 */
export function cutString(value: string, limit: number): string | undefined {
  if (!value && typeof value !== "string") return undefined;
  if (value.length === 0) return value;
  return value.split("").slice(0, limit).join("");
}
