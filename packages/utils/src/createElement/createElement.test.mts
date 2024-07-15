// @vitest-environment happy-dom

import { describe, expect, it } from "vitest";
import { createElement } from "./createElement";

describe("Create element", () => {
  it("Should generate an element", () => {
    const div = createElement("div");
    expect(div).toBeDefined();
  });
  it("Should generate an element with some attribute", () => {
    const div = createElement("div", { id: 1, class: "hello world" });
    expect(div.id).toBe("1");
    expect(div.className).toBe("hello world");
  });
  it("Should generate an element with some attribute and ignore some invalid attrs", () => {
    const invalidObj = { test: 1 };
    const div = createElement("div", {
      id: 1,
      class: "hello world",
      "data-id": "ok",
      "data-abc": invalidObj,
    });
    expect(div.id).toBe("1");
    expect(div.className).toBe("hello world");
    expect(div.dataset.id).toBe("ok");
    expect(div.dataset.abc).toBe(undefined);
  });
  it("Should generate an element with children", () => {
    const div = createElement("div", "hello world", "hello world");
    expect(div.innerHTML).toBe("hello worldhello world");
    const div2 = createElement("div", null, "hello world", "hello world");
    expect(div2.innerHTML).toBe("hello worldhello world");
    const div3 = createElement("div", { id: 1, class: "wow" }, "hello world", "hello world");
    expect(div3.innerHTML).toBe("hello worldhello world");
    expect(div3.id).toBe("1");
    expect(div3.className).toBe("wow");
  });
});
