export function freezeMainThread(duration: number) {
  const start = Date.now();
  while (Date.now() - start < duration) {}
}
