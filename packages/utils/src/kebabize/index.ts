export function kebabize(value: string) {
  /**
    [A-Z]+(?![a-z]) matches any consecutive capital letters, excluding any capitals followed by
    a lowercase (signifying the next word). Adding |[A-Z] then includes any single capital letters.
    It must be after the consecutive capital expression, otherwise the expression will match
    all capital letters individually and never match consecutives.
  */
  return value.replace(/[A-Z]+(?![a-z])|[A-Z]/g, ($, ofs) => (ofs ? "-" : "") + $.toLowerCase());
}
