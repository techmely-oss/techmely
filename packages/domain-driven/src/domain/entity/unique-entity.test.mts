import { describe, expect, it } from "vitest";
import { UniqueEntityID } from "./unique-entity";

describe("UniqueEntityID", () => {
  it("should create a new uuid if not provide value", () => {
    const uuid = UniqueEntityID.create();
    expect(uuid).toBeDefined();
  });

  it("should create different ids", () => {
    const uuid1 = UniqueEntityID.create();
    const uuid2 = UniqueEntityID.create();

    expect(uuid1).not.toEqual(uuid2);
    expect(uuid1.equal(uuid2)).toBeFalsy();
  });

  it("should create a id with provided value", () => {
    const value = "UIASA46-ASD5A-ASD54-ASD5GFJS05D";
    const id = UniqueEntityID.create(value);
    expect(id.toValue()).toBe(value);
  });

  it("null must not be equal", () => {
    expect(typeof UniqueEntityID.create(undefined).toValue() === "string").toBeTruthy();
    expect(UniqueEntityID.create(undefined).equal(UniqueEntityID.create())).toBeFalsy();
    expect(UniqueEntityID.create(undefined).equal(UniqueEntityID.create())).toBeFalsy();
  });

  it("must not be equal", () => {
    const a = UniqueEntityID.create(undefined);
    const b = UniqueEntityID.create(undefined);
    expect(a.equal(b)).toBeFalsy();
  });
});
