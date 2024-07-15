import dayjs from "dayjs";
import type { ConfigType, OpUnitType, QUnitType } from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime.js";
import timezone from "dayjs/plugin/timezone.js";
import utc from "dayjs/plugin/utc.js";

type CompareDateConfig = {
  unit?: QUnitType | OpUnitType;
  float?: boolean;
};

dayjs.extend(utc);
dayjs.extend(relativeTime);
dayjs.extend(timezone);
const timeZone = dayjs.tz.guess();
dayjs.tz.setDefault(timeZone);

/**
 * @param date
 * @param format default value is DD/MM/YYYY
 * @example
 * // Format with HH:mm:ss
 * formatDate(date, 'HH:mm:ss')
 */
export function formatDate(date: ConfigType, format = "DD/MM/YYYY"): string {
  return dayjs(date).format(format);
}

export function formatDateToNow(date: ConfigType): string {
  return dayjs(date).fromNow();
}

/**
 * @param time The unix timestamp
 */
export function parseUnix(time: number) {
  return dayjs.unix(time);
}

export function getUnixTime(date: Date) {
  return dayjs(date).unix();
}

export function formatDateUnixTime(seconds: number, format = "DD/MM/YYYY") {
  return formatDate(dayjs.unix(seconds).toISOString(), format);
}

export function diffDate(toDate: Date, fromDate: Date, config?: CompareDateConfig) {
  const formattedToDate = dayjs(toDate).format("YYYY-MM-DD");
  const formattedFromDate = dayjs(fromDate).format("YYYY-MM-DD");
  return dayjs(formattedFromDate).diff(dayjs(formattedToDate), config?.unit, config?.float);
}

export function addNewDate(date: Date, addDays = 0): Date {
  return dayjs(date).add(addDays, "day").toDate();
}

export { dayjs };
