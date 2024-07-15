import { WILDCARD_EVENT_ALIAS, validateContextEventName } from "./context.utils";
import type { ContextEventName, EventContextManager, EventPort, EventType } from "./types";

const SS_DDD_NAME_PREFIX = "ddd";

export class BrowserEventManager implements EventContextManager {
  #events: EventType[];
  static #instance: BrowserEventManager;

  private constructor(private readonly _window: Window & typeof globalThis) {
    this.#events = [];
    if (typeof this._window === "undefined") {
      throw new Error("BrowserEventManager need run into browser runtime");
    }
  }

  static instance(window: Window & typeof globalThis): BrowserEventManager {
    if (BrowserEventManager.#instance) return BrowserEventManager.#instance;
    BrowserEventManager.#instance = new BrowserEventManager(window);
    return BrowserEventManager.#instance;
  }

  subscribe(name: ContextEventName, fn: (event: EventPort) => void | Promise<void>): void {
    validateContextEventName(name);
    if (this.exists(name)) return;
    this.#events.push({ name, callback: fn });
    this._window.sessionStorage.setItem(getSSEventName(name), Date.now().toString());
    this._window.addEventListener(name, fn as unknown as VoidFunction);
    this._window.addEventListener("beforeunload", () => {
      this._window.sessionStorage.removeItem(getSSEventName(name));
    });
  }

  exists(name: ContextEventName): boolean {
    const existsOnWindow = !!this._window.sessionStorage.getItem(getSSEventName(name));
    const existsInternal = !!this.#findEvent(name);
    return existsOnWindow || existsInternal;
  }

  remove(name: ContextEventName): boolean {
    const event = this.#findEvent(name);
    if (!event) return false;

    this._window.sessionStorage.removeItem(getSSEventName(name));
    this.#events = this.#events.filter((event): boolean => event.name !== name);
    this._window.removeEventListener(name, event.callback);
    return true;
  }

  dispatch(name: ContextEventName, ...args: unknown[]): void {
    validateContextEventName(name);
    if (name.includes(WILDCARD_EVENT_ALIAS)) {
      const regex = new RegExp(name.replace(WILDCARD_EVENT_ALIAS, ".*"));
      for (const event of this.#events) {
        const match = regex.test(event.name);
        if (match) {
          this._window.dispatchEvent(
            new this._window.CustomEvent(event.name, {
              bubbles: true,
              detail: args || [],
            }),
          );
        }
      }
    }
    this._window.dispatchEvent(
      new this._window.CustomEvent(name, {
        bubbles: true,
        detail: args || [],
      }),
    );
  }

  #findEvent(name: ContextEventName) {
    const event = this.#events.find((e) => e.name === name);
    return event;
  }
}

function getSSEventName(name: ContextEventName) {
  return `${SS_DDD_NAME_PREFIX}:${name}`;
}
