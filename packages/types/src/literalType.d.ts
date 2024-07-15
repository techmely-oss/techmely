export type ComputeRange<
  N extends number,
  Result extends unknown[] = [],
> = Result["length"] extends N ? Result : ComputeRange<N, [...Result, Result["length"]]>;

type Enumerate<N extends number, Acc extends number[] = []> = Acc["length"] extends N
  ? Acc[number]
  : Enumerate<N, [...Acc, Acc["length"]]>;

export type INT<From extends number, To extends number> =
  | Exclude<Enumerate<To>, Enumerate<From>>
  | To;

export type CamelToSnakeCase<S extends string> = S extends `${infer T}${infer U}`
  ? `${T extends Capitalize<T> ? "_" : ""}${Lowercase<T>}${CamelToSnakeCase<U>}`
  : S;

export type CamelToSnakeNested<T> = T extends object
  ? {
      [K in keyof T as CamelToSnakeCase<K & string>]: CamelToSnakeNested<T[K]>;
    }
  : T;
