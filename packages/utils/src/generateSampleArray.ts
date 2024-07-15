/**
 * Get random items from an array
 */
export function generateSample<T>(arr: T[], count: number) {
  return Array.from({ length: count }, (_) => arr[Math.round(Math.random() * (arr.length - 1))]);
}
