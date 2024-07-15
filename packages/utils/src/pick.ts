import type { Records } from "@techmely/types";

/**
 * Pick nested properties from an object with path/multiple paths.
 * Example:
 * - pick({ a: { b: 1 } }, ["a.b"]) => { a: { b: 1 } }
 * - pick({ a: { b: 1 } }, "a") => { a: { b: 1 } }
 */
export function pick(state: Records, paths: string | string[]): Records {
  if (Array.isArray(paths)) {
    return paths.reduce<Records>((acc, path) => {
      const _paths = path.split(".");
      return set(acc, _paths, get(state, _paths));
    }, {});
  }
  return get(state, paths.split("."));
}

function get(state: Records, paths: string[]) {
  return paths.reduce((acc, path) => acc?.[path], state);
}

/**
 * avoids prototype pollution
 */
const ProtoRE = /^(__proto__)$/;

function set(state: Records, paths: string[], val: unknown): Records {
  const last = paths.at(-1);
  if (last === undefined) return state;

  const restPaths = paths.slice(0, -1);
  const result = restPaths.reduce(
    // biome-ignore lint/suspicious/noAssignInExpressions: <explanation>
    (obj, p) => (ProtoRE.test(p) ? {} : (obj[p] ||= {})),
    state,
  );
  result[last] = val;
  return state;
}
