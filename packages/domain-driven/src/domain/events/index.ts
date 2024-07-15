import { validateContextEventName } from "../context/context.utils";
import type { ContextEventName } from "../context/types";
import type {
  DomainEvent,
  DomainEventHandler,
  DomainEventOptions,
  DomainEventPort,
  DomainEventPromiseHandler,
  DomainMetrics,
} from "./types";

export class DomainEvents<T> implements DomainEventPort<T> {
  #metrics: DomainMetrics;
  #events: DomainEvent<T>[];
  #totalDispatched: number;

  constructor(private readonly aggregate: T) {
    this.#events = [];
    this.#totalDispatched = 0;
    this.#metrics = {
      totalDispatched: () => this.#totalDispatched,
      totalEvents: () => this.#events.length,
    };
  }

  get metrics(): DomainMetrics {
    return this.#metrics;
  }

  /**
   * Dispatches an event.
   * @param {ContextEventName} name - The name of the event to dispatch.
   * @param {unknown[]} args - Any param user wants provide as argument.
   * @returns The result of the event handler function.
   */
  dispatch(name: ContextEventName, ...args: unknown[]): void | Promise<void> {
    const event = this.#events.find((e) => e.name === name);
    if (!event) return;
    this.#totalDispatched += 1;
    event.handler(this.aggregate, [event, ...args]);
    this.remove(name);
  }

  add(
    name: ContextEventName,
    handler: DomainEventHandler<T>,
    _options?: DomainEventOptions | undefined,
  ): void {
    validateContextEventName(name);
    if (typeof handler !== "function")
      throw new Error(`Add event handler for ${name} must be a function`);
    const options: DomainEventOptions = _options ? _options : { priority: this.#getPriority() };
    this.remove(name);
    this.#events.push({ name, handler, options });
  }
  /**
   * Clears all events.
   */
  clear(): void {
    this.#events = [];
  }

  /**
   * Removes an event by name.
   * @param eventName - The name of the event to remove.
   */
  remove(name: ContextEventName): void {
    this.#events = this.#events.filter((e) => e.name !== name);
  }

  async dispatchEvents(): Promise<void> {
    const pEvents: DomainEventPromiseHandler<T>[] = [];
    const sortedEvents = this.#events.sort((a, b) => a.options.priority - b.options.priority);
    for (const event of sortedEvents) {
      this.#totalDispatched += 1;
      const fn = event.handler(this.aggregate, [event]);
      if (fn instanceof Promise) {
        pEvents.push(fn as unknown as DomainEventPromiseHandler<T>);
      }
    }
    /**
     * This is a happy case we assume that all promises run well
     * We might improve this workflow bcs might be some case not success will effect to all the promises
     */
    try {
      await Promise.all(pEvents);
    } catch (error) {
      console.error(error);
    } finally {
      this.clear();
    }
  }

  #getPriority() {
    const totalEvents = this.#events.length;
    if (totalEvents <= 1) return 2;
    return totalEvents;
  }
}
