export type ValueObjectOptions = {
  parser: typeof JSON;
};

export interface ValueObjectPort<Props> {
  clone(): ValueObjectPort<Props>;
  raw(): any;
  isEqual(vo?: this): boolean;
}
