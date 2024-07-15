import type { Records } from "@techmely/types";
import type { IResult, ResultObject } from "./types";

export class Result<Value = void, E = string | Error, Metadata = Records>
  implements IResult<Value, E, Metadata>
{
  #isOk: Readonly<boolean>;
  #isFail: Readonly<boolean>;
  #data: Readonly<Value | undefined>;
  #error: Readonly<E | undefined>;
  #metadata: Readonly<Metadata>;

  private constructor(isSuccess: boolean, data?: Value, err?: E, metadata?: Metadata) {
    this.#isOk = isSuccess;
    this.#isFail = !isSuccess;
    this.#data = data;
    this.#error = err;
    this.#metadata = metadata ?? ({} as Metadata);
  }

  /**
   * @description Create an instance of Result as success state
   */
  // @ts-expect-error Ignore blaming type check
  static Ok(): Result<void>;
  /**
   * @description Create an instance of Result as success state
   */
  static Ok(): IResult<void>;
  /**
   * @description Create an instance of Result as success state with data and metadata to payload.
   */
  static Ok<V, M = Records, Er = string | Error>(data: V, metadata?: M): Result<V, Er, M>;
  /**
   * @description Create an instance of Result as success state with data and metadata to payload.
   */
  static Ok<V, M = Records, Er = string | Error>(data: V, metadata?: M): IResult<V, Er, M>;
  static Ok<V, M = Records, Er = string | Error>(data: V, metadata?: M): IResult<V, Er, M> {
    const ok = new Result(true, data, undefined, metadata) as unknown as IResult<V, Er, M>;
    return Object.freeze(ok) as IResult<V, Er, M>;
  }

  /**
   * @description Create an instance of Result as failure state with error and metadata to payload.
   */
  static fail<E = string | Error, M = Records, V = void>(err?: E, metadata?: M): Result<V, E, M>;
  /**
   * @description Create an instance of Result as failure state with error and metadata to payload.
   */
  static fail<E = string | Error, M = Records, V = void>(err?: E, metadata?: M): IResult<V, E, M> {
    const fail = new Result(
      false,
      undefined,
      err || "An error has occurred",
      metadata,
    ) as unknown as IResult<V, E, M>;
    return Object.freeze(fail);
  }

  value(): Value {
    return this.#data as Value;
  }

  error(): E {
    return this.#error as E;
  }

  isOk(): boolean {
    return this.#isOk;
  }

  isFail(): boolean {
    return this.#isFail;
  }

  metadata(): Metadata {
    return Object.freeze(this.#metadata);
  }

  toObject(): ResultObject<Value, E, Metadata> {
    const obj = {
      isOk: this.#isOk,
      isFail: this.#isFail,
      error: this.#error,
      data: this.#data,
      metadata: this.#metadata,
    };
    return Object.freeze(obj);
  }
}
