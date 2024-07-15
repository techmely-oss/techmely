export type ContextEventName<
  ContextName extends string = string,
  EventName extends string = string,
> = `${ContextName}:${EventName}`;

export type EventPort = {
  detail: unknown[];
};

export abstract class EventContextManager {
  abstract subscribe(name: ContextEventName, fn: (event: EventPort) => void | Promise<void>): void;
  abstract exists(name: ContextEventName): boolean;
  abstract remove(name: ContextEventName): boolean;
  abstract dispatch(name: ContextEventName, ...args: unknown[]): void;
}

export type EventType = { name: string; callback: (...args: any[]) => void | Promise<void> };
