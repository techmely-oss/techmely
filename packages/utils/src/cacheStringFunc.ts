export function cacheStringFunction<T extends (str: string) => string>(fn: T): T {
  const cache: Record<string, string> = Object.create(null);
  return ((str: string) => {
    const hit = cache[str];
    // biome-ignore lint/suspicious/noAssignInExpressions: <explanation>
    return hit || (cache[str] = fn(str));
  }) as T;
}
