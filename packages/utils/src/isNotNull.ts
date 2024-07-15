export function isNotNull<T>(v: T | null): v is Exclude<T, null> {
  return v !== null;
}
