type DelayOptions = {
  signal?: AbortController["signal"] | null;
};

export async function delaySignal(ms: number, { signal }: DelayOptions): Promise<void> {
  return new Promise((resolve, reject) => {
    if (signal) {
      signal.throwIfAborted();
      signal.addEventListener("abort", abortHandler, { once: true });
    }

    function abortHandler() {
      clearTimeout(timeoutId);
      reject(signal?.reason);
    }

    const timeoutId = setTimeout(() => {
      signal?.removeEventListener("abort", abortHandler);
      resolve();
    }, ms);
  });
}
