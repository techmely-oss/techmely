import type { Headers } from "undici-types";
import { TimeOutException } from "./exceptions";
import { httpDefaultRetry, httpRetryStatusCodes } from "./http.const";
import type { HttpHeadersInit, HttpRetryOptions, HttpTimeoutOptions } from "./http.types";

export const normalizeHttpRetryOptions = (
  retry: number | HttpRetryOptions = {},
): Required<HttpRetryOptions> => {
  if (typeof retry === "number") {
    return {
      ...httpDefaultRetry,
      limit: retry,
    };
  }

  if (retry.methods && !Array.isArray(retry.methods)) {
    throw new Error("retry.methods must be an array");
  }

  if (retry.statusCodes && !Array.isArray(retry.statusCodes)) {
    throw new Error("retry.statusCodes must be an array");
  }

  return {
    ...httpDefaultRetry,
    ...retry,
    afterStatusCodes: httpRetryStatusCodes,
  };
};

function createHeaders(source: HttpHeadersInit = {}) {
  return new globalThis.Headers(source as RequestInit["headers"]) as unknown as Headers;
}

export const mergeHttpHeaders = (source1: HttpHeadersInit = {}, source2: HttpHeadersInit = {}) => {
  const result = createHeaders(source1);
  const isHeadersInstance = source2 instanceof globalThis.Headers;
  const source = createHeaders(source2);

  for (const [key, value] of source.entries()) {
    if ((isHeadersInstance && value === "undefined") || value === undefined) {
      result.delete(key);
    } else {
      result.set(key, value);
    }
  }

  return result as any;
};

export const fetchTimeOut = async (
  request: Request,
  init: RequestInit,
  abortController: AbortController | null,
  options: HttpTimeoutOptions,
): Promise<Response> => {
  return new Promise((resolve, reject) => {
    const timeoutId = setTimeout(() => {
      if (abortController) {
        abortController.abort();
      }
      reject(new TimeOutException(JSON.stringify(request)));
    }, options.timeout);

    options
      .fetch(request, init)
      .then(resolve)
      .catch(reject)
      .then(() => {
        clearTimeout(timeoutId);
      });
  });
};
