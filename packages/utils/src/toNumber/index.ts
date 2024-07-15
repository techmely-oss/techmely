export function toNumber(value: string): number | string {
  const n = Number.parseFloat(value);

  return Number.isNaN(n) ? value : n;
}
