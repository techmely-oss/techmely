import { delaySignal, isSupportsRequestStreams, mergeDeep } from "@techmely/utils";
import {
  HTTP_NO_CONTENT,
  HTTP_REQUEST_ENTITY_TOO_LARGE,
  HttpError,
  TimeOutException,
} from "./exceptions";
import { type HttpMethod, RESPONSE_TYPES } from "./http.const";
import type {
  HttpFetchHookOptions,
  HttpFetchOptions,
  HttpHooks,
  HttpInput,
  HttpInternalOptions,
  HttpTimeoutOptions,
  ResponsePromise,
} from "./http.types";
import { fetchTimeOut, mergeHttpHeaders, normalizeHttpRetryOptions } from "./http.utils";

const RETRY_AFTER_MILLISECONDS = 1000;
const MAX_SAFE_TIMEOUT = 2_147_483_647;
const SEARCH_PARAMS_REG = /(?:\?.*?)?(?=#|$)/;

export class Http {
  #retryCount = 0;
  #abortController = new globalThis.AbortController();
  #input: HttpInput;
  #options: HttpInternalOptions;
  request: Request;

  static create(input: HttpInput, options: HttpFetchOptions): ResponsePromise {
    const http = new Http(input, options);
    async function fetchFn(): Promise<Response> {
      // Delay the fetch so that body method shortcuts can set the Accept Header
      await Promise.resolve();
      let response = await http.#fetch();
      for (const hook of http.#options.hooks.afterResponse) {
        const hookedRes = await hook(
          http.request,
          http.#options as unknown as HttpFetchHookOptions,
          http.#jsonifyResponse(response.clone()),
        );
        if (hookedRes instanceof globalThis.Response) {
          response = hookedRes;
        }
      }
      http.#jsonifyResponse(response);
      if (!response.ok) {
        let error = new HttpError(response, http.request, http.#options);
        for (const hook of http.#options.hooks.beforeError) {
          error = await hook(error);
        }
        throw error;
      }
      return response;
    }
    const isRetriableMethod = http.#options.retry.methods.includes(
      http.request.method.toLowerCase(),
    );
    const result = (isRetriableMethod
      ? http.#retry(fetchFn)
      : fetchFn) as unknown as ResponsePromise;
    for (const [type, mineType] of Object.entries(RESPONSE_TYPES)) {
      result[type] = async () => {
        http.request.headers.set("accept", http.request.headers.get("accept") || mineType);
        const awaitedRes = await result;
        const response = awaitedRes.clone();
        if (type === "json") {
          if (response.status === HTTP_NO_CONTENT) return "";
          const arrayBuffer = await response.clone().arrayBuffer();
          const responseSize = arrayBuffer.byteLength;
          if (responseSize === 0) return "";
          if (options.parseJson) {
            return options.parseJson(await response.text());
          }
        }
        return response[type]();
      };
    }
    return result;
  }

  constructor(input: HttpInput, options: HttpFetchOptions = {}) {
    this.#validateProps(input, options);
    this.#input = input;
    const defaultHooks: HttpHooks = {
      beforeRequest: [],
      beforeRetry: [],
      beforeError: [],
      afterResponse: [],
    };
    const hooks = (options.hooks
      ? mergeDeep(defaultHooks, options.hooks)
      : defaultHooks) as unknown as Required<HttpHooks>;

    this.#options = {
      ...options,
      headers: mergeHttpHeaders((this.#input as Request).headers, options.headers),
      method: options.method || ((this.#input as Request).method as HttpMethod),
      retry: normalizeHttpRetryOptions(options.retry),
      timeout: options.timeout || 10000,
      $fetch: options.$fetch || globalThis.fetch.bind(globalThis),
      hooks,
      signal: this.#abortController.signal,
    };

    if (typeof this.#input !== 'string' && !(this.#input instanceof URL || this.#input instanceof globalThis.Request)) {
			throw new TypeError('`input` must be a string, URL, or Request');
		}

    if (this.#options.baseUrl && typeof this.#input === 'string') {
      if (this.#input.startsWith('/')) {
				throw new Error('`input` must not begin with a slash when using `prefixUrl`');
			}

			if (typeof this.#options.baseUrl === 'string' && !this.#options.baseUrl.endsWith('/')) {
				this.#options.baseUrl += '/';
			}

			this.#input = this.#options.baseUrl + this.#input     ;
    }

    this.#options.signal?.addEventListener("abort", () => {
      this.#abortController.abort(this.#options.signal?.reason);
    });
    if (isSupportsRequestStreams()) {
      // @ts-expect-error - Types are outdated.
      this.#options.duplex = "half";
    }

    this.request = new globalThis.Request(this.#input, this.#options);
    if (this.#options.searchParams) {
      const textSearch = new URLSearchParams(
        this.#options.searchParams as unknown as Record<string, any>,
      ).toString();
      const searchParams = `?${textSearch}`;
      const url = this.request.url.replace(SEARCH_PARAMS_REG, searchParams);

      // The spread of `this.request` is required as otherwise it misses the `duplex` option for some reason and throws.
      this.request = new globalThis.Request(
        new globalThis.Request(url, { ...this.request }),
        this.#options,
      );
    }

    if (this.#options.json !== undefined) {
      this.#options.body = JSON.stringify(this.#options.json);
      this.request.headers.set(
        "content-type",
        this.request.headers.get("content-type") ?? "application/json",
      );
      this.request = new globalThis.Request(this.request, { body: this.#options.body });
    }
  }

  async #fetch() {
    for (const hook of this.#options.hooks.beforeRequest) {
      const result = await hook(this.request, this.#options as HttpFetchHookOptions);
      if (result instanceof Request) {
        this.request = result;
        break;
      }
      if (result instanceof Response) {
        return result;
      }
    }
    if (this.#options.timeout === false && this.#options.$fetch) {
      return this.#options.$fetch(this.request.clone(), this.#options);
    }

    return fetchTimeOut(
      this.request.clone(),
      this.#options,
      this.#abortController,
      this.#options as unknown as HttpTimeoutOptions,
    );
  }

  async #retry<T extends (...arguments_: any) => Promise<any>>(
    fn: T,
  ): Promise<ReturnType<T> | void> {
    try {
      return await fn();
    } catch (err) {
      const ms = Math.min(this.#calculateRetryDelay(err), MAX_SAFE_TIMEOUT);
      if (ms !== 0 && this.#retryCount > 0) {
        await delaySignal(ms, { signal: this.#options.signal });
        for (const hook of this.#options.hooks.beforeRetry) {
          await hook({
            request: this.request as unknown as HttpFetchHookOptions,
            options: this.#options,
            error: err,
            retryCount: this.#retryCount,
          });
        }
        return this.#retry(fn);
      }
      throw err;
    }
  }

  #calculateRetryDelay(error: unknown) {
    this.#retryCount++;
    if (this.#retryCount <= this.#options.retry.limit && !(error instanceof TimeOutException)) {
      if (error instanceof HttpError) {
        if (!this.#options.retry.statusCodes.includes(error.response.status)) {
          return 0;
        }
        const retryAfter = error.response.headers.get("Retry-After");
        if (retryAfter && this.#options.retry.afterStatusCodes.includes(error.response.status)) {
          let after = +retryAfter;
          if (Number.isNaN(after)) {
            after = Date.parse(retryAfter) - Date.now();
          } else {
            after *= RETRY_AFTER_MILLISECONDS;
          }
          if (
            this.#options.retry.maxRetryAfter !== undefined &&
            after > this.#options.retry.maxRetryAfter
          ) {
            return 0;
          }
          return after;
        }
        if (error.response.status === HTTP_REQUEST_ENTITY_TOO_LARGE) {
          return 0;
        }
      }
      const retryDelay = this.#options.retry.delay(this.#retryCount);
      return Math.min(this.#options.retry.backoffLimit, retryDelay);
    }
    return 0;
  }

  #jsonifyResponse(response: Response): Response {
    const parser = this.#options.parseJson;
    if (parser) {
      response.json = async () => parser(await response.text());
    }
    return response;
  }

  async #validateProps(input: HttpInput, _options: HttpFetchOptions) {
    if (
      !input ||
      (typeof input !== "string" && !(input instanceof URL || input instanceof globalThis.Request))
    ) {
      throw new Error("`input must be a string, URL, or Request`");
    }
  }
}
