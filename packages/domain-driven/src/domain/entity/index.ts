import type { EntityId, Records } from "@techmely/types";
import { isEmpty } from "@techmely/utils";
import { Result } from "../../utils";
import type { IResult } from "../../utils/result/types";
import type { BaseEntityProps, EntityConfig, EntityPort, EntityProps } from "./types";
import { UniqueEntityID } from "./unique-entity";

const BASE_MAX_PROPS = 32;
const defaultEntityConfig: EntityConfig = {
  maxProps: BASE_MAX_PROPS,
  debug: Boolean(process.env.DEBUG) || false,
};

class Entity<Props extends EntityProps> implements EntityPort<Props> {
  readonly #id: UniqueEntityID | EntityId;
  readonly #createdAt: Date;
  readonly #updatedAt: Date;
  readonly #props: Props;
  readonly #config: EntityConfig;

  constructor(request: EntityProps, config?: EntityConfig) {
    const [isValid, error] = this.validateBusinessRules(request);
    if (!isValid) throw error;
    const { id, createdAt, updatedAt, ...props } = request;
    this.#id = id || UniqueEntityID.create();
    const now = new Date();
    this.#createdAt = createdAt || now;
    this.#updatedAt = updatedAt || now;
    this.#props = props as any;
    this.#config = config || defaultEntityConfig;
  }

  static isEntity(entity: unknown): entity is Entity<any> {
    return entity instanceof Entity;
  }

  static isValidProps(
    props: unknown,
    config: EntityConfig = defaultEntityConfig,
  ): [boolean, Error | undefined] {
    if (isEmpty(props)) {
      if (config.debug) console.error("Entity props should not be empty");
      return [false, Error("Entity props should not be empty")];
    }
    if (typeof props !== "object") {
      if (config.debug) console.error("Entity props should be and object");
      return [false, Error("Entity props should be and object")];
    }
    if (Object.keys(props as any).length >= config.maxProps) {
      const errMessage = `The entity props count must smaller than ${config.maxProps} properties`;
      if (config.debug) console.error(errMessage);
      return [false, Error(errMessage)];
    }
    return [true, undefined];
  }

  public static create(props: EntityProps, config?: EntityConfig): IResult<any, any, any>;
  /**
   *
   * @param props params as Props
   * @param id optional uuid as string in props. If not provided on props a new one will be generated.
   * @returns instance of result with a new Entity on state if success.
   * @summary result state will be `null` case failure.
   */
  public static create(props: EntityProps, config?: EntityConfig): Result<any, any, any> {
    const [_, err] = Entity.isValidProps(props);
    if (err)
      return Result.fail(`Invalid props to create an instance of ${Entity.name}: `, err?.message);
    try {
      const entity = new Entity(props, config);
      return Result.Ok(entity);
    } catch (err) {
      return Result.fail(`Invalid business rules(instance of ${Entity.name}: ${err}`);
    }
  }

  get id(): UniqueEntityID | EntityId {
    return this.#id;
  }

  get createdAt(): Date {
    return this.#createdAt;
  }

  get updatedAt(): Date {
    return this.#updatedAt;
  }

  getProps(): Props & BaseEntityProps {
    const clone = {
      ...this.#props,
      id: this.id,
      createdAt: this.#createdAt,
      updatedAt: this.#updatedAt,
    };
    return Object.freeze(clone);
  }

  /**
   * @description Get hash to identify the entity.
   */
  hashCode(): UniqueEntityID {
    const instance = Reflect.getPrototypeOf(this);
    return new UniqueEntityID(`[Entity@${instance?.constructor?.name}]:${this.#id}`);
  }

  /**
   * @description Get a new instanced based on current Entity.
   * @summary if not provide an id a new one will be generated.
   * @param props as optional Entity Props.
   * @returns new Entity instance.
   */
  clone(props?: Partial<Props>): this {
    const _props = props ? { ...this.#props, ...props } : this.#props;
    const instance = Reflect.getPrototypeOf(this);
    if (!instance) throw new Error("Cannot get prototype of this entity instance");
    const entity = Reflect.construct(instance.constructor, [_props, this.#config]);
    return entity;
  }

  /**
   * Convert an Entity and all sub-entities/Value Objects it
   * contains to a plain object with primitive types. Can be
   * useful when logging an entity during testing/debugging
   */
  toObject(): Records {
    const clone = this.#convertPropsToObject(this.getProps());

    const result = {
      id: this.id,
      createdAt: this.#createdAt,
      updatedAt: this.#updatedAt,
      ...clone,
    };
    return Object.freeze(result);
  }

  #convertPropsToObject(props: Props & BaseEntityProps) {
    const propsCopy = structuredClone(props) as any;
    for (const prop in propsCopy) {
      const item = propsCopy[prop];
      if (Array.isArray(item)) {
        propsCopy[prop] = item.map((i) => {
          return Entity.isEntity(i) ? i.toObject() : i;
        });
      }
      propsCopy[prop] = Entity.isEntity(item) ? item.toObject() : item;
    }

    return propsCopy;
  }

  validateBusinessRules(_request: EntityProps): [boolean, Error | undefined] {
    return [true, undefined];
  }
}

export { Entity, UniqueEntityID };
