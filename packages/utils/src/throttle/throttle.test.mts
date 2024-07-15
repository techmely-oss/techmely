import { expect, test, vi } from "vitest";
import { throttle } from ".";
vi.useFakeTimers();

test("throttle function", () => {
  const mockFunction = vi.fn();
  const throttledFunction = throttle(mockFunction, 200);

  throttledFunction();
  throttledFunction();
  throttledFunction();

  vi.advanceTimersByTime(100);

  expect(mockFunction).toBeCalledTimes(1);

  vi.advanceTimersByTime(200);

  expect(mockFunction).toBeCalledTimes(1);
});
