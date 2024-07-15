export type Nullable<T> = T | null;
export type UnDef<T> = T | undefined;
export type NullList<T> = T | undefined | null;
export type EntityId = number | string;
export type Entity = number | string | symbol;

export interface DictNum<T> {
  [id: number]: T;
}
export interface Dict<T> extends DictNum<T> {
  [id: string]: T;
}

export interface EntityState<T> {
  ids: string[];
  entities: Dict<T>;
}

export type VoidFunc<T> = (value: T) => void;
export type StringEnum<T> = T | (string & Record<never, never>);

export type Records<T = any> = Record<Entity, T>;

// test if we are going the left AND right path in the condition
export type IsAny<T, True, False = never> = true | false extends (T extends never ? true : false)
  ? True
  : False;

export type PreventAny<S, T> = IsAny<S, EntityState<T>, S>;

export type Comparer<T> = (a: T, b: T) => number;

export type MergeInsertions<T> = T extends Record<string, any>
  ? {
      [K in keyof T]: MergeInsertions<T[K]>;
    }
  : T;

export type MergeDeep<F, S> = MergeInsertions<{
  [K in keyof F | keyof S]: K extends keyof S & keyof F
    ? MergeDeep<F[K], S[K]>
    : K extends keyof S
      ? S[K]
      : K extends keyof F
        ? F[K]
        : never;
}>;

export type RuntimeEnv = "development" | "staging" | "production";
export type NodeEnv = "development" | "test" | "production";
