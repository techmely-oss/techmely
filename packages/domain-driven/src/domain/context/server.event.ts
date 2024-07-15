import type { EventEmitter } from "node:events";
import { WILDCARD_EVENT_ALIAS, validateContextEventName } from "./context.utils";
import type { ContextEventName, EventContextManager, EventPort, EventType } from "./types";

export class ServerEventManager implements EventContextManager {
  #events: EventType[];
  static #instance: ServerEventManager;
  readonly #emitter: EventEmitter;

  private constructor(emitter: EventEmitter) {
    this.#events = [];
    if (typeof global?.process === "undefined") {
      throw new Error("ServerEventManager is not supported");
    }
    this.#emitter = emitter;
  }

  static instance(emitter: EventEmitter): ServerEventManager {
    if (ServerEventManager.#instance) return ServerEventManager.#instance;
    ServerEventManager.#instance = new ServerEventManager(emitter);
    return ServerEventManager.#instance;
  }

  subscribe(name: ContextEventName, fn: (event: EventPort) => void | Promise<void>): void {
    validateContextEventName(name);
    if (this.exists(name)) return;
    this.#events.push({ name, callback: fn });
    this.#emitter.addListener(name, fn);
  }

  exists(name: ContextEventName): boolean {
    const count = this.#emitter.listenerCount(name);
    const hasListener = count > 0;
    const hasLocal = !!this.#findEvent(name);
    return hasListener || hasLocal;
  }

  remove(name: ContextEventName): boolean {
    const event = this.#findEvent(name);
    if (!event) return false;

    this.#events = this.#events.filter((event): boolean => event.name !== name);
    this.#emitter.removeListener(name, event.callback);
    return true;
  }

  dispatch(name: ContextEventName, ...args: unknown[]): void {
    validateContextEventName(name);
    if (name.includes(WILDCARD_EVENT_ALIAS)) {
      const regex = new RegExp(name.replace(WILDCARD_EVENT_ALIAS, ".*"));
      for (const event of this.#events) {
        const match = regex.test(event.name);
        if (match) {
          this.#emitter.emit(event.name, args);
        }
      }
    }
    this.#emitter.emit(name, { detail: args || [] });
  }

  #findEvent(name: ContextEventName) {
    const event = this.#events.find((e) => e.name === name);
    return event;
  }
}
