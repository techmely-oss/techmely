import { Http } from "./http";
import { REQUEST_METHODS } from "./http.const";
import type { HttpFetchOptions, HttpInput, HttpInstance } from "./http.types";

export * from "./exceptions";
export * from "./http";
export * from "./http.const";
export * from "./http.types";

const createInstance = (defaults?: Partial<HttpFetchOptions>): HttpInstance => {
  const http = (input: HttpInput, _options?: HttpFetchOptions) =>
    Http.create(input, { ...defaults, ..._options });

  for (const method of REQUEST_METHODS) {
    http[method] = (input: HttpInput, _options?: HttpFetchOptions) =>
      Http.create(input, { ...defaults, ..._options, method });
  }

  http.create = (newDefaults?: Partial<HttpFetchOptions>) => createInstance(newDefaults);
  http.extend = (newDefaults?: Partial<HttpFetchOptions>) =>
    createInstance({ ...defaults, ...newDefaults });
  return http as HttpInstance;
};

const http = createInstance();

export default http;
