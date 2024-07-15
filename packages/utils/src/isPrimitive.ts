export type Primitives = {
  value: string | number | boolean | Date | null;
};

export function isPrimitive(value: unknown): value is Primitives {
  if (value === null) {
    return true;
  }

  return !["array", "function", "object"].includes(typeof value);
}
