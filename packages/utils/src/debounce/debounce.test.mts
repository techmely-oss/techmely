import { expect, test, vi } from "vitest";
import { debounce } from ".";

test("debounce function", () => {
  vi.useFakeTimers();
  const mockFunction = vi.fn();
  const debouncedFunction = debounce(mockFunction, 200);

  debouncedFunction();
  debouncedFunction();
  debouncedFunction();

  vi.advanceTimersByTime(150);

  expect(mockFunction).not.toBeCalled();

  vi.advanceTimersByTime(50);

  expect(mockFunction).toBeCalledTimes(1);
  vi.clearAllTimers();
});

test("Debounce function with immediate", () => {
  vi.useFakeTimers();
  const mockFunction = vi.fn();
  const debouncedFunction = debounce(mockFunction, 200, true);

  debouncedFunction(); // Executes immediately
  debouncedFunction(); // Ignored
  debouncedFunction(); // Ignored

  vi.advanceTimersByTime(50);
  expect(mockFunction).toBeCalledTimes(1);
  vi.advanceTimersByTime(199);
  expect(mockFunction).toBeCalledTimes(1);

  debouncedFunction();
  expect(mockFunction).toBeCalledTimes(2);
  vi.advanceTimersByTime(201);
  debouncedFunction();
  expect(mockFunction).toBeCalledTimes(3);
  vi.clearAllTimers();
});
