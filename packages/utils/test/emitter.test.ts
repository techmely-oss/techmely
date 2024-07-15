import { beforeEach, describe, expect, test, vi } from "vitest";
import emitter, { type Emitter, type EventHandlerMap } from "../src/emitter";

describe("Emitter", () => {
  const eventType = Symbol("eventType");

  type Events = {
    foo: unknown;
    FOO: unknown;
    constructor: unknown;
    LOL: unknown;
    "kimo:chi!": unknown;
    [eventType]: unknown;
  };

  let events: EventHandlerMap<Events>;
  let instance: Emitter<Events>;

  beforeEach(() => {
    events = new Map();
    instance = emitter(events);
  });

  describe("on emitter", () => {
    test("Should register handler for new type", () => {
      const noop = () => {};
      const foo = () => {};
      const symbol = () => {};

      instance.on("foo", noop);
      instance.on("constructor", foo);
      instance.on(eventType, symbol);

      expect(events.get("foo")).toStrictEqual([noop]);
      expect(events.get("constructor")).toStrictEqual([foo]);
      expect(events.get(eventType)).toStrictEqual([symbol]);
    });

    test("Should append handler for existing type", () => {
      const noop = () => {};
      const foo = () => {};
      instance.on("constructor", foo);
      instance.on("constructor", noop);
      expect(events.get("constructor")).toStrictEqual([foo, noop]);
    });
  });

  describe("off emitter", () => {
    test("Should not normalize case + remove handler correctly", () => {
      const lol = () => {};
      instance.on("LOL", lol);
      instance.on("foo", lol);
      instance.on("FOO", lol);

      instance.off("FOO", lol);
      instance.off("LOL", lol);

      expect(events.get("FOO")).to.be.empty;
      expect(events.get("foo")).toStrictEqual([lol]);
      expect(events.has("constructor")).to.be.false;
      expect(events.get("LOL")).to.be.empty;
    });

    test("Should remove only the 1st matching listener", () => {
      const kimochi = () => {};
      instance.on("kimo:chi!", kimochi);
      instance.on("kimo:chi!", kimochi);
      instance.off("kimo:chi!", kimochi);
      expect(events.get("kimo:chi!")).toStrictEqual([kimochi]);
      instance.off("kimo:chi!", kimochi);
      expect(events.get("kimo:chi!")).toStrictEqual([]);
    });
  });

  describe("Emit event", () => {
    test("Should not ignore case", () => {
      const onFOOD = vi.fn() as any;
      const onFoo = vi.fn() as any;

      events.set("FOO", [onFOOD]);
      events.set("foo", [onFoo]);

      instance.emit("FOO", "UPPERCASE: FOO arg");
      instance.emit("foo", "LOWERCASE: foo arg");

      expect(onFOOD).toBeCalledWith("UPPERCASE: FOO arg");
      expect(onFOOD).toHaveBeenCalledOnce();
    });

    test("Should invoke * handler", () => {
      const star = vi.fn();
      const ea = { a: "a" };
      const eb = { b: "b" };
      events.set("*", [star]);

      instance.emit("foo", ea);
      expect(star).toHaveBeenCalledWith("foo", ea);
      expect(star).toHaveBeenCalledOnce();
      star.mockReset();

      instance.emit("LOL", eb);
      expect(star).toHaveBeenCalledWith("LOL", eb);
      expect(star).toHaveBeenCalledOnce();
    });
  });
});
