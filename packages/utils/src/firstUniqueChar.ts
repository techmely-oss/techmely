export function firstUniqueChar(value: string) {
  if (!value) return undefined;
  const charLength = value.length;
  for (let i = 0; i < charLength; i++) {
    const letter = value[i];
    if (value.indexOf(letter) === value.lastIndexOf(letter)) return letter;
  }
  return undefined;
}
