/**
 * Pseudo-random string generator
 * http://stackoverflow.com/a/27872144/383904
 * Default: return a random alpha-numeric string
 *
 * @param {Integer} length Desired length
 * @param {String} alphanumeric Optional (alphanumeric), "a" (alpha), "n" (numeric)
 * @return {String}
 */
export function getRandomString(length: number, alphanumeric?: "a" | "n"): string {
  let str = "";
  let i = 0;
  const min = alphanumeric === "a" ? 10 : 0;
  const max = alphanumeric === "n" ? 10 : 62;

  while (i++ < length) {
    let r = Math.trunc(Math.random() * (max - min) + min);
    // biome-ignore lint/suspicious/noAssignInExpressions: <explanation>
    str += String.fromCodePoint((r += r > 9 ? (r < 36 ? 55 : 61) : 48));
  }
  return str;
}
