// Take this from https://developer.chrome.com/blog/using-requestidlecallback

function requestIdleCallbackShim(cb: any) {
  const start = Date.now();
  return setTimeout(() => {
    cb({
      didTimeout: false,
      timeRemaining: () => Math.max(0, 50 - (Date.now() - start)),
    });
  }, 1) as unknown as number;
}

export const requestIdleCallback =
  typeof window !== "undefined"
    ? window.requestIdleCallback || requestIdleCallbackShim
    : requestIdleCallbackShim;
