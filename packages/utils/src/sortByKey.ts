export enum SortDirection {
  ASC = "ASC",
  DESC = "DESC",
}

export function sortByDate<T>(
  a: T,
  b: T,
  key: keyof T,
  direction: SortDirection = SortDirection.ASC,
) {
  if (a[key] < b[key]) {
    return direction === SortDirection.ASC ? 1 : -1;
  }
  if (a[key] > b[key]) {
    return direction === SortDirection.ASC ? -1 : 1;
  }
  return 0;
}
