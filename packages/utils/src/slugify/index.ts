/**
 * @param text string will slugify for only Latin/Vietnamese
 * @returns {string}
 */
export function slugify(text: string): string {
  if (!text) {
    return "";
  }
  return text
    .toString() // Cast to string (optional)
    .normalize("NFKD") // The normalize() using NFKD method returns the Unicode Normalization Form of a given string.
    .toLowerCase() // Convert the string to lowercase letters
    .trim() // Remove whitespace from both sides of a string (optional)
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/[Đđ]/g, "d") // Replace-all the đ char with d
    .replace(/[^\w-]+/g, "") // Remove all non-word chars
    .replace(/[^\w-]+/g, "") // Remove all non-word chars
    .replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, "-") // remove special characters
    .replace(/--+/g, "-"); // Replace multiple - with single -
}
