import { isNotEmpty, isPrimitive } from "@techmely/utils";
import { Result } from "../../utils";
import type { IResult } from "../../utils/result/types";
import type { ValueObjectOptions, ValueObjectPort } from "./types";

export class ValueObject<Props> implements ValueObjectPort<Props> {
  #props: Props;
  #options: ValueObjectOptions;

  constructor(props: Props, options?: ValueObjectOptions) {
    const _options = options || { parser: JSON };
    this.#props = props;
    this.#options = _options;
  }

  static isValueObject(obj: unknown): obj is ValueObject<unknown> {
    return obj instanceof ValueObject;
  }

  /**
   * @description Method to validate prop value.
   * @param props to validate
   */
  static isValidProps(props: any): boolean {
    return isNotEmpty(props) || (isPrimitive(props) && isNotEmpty(props?.value));
  }

  static create(props: any): IResult<any, any, any>;
  /**
   *
   * @param props params as Props
   * @returns instance of result with a new Value Object on state if success.
   * @summary result state will be `null` case failure.
   */
  static create(props: any, options?: ValueObjectOptions): Result<any, any, any> {
    if (ValueObject.isValidProps(props)) {
      return Result.Ok(new ValueObject(props, options));
    }
    return Result.fail(`Invalid props to create an instance of ${ValueObject.name}`);
  }

  clone(props?: Partial<Props>): ValueObject<Props> {
    const _props = props ? { ...this.#props, ...props } : this.#props;
    const instance = Reflect.getPrototypeOf(this);
    if (!instance) throw new Error("Cannot get prototype of this entity instance");
    const vo = Reflect.construct(instance.constructor, [_props]);
    return vo;
  }

  isEqual(vo?: this): boolean {
    if (!vo) return false;
    return this.#options.parser.stringify(this) === this.#options.parser.stringify(vo);
  }

  /**
   * Convert value obj to get raw properties
   */
  raw() {
    if (isPrimitive(this.#props)) {
      return this.#props.value;
    }
    const clone = this.#convertPropsToObject(this.#props);
    return Object.freeze(clone);
  }

  #convertPropsToObject(props: Props) {
    const propsCopy = structuredClone(props) as any;
    for (const prop in propsCopy) {
      const item = propsCopy[prop];
      if (Array.isArray(item)) {
        propsCopy[prop] = item.map((i) => {
          return ValueObject.isValueObject(i) ? i.raw() : i;
        });
      }
      propsCopy[prop] = ValueObject.isValueObject(item) ? item.raw() : item;
    }

    return propsCopy;
  }
}
