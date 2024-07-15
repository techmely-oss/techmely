import type EventEmitter from "node:events";
import type { ContextEventName, EventContextManager } from "../context/types";
import type { EntityConfig } from "../entity/types";
import type { UniqueEntityID } from "../entity/unique-entity";
import type {
  AggregateEventHandler,
  DomainEventHandler,
  DomainEventOptions,
} from "../events/types";

export type AggregateConfig = {
  emitter: EventEmitter;
} & EntityConfig;

export type AggregateClearEventsConfig = {
  resetMetrics: boolean;
};

export interface AggregatePort<T> {
  hashCode(): UniqueEntityID;
  context(): EventContextManager;
  clone(props?: unknown): this;
  dispatchEvent(name: ContextEventName, ...args: unknown[]): void;
  dispatchAll(): Promise<void>;
  clearEvents(config: AggregateClearEventsConfig): void;
  addEvent(event: DomainEventHandler<this>): void;
  addEvent(
    name: ContextEventName,
    handler: DomainEventHandler<this>,
    options?: DomainEventOptions,
  ): void;
  addEvent(
    nameOrEvent: ContextEventName | AggregateEventHandler<this>,
    handler: DomainEventHandler<this>,
    options?: DomainEventOptions,
  ): void;
  removeEvent(name: ContextEventName): number;
}

export interface DomainEventMetrics {
  current: number;
  total: number;
  dispatch: number;
}
