import { getRandomInt } from "./getRandomInt";

const createAbortError = () => {
  const error = new Error("Delay aborted");
  error.name = "AbortError";
  return error;
};

const clearMethods = new WeakMap();

export function delay<T = any>(milliseconds: number, options?: DelayOptions<T>) {
  return createDelay<T>(milliseconds, options);
}

export function createDelay<T = any>(
  milliseconds: number,
  { value, signal }: DelayOptions<T> = {},
) {
  if (signal?.aborted) {
    return Promise.reject(createAbortError());
  }

  let timeoutId: any | number | undefined;
  let settle: VoidFunction;
  let rejectFunction: (error?: any) => void;

  const signalListener = () => {
    clearTimeout(timeoutId);
    rejectFunction(createAbortError());
  };

  const cleanup = () => {
    if (signal) {
      signal.removeEventListener("abort", signalListener);
    }
  };

  const delayPromise = new Promise<T>((resolve, reject) => {
    settle = () => {
      cleanup();
      if (value) resolve(value);
    };

    rejectFunction = reject;
    timeoutId = setTimeout(settle, milliseconds);
  });

  if (signal) {
    signal.addEventListener("abort", signalListener, { once: true });
  }

  clearMethods.set(delayPromise, () => {
    clearTimeout(timeoutId);
    timeoutId = undefined;
    settle();
  });

  return delayPromise;
}

export async function rangeDelay<T>(
  minimum: number,
  maximum: number,
  options: DelayOptions<T> = {},
) {
  return delay(getRandomInt(minimum, maximum), options);
}

export function clearDelay(promise: Promise<unknown>) {
  clearMethods.get(promise)?.();
}

export type DelayOptions<T> = {
  /**
	A value to resolve in the returned promise.

	@example
	```
	import delay from 'delay';

	const result = await delay(100, {value: '🦄'});

	// Executed after 100 milliseconds
	console.log(result);
	//=> '🦄'
	```
	*/
  value?: T;

  /**
	An `AbortSignal` to abort the delay.

	The returned promise will be rejected with an `AbortError` if the signal is aborted.

	@example
	```
	import delay from 'delay';

	const abortController = new AbortController();

	setTimeout(() => {
		abortController.abort();
	}, 500);

	try {
		await delay(1000, {signal: abortController.signal});
	} catch (error) {
		// 500 milliseconds later
		console.log(error.name)
		//=> 'AbortError'
	}
	```
	*/
  signal?: AbortSignal;
};
