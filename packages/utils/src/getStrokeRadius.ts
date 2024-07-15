import { clamp } from "./clamp";
import { lerp } from "./lerp";

/**
 * Compute a radius based on the pressure.
 * @param size
 * @param thinning
 * @param easing
 * @param pressure
 * @returns
 */
export function getStrokeRadius(
  size: number,
  thinning: number,
  easing: (t: number) => number,
  pressure = 0.5,
) {
  if (!thinning) {
    return size / 2;
  }
  const newPressure = clamp(easing(pressure), 0, 1);
  return (
    (thinning < 0
      ? lerp(size, size + size * clamp(thinning, -0.95, -0.05), newPressure)
      : lerp(size - size * clamp(thinning, 0.05, 0.95), size, newPressure)) / 2
  );
}
