import { isNotNullish } from "./isNotNullish";

/**
 * Map key/value pairs for an object, and construct a new one
 *
 * Transform:
 * @example
 * ```
 * mapObject({ a: 1, b: 2 }, (k, v) => [k.toString().toUpperCase(), v.toString()])
 * // { A: '1', B: '2' }
 * ```
 *
 * Swap key/value:
 * @example
 * ```
 * mapObject({ a: 1, b: 2 }, (k, v) => [v, k])
 * // { 1: 'a', 2: 'b' }
 * ```
 *
 * Filter keys:
 * @example
 * ```
 * mapObject({ a: 1, b: 2 }, (k, v) => k === 'a' ? undefined : [k, v])
 * // { b: 2 }
 * ```
 */
export function mapObject<K extends string, V = any, NK = K, NV = V>(
  obj: Record<K, V>,
  fn: (key: K, value: V) => [NK, NV] | undefined,
): Record<K, V> {
  return Object.fromEntries(
    Object.entries(obj)
      .map(([k, v]) => fn(k as K, v as V))
      .filter(isNotNullish),
  );
}
