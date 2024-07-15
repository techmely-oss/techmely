import type { HttpRetryOptions } from "./http.types";

export const retryStatusCodes = new Set([
  408, // Request Timeout
  409, // Conflict
  425, // Too Early
  429, // Too Many Requests
  500, // Internal Server Error
  502, // Bad Gateway
  503, // Service Unavailable
  504, //  Gateway Timeout
]);

export const RESPONSE_TYPES = {
  json: "application/json",
  text: "text/*",
  formData: "multipart/form-data",
  arrayBuffer: "*/*",
  blob: "*/*",
} as const;

export const REQUEST_METHODS = [
  "GET",
  "HEAD",
  "PATCH",
  "POST",
  "PUT",
  "DELETE",
  "CONNECT",
  "OPTIONS",
  "TRACE",
] as const;

export type HttpMethod = (typeof REQUEST_METHODS)[number];

const httpRetryMethods = ["get", "put", "head", "delete", "options", "trace"];

export const httpRetryStatusCodes = [408, 413, 429, 500, 502, 503, 504];

const httpRetryAfterStatusCodes = [413, 429, 503];

export const httpDefaultRetry: Required<HttpRetryOptions> = {
  limit: 2,
  methods: httpRetryMethods,
  statusCodes: httpRetryStatusCodes,
  afterStatusCodes: httpRetryAfterStatusCodes,
  maxRetryAfter: Number.POSITIVE_INFINITY,
  backoffLimit: Number.POSITIVE_INFINITY,
  delay: (attemptCount: number) => 0.3 * 2 ** (attemptCount - 1) * 1000,
};
