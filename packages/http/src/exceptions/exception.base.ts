export class ExceptionBase extends Error {
  /**
   * @param {string} exMessage
   *
   * @param {number} statusCode
   *
   * ^ Consider adding optional `metadata` object to
   * exceptions (if language doesn't support anything
   * similar by default) and pass some useful technical
   * information about the exception when throwing.
   * This will make debugging easier.
   * @param {Record<string, any>} [metadata={}]
   *
   * **BE CAREFUL** not to include sensitive info in 'metadata'
   * to prevent leaks since all exception's data will end up
   * in application's log files. Only include non-sensitive
   * info that may help with debugging.
   */
  constructor(
    readonly exMessage: string,
    readonly statusCode: number,
    readonly code: string,
    readonly metadata?: Record<string, any>,
  ) {
    super(exMessage);
  }

  toJSON() {
    return {
      message: this.exMessage,
      statusCode: this.statusCode,
      code: this.code,
      stack: this.stack,
      cause: JSON.stringify(this.cause),
      metadata: this.metadata,
    };
  }
}
