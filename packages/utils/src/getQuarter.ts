export function getQuarter(d = new Date()): number {
  return Math.ceil((d.getMonth() + 1) / 3);
}
