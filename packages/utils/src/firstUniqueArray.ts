export function firstUniqueArr(array: (string | number)[]) {
  if (!array || array?.length === 0) return undefined;
  const arrLength = array.length;
  if (array.length === 1) return array[0];

  for (let i = 0; i < arrLength; i++) {
    const element = array[i];
    if (array.indexOf(element) === array.lastIndexOf(element)) return element;
  }
  return undefined;
}
