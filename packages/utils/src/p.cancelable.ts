class CancelError extends Error {
  override readonly name: "CancelError";

  constructor(reason?: string) {
    super(reason || "Promise was canceled");
    this.name = "CancelError";
  }

  get isCanceled() {
    return true;
  }
}

const promiseState = Object.freeze({
  pending: Symbol("pending"),
  canceled: Symbol("canceled"),
  resolved: Symbol("resolved"),
  rejected: Symbol("rejected"),
});

export class PCancelable<ValueType> extends Promise<ValueType> {
  /**
	Convenience method to make your promise-returning or async function cancelable.

	@param fn - A promise-returning function. The function you specify will have `onCancel` appended to its parameters.

	@example
	```
	import PCancelable from '@oraichain/p-cancelable';

	const fn = PCancelable.fn((input, onCancel) => {
		const job = new Job();

		onCancel(() => {
			job.cleanup();
		});

		return job.start(); //=> Promise
	});

	const cancelablePromise = fn('input'); //=> PCancelable

	// …

	cancelablePromise.cancel();
	```
	*/
  static fn<ReturnType>(
    userFn: (onCancel: OnCancelFunction) => PromiseLike<ReturnType>,
  ): () => PCancelable<ReturnType>;
  static fn<Agument1Type, ReturnType>(
    userFn: (argument1: Agument1Type, onCancel: OnCancelFunction) => PromiseLike<ReturnType>,
  ): (argument1: Agument1Type) => PCancelable<ReturnType>;
  static fn<Agument1Type, Agument2Type, ReturnType>(
    userFn: (
      argument1: Agument1Type,
      argument2: Agument2Type,
      onCancel: OnCancelFunction,
    ) => PromiseLike<ReturnType>,
  ): (argument1: Agument1Type, argument2: Agument2Type) => PCancelable<ReturnType>;
  static fn<Agument1Type, Agument2Type, Agument3Type, ReturnType>(
    userFn: (
      argument1: Agument1Type,
      argument2: Agument2Type,
      argument3: Agument3Type,
      onCancel: OnCancelFunction,
    ) => PromiseLike<ReturnType>,
  ): (
    argument1: Agument1Type,
    argument2: Agument2Type,
    argument3: Agument3Type,
  ) => PCancelable<ReturnType>;
  static fn<Agument1Type, Agument2Type, Agument3Type, Agument4Type, ReturnType>(
    userFn: (
      argument1: Agument1Type,
      argument2: Agument2Type,
      argument3: Agument3Type,
      argument4: Agument4Type,
      onCancel: OnCancelFunction,
    ) => PromiseLike<ReturnType>,
  ): (
    argument1: Agument1Type,
    argument2: Agument2Type,
    argument3: Agument3Type,
    argument4: Agument4Type,
  ) => PCancelable<ReturnType>;
  static fn<Agument1Type, Agument2Type, Agument3Type, Agument4Type, Agument5Type, ReturnType>(
    userFn: (
      argument1: Agument1Type,
      argument2: Agument2Type,
      argument3: Agument3Type,
      argument4: Agument4Type,
      argument5: Agument5Type,
      onCancel: OnCancelFunction,
    ) => PromiseLike<ReturnType>,
  ): (
    argument1: Agument1Type,
    argument2: Agument2Type,
    argument3: Agument3Type,
    argument4: Agument4Type,
    argument5: Agument5Type,
  ) => PCancelable<ReturnType>;
  static fn<ReturnType>(
    userFn: (_arguments: unknown[]) => PromiseLike<ReturnType>,
  ): (_arguments: unknown[]) => PCancelable<ReturnType>;
  static fn(userFunction) {
    return (...arguments_) =>
      new PCancelable((resolve, reject, onCancel) => {
        arguments_.push(onCancel);
        userFunction(...arguments_).then(resolve, reject);
      });
  }

  #cancelHandlers: VoidFunction[] = [];
  #rejectOnCancel = true;
  #state = promiseState.pending;
  #promise: Promise<ValueType>;
  #reject: (error?: any) => void = () => {};

  constructor(executor: Executor<ValueType>) {
    // @ts-expect-error Ignore typing error
    super(executor);
    this.#promise = new Promise((resolve, reject) => {
      this.#reject = reject;

      const onCancel = (handler) => {
        if (this.#state !== promiseState.pending) {
          throw new Error(
            `The \`onCancel\` handler was attached after the promise ${this.#state.description}.`,
          );
        }

        this.#cancelHandlers.push(handler);
      };

      const addedProperties = {
        shouldReject: {
          get: () => this.#rejectOnCancel,
          set: (boolean) => {
            this.#rejectOnCancel = boolean;
          },
        },
      };
      objectDefProperties(onCancel, addedProperties);

      const onResolve = (value) => {
        if (this.#state !== promiseState.canceled || !onCancel.shouldReject) {
          resolve(value);
          this.#setState(promiseState.resolved);
        }
      };

      const onReject = (error) => {
        if (this.#state !== promiseState.canceled || !onCancel.shouldReject) {
          reject(error);
          this.#setState(promiseState.rejected);
        }
      };
      executor(onResolve, onReject, onCancel);
    });
  }

  // @ts-expect-error Ignore then
  // biome-ignore lint/suspicious/noThenProperty: <explanation>
  then(onFulfilled, onRejected) {
    return this.#promise.then(onFulfilled, onRejected);
  }

  override catch(onRejected) {
    return this.#promise.catch(onRejected);
  }

  override finally(onFinally) {
    return this.#promise.finally(onFinally);
  }

  cancel(reason) {
    if (this.#state !== promiseState.pending) {
      return;
    }

    this.#setState(promiseState.canceled);

    if (this.#cancelHandlers.length > 0) {
      try {
        for (const handler of this.#cancelHandlers) {
          handler();
        }
      } catch (error) {
        this.#reject(error);
        return;
      }
    }

    if (this.#rejectOnCancel) {
      this.#reject(new CancelError(reason));
    }
  }

  get isCanceled() {
    return this.#state === promiseState.canceled;
  }

  #setState(state) {
    if (this.#state === promiseState.pending) {
      this.#state = state;
    }
  }
}

/**
Accepts a function that is called when the promise is canceled.

You're not required to call this function. You can call this function multiple times to add multiple cancel handlers.
*/
export interface OnCancelFunction {
  (cancelHandler: () => void): void;
  shouldReject: boolean;
}

type Executor<T> = (
  resolve: (value?: T | PromiseLike<T>) => void,
  reject: (reason?: unknown) => void,
  onCancel: OnCancelFunction,
) => void;

// Same as `Object.defineProperties()` but with type inference
function objectDefProperties<Obj extends object, T extends PropertyDescriptorMap & ThisType<any>>(
  obj: Obj,
  objAddendum: T,
): asserts obj is Obj &
  Record<
    keyof typeof objAddendum,
    // @ts-expect-error Ignore typecheck
    ReturnType<(typeof objAddendum)[keyof typeof objAddendum]["get"]>
  > {
  Object.defineProperties(obj, objAddendum);
}
