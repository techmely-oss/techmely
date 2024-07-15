import type { Records } from "@techmely/types";
import type { HttpFetchOptions } from "../http.types";
import { ExceptionBase } from "./exception.base";
import {
  CODE_ARGUMENT_INVALID,
  CODE_ARGUMENT_NOT_PROVIDED,
  CODE_ARGUMENT_OUT_OF_RANGE,
  CODE_CONFLICT,
  CODE_INTERNAL_SERVER_ERROR,
  CODE_NOT_FOUND,
  CODE_TIMEOUT,
  HTTP_BAD_REQUEST,
  HTTP_CONFLICT,
  HTTP_INTERNAL_SERVER_ERROR,
  HTTP_NOT_FOUND,
  HTTP_REQUEST_TIMEOUT,
} from "./exception.codes";

/**
 * Used to indicate that an argument was not provided (is empty object/array, null of undefined).
 *
 * @class ArgumentNotProvidedException
 * @default { message = "Argument not provided" }
 * @extends {ExceptionBase}
 */
export class ArgumentNotProvidedException extends ExceptionBase {
  constructor(message = "Argument not provided", metadata?: Records) {
    super(message, HTTP_BAD_REQUEST, CODE_ARGUMENT_NOT_PROVIDED, metadata);
  }
}

/**
 * Used to indicate that an incorrect argument was provided to a method/function/class constructor
 *
 * @class ArgumentInvalidException
 * @default { message = "Argument invalid" }
 * @extends {ExceptionBase}
 */
export class ArgumentInvalidException extends ExceptionBase {
  constructor(message = "Argument invalid", metadata?: Records) {
    super(message, HTTP_BAD_REQUEST, CODE_ARGUMENT_INVALID, metadata);
  }
}

/**
 * Used to indicate that an argument is out of allowed range
 * (for example: incorrect string/array length, number not in allowed min/max range etc)
 *
 * @class ArgumentOutOfRangeException
 * @default { message = "Argument out of range" }
 * @extends {ExceptionBase}
 */
export class ArgumentOutOfRangeException extends ExceptionBase {
  constructor(message = "Argument out of range", metadata?: Records) {
    super(message, HTTP_BAD_REQUEST, CODE_ARGUMENT_OUT_OF_RANGE, metadata);
  }
}

/**
 * Used to indicate conflicting entities (usually in the database)
 *
 * @class ConflictException
 * @default { message = "Argument out of range" }
 * @extends {ExceptionBase}
 */
export class ConflictException extends ExceptionBase {
  constructor(message = "Conflict", metadata?: Records) {
    super(message, HTTP_CONFLICT, CODE_CONFLICT, metadata);
  }
}

/**
 * Used to indicate that entity is not found
 *
 * @class NotFoundException
 * @extends {ExceptionBase}
 */
export class NotFoundException extends ExceptionBase {
  constructor(message = "Not found", metadata?: Records) {
    super(message, HTTP_NOT_FOUND, CODE_NOT_FOUND, metadata);
  }
}

export class TimeOutException extends ExceptionBase {
  constructor(message = "Request timeout", metadata?: Records) {
    super(message, HTTP_REQUEST_TIMEOUT, CODE_TIMEOUT, metadata);
  }
}

/**
 * Used to indicate an internal server error that does not fall under all other errors
 *
 * @class InternalServerErrorException
 * @extends {ExceptionBase}
 */
export class InternalServerErrorException extends ExceptionBase {
  constructor(message = "Internal server error", metadata?: Records) {
    super(message, HTTP_INTERNAL_SERVER_ERROR, CODE_INTERNAL_SERVER_ERROR, metadata);
  }
}

export class HttpError extends ExceptionBase {
  response: Response;
  request: Request;
  options: HttpFetchOptions;

  constructor(response: Response, request: Request, options: HttpFetchOptions) {
    const message = response.statusText;
    super(message, response.status, "", options?.metadata);
    this.name = "HttpApiError";
    this.request = request;
    this.response = response;
    this.options = options;
  }
}
