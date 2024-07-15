import { toISOStringTimezone } from "../toISOStringTimezone";

export function isISOStringWithTimezone(val: string) {
  const d = new Date(val);
  return !Number.isNaN(d.valueOf()) && toISOStringTimezone(d) === val;
}
