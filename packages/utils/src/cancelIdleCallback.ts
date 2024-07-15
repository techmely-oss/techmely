function cancelIdleCallbackShim(id: any) {
  clearTimeout(id);
}
export const cancelIdleCallback =
  typeof window !== "undefined"
    ? window.cancelIdleCallback || cancelIdleCallbackShim
    : cancelIdleCallbackShim;
