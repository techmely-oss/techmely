import type { EntityId } from "@techmely/types";
import { generatePrefixId } from "@techmely/utils/id";

export class UniqueEntityID {
  protected readonly id: EntityId;

  constructor(_id?: EntityId) {
    this.id = _id || generatePrefixId("ett");
  }

  /**
   * @description Create a short id.
   * @param id value as string optional.If you do not provide a value a new uuid value will be generated.
   * @returns instance of ID.
   */
  static create(id?: EntityId): UniqueEntityID {
    return new UniqueEntityID(id);
  }

  equal(_id?: UniqueEntityID): boolean {
    if (!_id) {
      return false;
    }
    if (!(_id instanceof this.constructor)) {
      return false;
    }
    return _id.toValue() === this.id;
  }

  toString() {
    return String(this.id);
  }

  toValue(): EntityId {
    return this.id;
  }
}
