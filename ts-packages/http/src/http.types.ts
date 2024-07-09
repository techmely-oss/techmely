import type { HttpError } from "./exceptions";
import type { HttpMethod } from "./http.const";

export type HttpSearchParamsBase =
  | string
  | string[][]
  | Record<string, string>
  | URLSearchParams
  | undefined;
export type HttpSearchParams =
  | HttpSearchParamsBase
  | Record<string, string | number | boolean>
  | Array<Array<string | number | boolean>>;
export type HttpHeadersInit =
  | NonNullable<RequestInit["headers"]>
  | Record<string, string | undefined>;
export type HttpInput = string | URL | Request;

export type HttpInstance = {
  (url: HttpInput, options?: HttpFetchOptions): ResponsePromise;
  get: (url: HttpInput, options?: HttpFetchOptions) => ResponsePromise;
  post: (url: HttpInput, options?: HttpFetchOptions) => ResponsePromise;
  put: (url: HttpInput, options?: HttpFetchOptions) => ResponsePromise;
  delete: (url: HttpInput, options?: HttpFetchOptions) => ResponsePromise;
  patch: (url: HttpInput, options?: HttpFetchOptions) => ResponsePromise;
  head: (url: HttpInput, options?: HttpFetchOptions) => ResponsePromise;
  create: (defaultOptions?: HttpFetchOptions) => HttpInstance;
  extend: (defaultOptions?: HttpFetchOptions) => HttpInstance;
  readonly stop: typeof stop;
};

export type HttpOptions = {
  /**
	Shortcut for sending JSON. Use this instead of the `body` option.

	Accepts any plain object or value, which will be `JSON.stringify()`'d and sent in the body with the correct header set.
	*/
  json?: unknown;

  /**
	User-defined JSON-parsing function.
	Use-cases:
	1. Parse JSON via the [`bourne` package](https://github.com/hapijs/bourne) to protect from prototype pollution.
	2. Parse JSON with [`reviver` option of `JSON.parse()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse).
  3. Parse JSON via the [`superjson` package](https://github.com/blitz-js/superjson) to safely serialize JavaScript expressions
	@default JSON.parse()
	@example
	```
	import http from '@techmely/http';
	import bourne from '@hapijs/bourne';

	const result = await http('https://api.endpoint.com', {
		parseJson: text => bourne(text)
	}).json();
	```
	*/
  parseJson?: (text: string) => unknown;

  /**
	Search parameters to include in the request URL. Setting this will override all existing search parameters in the input URL.

	Accepts any value supported by [`URLSearchParams()`](https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams/URLSearchParams).
	*/
  searchParams?: HttpSearchParams;

  /**
	  An object representing `limit`, `methods`, `statusCodes` and `maxRetryAfter` fields for maximum retry count, allowed methods, allowed status codes and maximum [`Retry-After`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Retry-After) time.

	  If `retry` is a number, it will be used as `limit` and other defaults will remain in place.

	  If `maxRetryAfter` is set to `undefined`, it will use `options.timeout`. If [`Retry-After`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Retry-After) header is greater than `maxRetryAfter`, it will cancel the request.

	  By default, delays between retries are calculated with the function `0.3 * (2 ** (attemptCount - 1)) * 1000`, where `attemptCount` is the attempt number (starts from 1), however this can be changed by passing a `delay` function.

	  Retries are not triggered following a timeout.

	  @example
	  ```
	  import http from '@techmely/http';

	  const result = await http('https://api.endpoint.com', {
	  	retry: {
	  		limit: 10,
	  		methods: ['get'],
	  		statusCodes: [413]
	  	}
	  }).json();
	  ```
	*/
  retry?: HttpRetryOptions | number;

  /**
	Timeout in milliseconds for getting a response, including any retries. Can not be greater than 2147483647.
	If set to `false`, there will be no timeout.

	@default 10000
	*/
  timeout?: number | false;

  /**
	Hooks allow modifications during the request lifecycle. Hook functions may be async and are run serially.
	*/
  hooks?: HttpHooks;

  /**
	Hooks allow modifications during the request lifecycle. Hook functions may be async and are run serially.
	*/
  interceptors?: HttpInterceptors;
  /**
	User-defined `fetch` function.
	Has to be fully compatible with the [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) standard.

	Use-cases:
	1. Use custom `fetch` implementations like [`isomorphic-unfetch`](https://www.npmjs.com/package/isomorphic-unfetch).
	2. Use the `fetch` wrapper function provided by some frameworks that use server-side rendering (SSR).

	@default fetch

	@example
	```
	import http from '@techmely/http';
	import $fetch from 'isomorphic-unfetch';

	const json = await http('https://api.endpoint.com', {$fetch}).json();
	```
	*/
  $fetch?: (input: HttpInput, init?: RequestInit) => Promise<Response>;
};

export type HttpFetchOptions = HttpOptions &
  Omit<RequestInit, "headers"> & {
    /**
     * the standard methods (`GET`, `POST`, `PUT`, `PATCH`, `HEAD` and `DELETE`) are upper cased in order to avoid server errors due to case sensitivity.
     */
    method?: HttpMethod;
    headers?: HttpHeadersInit;
    metadata?: Record<string, any>;
  };

export type HttpInternalOptions = Omit<HttpFetchOptions, "hooks" | "retry" | "fetch"> & {
  headers: Headers;
  hooks: Required<HttpHooks>;
  retry: Required<HttpRetryOptions>;
};

/**
 * @description options passed to the `fetch` call and the `beforeRequest` hooks.
 * This must stay an interface so that it can be extended outside of http for use in `http.create`.
 */
export interface HttpFetchHookOptions extends RequestInit {
  // Extended from `RequestInit`, but ensured to be set (not optional).
  method: NonNullable<RequestInit["method"]>;
  credentials?: NonNullable<RequestInit["credentials"]>;

  // Extended from custom `HttpOptions`, but ensured to be set (not optional).
  retry: HttpRetryOptions;
}

export type HttpBeforeRequestHook = (
  request: Request,
  options: HttpFetchHookOptions,
) => Request | Response | void | Promise<Request | Response | void>;

export type HttpAfterResponseHook = (
  request: Request,
  options: HttpFetchHookOptions,
  response: Response,
) => Response | void | Promise<Response | void>;

export type HttpBeforeErrorHook = (error: HttpError) => HttpError | Promise<HttpError>;

export type HttpHooks = {
  /**
	This hook enables you to modify the request right before it is sent. http will make no further changes to the request after this. The hook function receives normalized input and options as arguments. You could, for example, modify `options.headers` here.

	A [`Response`](https://developer.mozilla.org/en-US/docs/Web/API/Response) can be returned from this hook to completely avoid making a HTTP request. This can be used to mock a request, check an internal cache, etc. An **important** consideration when returning a `Response` from this hook is that all the following hooks will be skipped, so **ensure you only return a `Response` from the last hook**.

	@default []
	*/
  beforeRequest?: HttpBeforeRequestHook[];

  /**
	This hook enables you to modify the request right before retry. http will make no further changes to the request after this. The hook function receives an object with the normalized request and options, an error instance, and the retry count. You could, for example, modify `request.headers` here.

	If the request received a response, the error will be of type `HTTPError` and the `Response` object will be available at `error.response`. Be aware that some types of errors, such as network errors, inherently mean that a response was not received. In that case, the error will not be an instance of `HTTPError`.

	You can prevent http from retrying the request by throwing an error. http will not handle it in any way and the error will be propagated to the request initiator. The rest of the `beforeRetry` hooks will not be called in this case. Alternatively, you can return the [`http.stop`](#http.stop) symbol to do the same thing but without propagating an error (this has some limitations, see `http.stop` docs for details).

	@example
	```
	import http from '@techmely/http';

	const response = await http('https://techmely.com', {
		hooks: {
			beforeRetry: [
				async ({request, options, error, retryCount}) => {
					const token = await http('https://techmely.com/refresh-token');
					options.headers.set('Authorization', `token ${token}`);
				}
			]
		}
	});
	```

	@default []
	*/
  beforeRetry?: HttpBeforeRetryIntercept[];

  /**
	This hook enables you to read and optionally modify the response. The hook function receives normalized input, options, and a clone of the response as arguments. The return value of the hook function will be used by http as the response object if it's an instance of [`Response`](https://developer.mozilla.org/en-US/docs/Web/API/Response).

	@default []

	@example
	```
	import http from '@techmely/http';

	const response = await http('https://techmely.com', {
		hooks: {
			afterResponse: [
				(_input, _options, response) => {
					// You could do something with the response, for example, logging.
					log(response);

					// Or return a `Response` instance to overwrite the response.
					return new Response('A different response', {status: 200});
				},

				// Or retry with a fresh token on a 403 error
				async (input, options, response) => {
					if (response.status === 403) {
						// Get a fresh token
						const token = await http('https://techmely.com/token').text();

						// Retry with the token
						options.headers.set('Authorization', `token ${token}`);

						return http(input, options);
					}
				}
			]
		}
	});
	```
	*/
  afterResponse?: HttpAfterResponseHook[];

  /**
	This hook enables you to modify the `HTTPError` right before it is thrown. The hook function receives a `HTTPError` as an argument and should return an instance of `HTTPError`.

	@default []

	@example
	```
	import http from '@techmely/http';

	await http('https://techmely.com', {
		hooks: {
			beforeError: [
				error => {
					const {response} = error;
					if (response && response.body) {
						error.name = 'GitHubError';
						error.message = `${response.body.message} (${response.status})`;
					}

					return error;
				}
			]
		}
	});
	```
	*/
  beforeError?: HttpBeforeErrorHook[];
};

export type HttpRetryOptions = {
  /**
	The number of times to retry failed requests.
	@default 1
	*/
  limit?: number;

  /**
	The HTTP methods allowed to retry.

	@default ['get', 'put', 'head', 'delete', 'options', 'trace']
	*/
  methods?: string[];

  /**
	The HTTP status codes allowed to retry.
	@default [
    408, // Request Timeout
    409, // Conflict
    413, // Content Too Large
    425, // Too Early
    429, // Too Many Requests
    500, // Internal Server Error
    502, // Bad Gateway
    503, // Service Unavailable
    504, //  Gateway Timeout
  ]
	*/
  statusCodes?: number[];

  /**
	The HTTP status codes allowed to retry with a `Retry-After` header.
	@default [413, 429, 503]
	*/
  afterStatusCodes?: number[];

  /**
	If the `Retry-After` header is greater than `maxRetryAfter`, the request will be canceled.
	@default Infinity
	*/
  maxRetryAfter?: number;

  /**
	The upper limit of the delay per retry in milliseconds.
	To clamp the delay, set `backoffLimit` to 1000, for example.

	By default, the delay is calculated in the following way:

	```
	0.3 * (2 ** (attemptCount - 1)) * 1000
	```

	The delay increases exponentially.

	@default Infinity
	*/
  backoffLimit?: number;

  /**
	A function to calculate the delay between retries given `attemptCount` (starts from 1).

	@default attemptCount => 0.3 * (2 ** (attemptCount - 1)) * 1000
	*/
  delay?: (attemptCount: number) => number;
};

export type HttpBeforeRequestIntercept = (
  request: Request,
  options: any,
) => Request | Response | VoidFunction | Promise<Request | Response | VoidFunction>;

export type HttpBeforeRetryState = {
  request: HttpFetchHookOptions;
  options: any;
  error: Error;
  retryCount: number;
};
export type HttpBeforeRetryIntercept = (
  options: HttpBeforeRetryState,
) => typeof stop | VoidFunction | Promise<typeof stop | VoidFunction>;

export type HttpAfterResponseIntercept = (
  request: Request,
  options: any,
  response: Response,
) => Response | VoidFunction | Promise<Response | VoidFunction>;

export type HttpBeforeErrorIntercept = (error: HttpError) => HttpError | Promise<HttpError>;

export type HttpInterceptors = {
  /**
	This hook enables you to modify the request right before it is sent. http will make no further changes to the request after this. The hook function receives normalized input and options as arguments. You could, forf example, modiy `options.headers` here.

	A [`Response`](https://developer.mozilla.org/en-US/docs/Web/API/Response) can be returned from this hook to completely avoid making a HTTP request. This can be used to mock a request, check an internal cache, etc. An **important** consideration when returning a `Response` from this hook is that all the following hooks will be skipped, so **ensure you only return a `Response` from the last hook**.

	@default []
	*/
  beforeRequest?: HttpBeforeRequestIntercept[];

  /**
	This hook enables you to modify the request right before retry. http will make no further changes to the request after this. The hook function receives an object with the normalized request and options, an error instance, and the retry count. You could, for example, modify `request.headers` here.

	If the request received a response, the error will be of type `HTTPError` and the `Response` object will be available at `error.response`. Be aware that some types of errors, such as network errors, inherently mean that a response was not received. In that case, the error will not be an instance of `HTTPError`.

	You can prevent http from retrying the request by throwing an error. http will not handle it in any way and the error will be propagated to the request initiator. The rest of the `beforeRetry` hooks will not be called in this case. Alternatively, you can return the [`http.stop`](#http.stop) symbol to do the same thing but without propagating an error (this has some limitations, see `http.stop` docs for details).

	@example
	```
	import http from '@techmely/http';

	const response = await http('https://techmely.com', {
		interceptors: {
			beforeRetry: [
				async ({request, options, error, retryCount}) => {
					const token = await http('https://techmely.com/refresh-token');
					options.headers.set('Authorization', `token ${token}`);
				}
			]
		}
	});
	```

	@default []
	*/
  beforeRetry?: HttpBeforeRetryIntercept[];

  /**
	This hook enables you to read and optionally modify the response. The hook function receives normalized input, options, and a clone of the response as arguments. The return value of the hook function will be used by http as the response object if it's an instance of [`Response`](https://developer.mozilla.org/en-US/docs/Web/API/Response).

	@default []

	@example
	```
	import http from '@techmely/http';

	const response = await http('https://techmely.com', {
		interceptors: {
			afterResponse: [
				(_input, _options, response) => {
					// You could do something with the response, for example, logging.
					log(response);

					// Or return a `Response` instance to overwrite the response.
					return new Response('A different response', {status: 200});
				},

				// Or retry with a fresh token on a 403 error
				async (input, options, response) => {
					if (response.status === 403) {
						// Get a fresh token
						const token = await http('https://techmely.com/token').text();

						// Retry with the token
						options.headers.set('Authorization', `token ${token}`);

						return http(input, options);
					}
				}
			]
		}
	});
	```
	*/
  afterResponse?: HttpAfterResponseIntercept[];

  /**
	This hook enables you to modify the `HTTPError` right before it is thrown. The hook function receives a `HTTPError` as an argument and should return an instance of `HTTPError`.

	@default []

	@example
	```
	import http from '@techmely/http';

	await http('https://techmely.com', {
		interceptors: {
			beforeError: [
				error => {
					const {response} = error;
					if (response && response.body) {
						error.name = 'GitHubError';
						error.message = `${response.body.message} (${response.status})`;
					}

					return error;
				}
			]
		}
	});
	```
	*/
  beforeError?: HttpBeforeErrorIntercept[];
};

export type HttpTimeoutOptions = {
  timeout: number;
  fetch: typeof fetch;
};

export type ResponsePromise = {
  arrayBuffer: () => Promise<ArrayBuffer>;
  blob: () => Promise<Blob>;
  formData: () => Promise<FormData>;
  json<T>(): Promise<T>;
  text: () => Promise<string>;
} & Promise<Response>;
