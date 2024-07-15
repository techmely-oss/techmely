/**
 * Truncate text if text length longer than a value
 * @example truncate('hello-world', 5) --> hello...
 * @param str
 * @param limit
 * @param text
 */
export function truncate(str: string, limit: number, text = "..."): string {
  if (str.length > limit) {
    return `${str.substring(0, limit)} ${text}`;
  }

  return str;
}
