import type { Entity } from "../domain";
import type { EntityProps } from "../domain/entity/types";

export interface DomainMapper<
  Props extends EntityProps,
  DbRecord,
  DomainEntity extends Entity<Props>,
  Response = unknown,
> {
  toPersistence(entity: DomainEntity): DbRecord;
  toDomain(record: DbRecord): DomainEntity;
  toResponse(entity: DomainEntity): Response;
}
