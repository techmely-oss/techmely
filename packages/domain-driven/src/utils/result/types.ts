import type { Records } from "@techmely/types";

export type ResultObject<V, E, M> = {
  isOk: boolean;
  isFail: boolean;
  data?: V;
  error?: E;
  metadata: M;
};

export interface IResult<Value, Error = string, Metadata = Records> {
  value(): Value;
  error(): Error;
  isOk(): boolean;
  isFail(): boolean;
  metadata(): Metadata;
  toObject(): ResultObject<Value, Error, Metadata>;
}
