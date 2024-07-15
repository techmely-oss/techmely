import { isArray } from "./isArray";

/**
 * Convert an array of points to the correct format ([x, y, pressure])
 * @param points The points to format, an array of arrays or objects
 * @returns number[][]
 */
export function toPointsArray<
  T extends number[],
  K extends { x: number; y: number; pressure?: number },
>(points: (T | K)[]): number[][] {
  if (isArray(points[0])) {
    return (points as number[][]).map(([x, y, pressure = 0.5]) => [x, y, pressure]);
  }
  return (
    points as {
      x: number;
      y: number;
      pressure?: number;
    }[]
  ).map(({ x, y, pressure = 0.5 }) => [x, y, pressure]);
}
