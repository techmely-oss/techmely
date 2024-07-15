import type { ContextEventName } from "./types";

const message =
  'Validation failed: Event name must follow the pattern "contextName:EventName". Please ensure to include a colon (":") in the event name to separate the context name and the event name itself.';
export const WILDCARD_EVENT_ALIAS = "*";

export function validateContextEventName(eventName: ContextEventName) {
  if (!eventName.includes(":")) throw new Error(message);
}
