/**
 * #description: remove all whitespace from a string, including spaces between words
 */
export function removeWhitespace(value: string) {
  return value.replace(/\s/g, "");
}
