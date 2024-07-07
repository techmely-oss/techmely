import { QueryErrorResetBoundary } from "@tanstack/react-query";
import React, { type ComponentType, type ReactNode, Suspense } from "react";
import { ErrorBoundary, type FallbackProps } from "react-error-boundary";

type RetryOptions = { retryQuery?: boolean };
type RetryFn = (options?: RetryOptions) => void;

type ErrorFallbackProps = {
  error: { message: string } & Record<string, unknown>;
  retry: RetryFn;
};

type Loading<T> = ComponentType<T> | ReactNode;
type ErrorComp<T> = ComponentType<T & ErrorFallbackProps> | ReactNode;

type WithFallbackOptions<T> = {
  Loading?: Loading<T>;
  ErrorComp?: ErrorComp<T>;
};

export function withFallback<T extends object = Record<string, never>>(
  Component: ComponentType<T>,
  options?: WithFallbackOptions<T>,
): ComponentType<T>;
export function withFallback<T extends object = Record<string, never>>(
  Component: ComponentType<T>,
  Loading?: Loading<T>,
  ErrorComp?: ErrorComp<T>,
): ComponentType<T>;
export function withFallback<T extends object = Record<string, never>>(
  Component: ComponentType<T>,
  options?: Loading<T> | WithFallbackOptions<T>,
  Error_?: ErrorComp<T>,
): ComponentType<T> {
  let Loading: Loading<T>;
  let ErrorComp: ErrorComp<T>;
  if (options && typeof options === "object" && ("Loading" in options || "ErrorComp" in options)) {
    Loading = options.Loading;
    ErrorComp = options.ErrorComp;
  } else if (options && typeof options !== "object") {
    Loading = options;
    ErrorComp = Error_;
  }
  const ComponentWithFallback = (componentProps: T) => {
    if (ErrorComp) {
      return (
        <Suspense
          fallback={typeof Loading === "function" ? <Loading {...componentProps} /> : Loading}
        >
          <QueryErrorResetBoundary>
            {({ reset }) => {
              const createRetry =
                (resetErrorBoundary: FallbackProps["resetErrorBoundary"]): RetryFn =>
                (options = {}) => {
                  const { retryQuery = true } = options;
                  if (retryQuery) {
                    reset();
                  }
                  resetErrorBoundary();
                };
              const createError = (originalError: FallbackProps["error"]) => {
                const message = getErrorMessage(originalError);
                const error = { message };
                if (typeof originalError === "object") {
                  Object.assign(error, originalError);
                  for (const key of ["name", "stack", "cause"]) {
                    if (key in originalError) {
                      Object.assign(error, { [key]: originalError[key] });
                    }
                  }
                }
                return error;
              };

              return (
                <ErrorBoundary
                  fallbackRender={({ error: originalError, resetErrorBoundary }) =>
                    typeof ErrorComp === "function" ? (
                      <ErrorComp
                        {...componentProps}
                        retry={createRetry(resetErrorBoundary)}
                        error={createError(originalError)}
                      />
                    ) : (
                      ErrorComp
                    )
                  }
                >
                  <Component {...componentProps} />
                </ErrorBoundary>
              );
            }}
          </QueryErrorResetBoundary>
        </Suspense>
      );
    }

    return (
      <Suspense
        fallback={typeof Loading === "function" ? <Loading {...componentProps} /> : Loading}
      >
        <Component {...componentProps} />
      </Suspense>
    );
  };

  ComponentWithFallback.displayName = `withFallback(${Component.displayName || Component.name})`;
  return ComponentWithFallback;
}

function getErrorMessage(error: unknown) {
  if (error && error instanceof Error) {
    return error.message;
  }

  if (
    error &&
    typeof error === "object" &&
    "message" in error &&
    typeof error.message === "string"
  ) {
    return error.message;
  }

  if (typeof error === "string") {
    return error;
  }

  return "Unknown error";
}
