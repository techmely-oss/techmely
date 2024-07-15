import type { ContextEventName } from "../context/types";

export type DomainMetrics = {
  totalEvents: () => number;
  totalDispatched: () => number;
};

type HandlerArgs<T> = [T, [DomainEvent<T>, ...any[]]];

export type DomainEventPromiseHandler<T> = (...args: HandlerArgs<T>) => Promise<void>;

type NormalHandler<T> = (...args: HandlerArgs<T>) => void;

export type DomainEventHandler<T> = DomainEventPromiseHandler<T> | NormalHandler<T>;

export type DomainEventOptions = {
  priority: number;
};

export type DomainEvent<T> = {
  name: ContextEventName;
  handler: DomainEventHandler<T>;
  options: DomainEventOptions;
};

export interface DomainEventPort<T> {
  dispatch(name: ContextEventName, ...args: unknown[]): void | Promise<void>;
  add(name: ContextEventName, handler: DomainEventHandler<T>, options?: DomainEventOptions): void;
  clear(): void;
  remove(name: ContextEventName): void;
  dispatchEvents(): Promise<void>;
}

export abstract class AggregateEventHandler<T> {
  constructor(readonly params: DomainEvent<T>) {
    if (typeof params.name !== "string") throw new Error("Event name must be a string");
    this.dispatch = this.dispatch.bind(this);
  }

  abstract dispatch(aggregate: T, args: [DomainEvent<T>, any[]]): void;
  abstract dispatch(...args: HandlerArgs<T>): void;
}
