import { isSameDay } from "./isSameDay";

export function isToday(date: Date): boolean {
  return isSameDay(date, new Date());
}
