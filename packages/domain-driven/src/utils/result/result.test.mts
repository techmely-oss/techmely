import { ArgumentInvalidException } from "@techmely/http";
import { describe, expect, it } from "vitest";
import { Result } from ".";

describe("DDD: Result", () => {
  it("Should create an Result instance in failure state without error", () => {
    const result = Result.fail();
    expect(result.error()).toBe("An error has occurred");
    expect(result.value()).toBe(undefined);
    expect(result.isOk()).toBeFalsy();
    expect(result.isFail()).toBeTruthy();
    expect(result.metadata()).toEqual({});
    expect(result.toObject()).toStrictEqual({
      data: undefined,
      error: "An error has occurred",
      isFail: true,
      isOk: false,
      metadata: {},
    });
  });
  it("Should be failed with string error", () => {
    const result = Result.fail("Argument invalid");
    expect(result.error()).toBe("Argument invalid");
    expect(result.value()).toBe(undefined);
    expect(result.isOk()).toBeFalsy();
    expect(result.isFail()).toBeTruthy();
    expect(result.metadata()).toEqual({});
    expect(result.toObject()).toStrictEqual({
      data: undefined,
      error: "Argument invalid",
      isFail: true,
      isOk: false,
      metadata: {},
    });
  });

  it("Should be failed with custom Error", () => {
    const exception = new ArgumentInvalidException();
    const result = Result.fail(exception, { someMetadata: "1" });
    expect(result.value()).toBe(undefined);
    expect(result.error().message).toBe("Argument invalid");
    expect(result.isOk()).toBeFalsy();
    expect(result.isFail()).toBeTruthy();
    expect(result.metadata()).toEqual({ someMetadata: "1" });
    expect(result.toObject()).toStrictEqual({
      data: undefined,
      error: exception,
      isFail: true,
      isOk: false,
      metadata: { someMetadata: "1" },
    });
  });

  it("Should be success", () => {
    const result = Result.Ok("OK");
    expect(result.value()).toBe("OK");
    expect(result.isOk()).toBeTruthy();
    expect(result.error()).toBeUndefined();
    expect(result.isFail()).toBeFalsy();
    expect(result.metadata()).toEqual({});
    expect(result.toObject()).toStrictEqual({
      data: "OK",
      error: undefined,
      isFail: false,
      isOk: true,
      metadata: {},
    });
  });

  it("Should accept void", () => {
    const result = Result.Ok();
    expect(result.value()).toBe(undefined);
    expect(result.isOk()).toBeTruthy();
    expect(result.error()).toBeUndefined();
    expect(result.isFail()).toBeFalsy();
    expect(result.metadata()).toEqual({});
    expect(result.toObject()).toStrictEqual({
      data: undefined,
      error: undefined,
      isFail: false,
      isOk: true,
      metadata: {},
    });
  });
});
