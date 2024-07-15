import { type ResponseTime, convertHrTime } from "./convertHrTime";

export function timeSpan() {
  const start = process.hrtime.bigint();
  const end = (type: keyof ResponseTime) => convertHrTime(process.hrtime.bigint() - start)[type];

  const result = () => end("milliseconds") as number;
  result.toRounded = () => Math.round(end("milliseconds") as number);
  result.toSeconds = () => end("seconds") as number;
  result.toNanoseconds = () => end("nanoseconds") as bigint;

  return result;
}
