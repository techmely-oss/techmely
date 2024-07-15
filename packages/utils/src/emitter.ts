/** All borrow from https://github.com/developit/mitt/blob/main/src/index.ts */

export type EventType = string | symbol;

// An event handler can take an optional event argument
// and should not return a value
export type Handler<T = unknown> = (event: T) => void;
export type WildcardHandler<T = Record<string, unknown>> = (
  type: keyof T,
  event: T[keyof T],
) => void;

export type EventHandlerList<T = unknown> = Handler<T>[];
export type WildCardEventHandlerList<T = Record<string, unknown>> = WildcardHandler<T>[];

// A map of event types and their corresponding event handlers.
export type EventHandlerMap<Events extends Record<EventType, unknown>> = Map<
  keyof Events | "*",
  EventHandlerList<Events[keyof Events]> | WildCardEventHandlerList<Events>
>;

export interface Emitter<Events extends Record<EventType, unknown>> {
  events: EventHandlerMap<Events>;

  on<Key extends keyof Events>(type: Key, handler: Handler<Events[Key]>): void;
  on(type: "*", handler: WildcardHandler<Events>): void;

  off<Key extends keyof Events>(type: Key, handler?: Handler<Events[Key]>): void;
  off(type: "*", handler: WildcardHandler<Events>): void;

  emit<Key extends keyof Events>(type: Key, event: Events[Key]): void;
  emit<Key extends keyof Events>(type: undefined extends Events[Key] ? Key : never): void;
}

function emitter<Events extends Record<EventType, unknown>>(
  all?: EventHandlerMap<Events>,
): Emitter<Events> {
  type _Key = keyof Events;
  type GenericHandler = Handler<Events[_Key]> | WildcardHandler<Events>;
  /**
   * A Map of event names to registered handler functions.
   */
  const events = all || new Map();

  const getHandlers = (type: _Key) => events.get(type) as GenericHandler[] | undefined;

  /**
   * Register an event handler for the given type.
   * @param {string|symbol} type Type of event to listen for, or `'*'` for all events
   * @param {Function} handler Function to call in response to given event
   * @memberOf mitt
   */
  function on(type: _Key, handler: GenericHandler) {
    const handlers = getHandlers(type);
    if (handlers) {
      handlers.push(handler);
    } else {
      events.set(type, [handler]);
    }
  }

  /**
   * Remove an event handler for the given type.
   * @param {string|symbol} type Type of event to unregister `handler` from (`'*'` to remove a wildcard handler)
   * @param {Function} [handler] Handler function to remove
   * @memberof emitter
   */
  function off(type: _Key, handler?: GenericHandler) {
    const handlers = getHandlers(type);
    if (handlers) {
      if (handler) {
        const indexHandler = handlers.indexOf(handler) >>> 0;
        handlers.splice(indexHandler, 1);
      } else {
        events.set(type, []);
      }
    }
  }

  function emit(type: _Key, event?: Events[_Key]) {
    let handlers = getHandlers(type) as EventHandlerList<Events[_Key]>;
    if (handlers) {
      for (const handler of handlers) {
        if (event) handler(event);
      }
    }
    handlers = events.get("*");
    if (handlers) {
      for (const handler of handlers as unknown as WildCardEventHandlerList<Events>) {
        if (event) handler(type, event);
      }
    }
  }

  return {
    events,
    on,
    off,
    emit,
  };
}

export { emitter };
export default emitter;
