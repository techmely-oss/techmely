const prefix = "Invariant failed";

/**
 * Throw an error if the condition fails
 * Strip out error messages for production
 * > Not providing an inline default argument for message as the result is smaller
 */

export function invariant(condition: any, message?: string | (() => string)): asserts condition;
export function invariant(condition: any, exception?: any): asserts condition;
export function invariant(
  condition: any,
  /**
   * Can provide a string, a function, or an Error Class that returns a string for cases where
   * the message takes a fair amount of effort to compute
   */
  message?: string | (() => string),
): asserts condition {
  if (condition) {
    return;
  }
  // Condition not passed

  // When not in production we allow the message to pass through
  // *This block will be removed in production builds*
  if (typeof message === "string" || typeof message === "function") {
    const provided = typeof message === "function" ? message() : message;
    // Options:
    // 1. message provided: `${prefix}: ${provided}`
    // 2. message not provided: prefix
    const value = provided ? `${prefix}: ${provided}` : prefix;
    throw new Error(value);
  }

  /**
   * Custom error class
   */
  if (message) throw message;
  throw new Error(prefix);
}
