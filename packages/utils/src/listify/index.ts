import type { Entity } from "@techmely/types";

/**
 * @description Map an object to an array
 * @example const people = { John: { age: 42 }, Adam: { age: 39 } };
            listify(people, (key, value) => ({ name: key, ...value }));
            [ { name: 'John', age: 42 }, { name: 'Adam', age: 39 } ]
 */
export function listify<O extends Record<string, any>, T = any>(
  obj: O,
  mapFn: (key: string, value: Entity) => any,
) {
  return Object.entries(obj).reduce((acc, [key, value]) => {
    acc.push(mapFn(key, value));
    return acc;
  }, [] as T[]);
}
