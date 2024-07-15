import type { EntityId, Records } from "@techmely/types";
import type { UniqueEntityID } from "./unique-entity";

export interface BaseEntityProps {
  id: UniqueEntityID | EntityId;
  createdAt: Date;
  updatedAt: Date;
}

export interface EntityProps extends Partial<BaseEntityProps>, Record<string, any> {}

export type EntityConfig = {
  maxProps: number;
  debug: boolean;
};

export interface EntityPort<Props> {
  get id(): UniqueEntityID | EntityId;
  /**
   * @description Get hash to identify the entity.
   * @example
   * `[Entity@ClassName]:UUID`
   */
  hashCode(): UniqueEntityID | EntityId;
  /**
   * @description Get a new instanced based on current Entity.
   */
  clone(): EntityPort<Props>;
  /**
   * @description Get value as object from entity.
   */
  toObject(): Records;
}
