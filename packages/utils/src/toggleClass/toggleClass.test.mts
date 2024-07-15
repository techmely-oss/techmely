// @vitest-environment happy-dom

import { describe, expect, it } from "vitest";
import { createElement } from "../createElement";
import { toggleClass } from "./toggleClass";

describe("Toggle an element class", () => {
  it("Should toggle an element className", () => {
    const div = createElement("div", { class: "on" });
    toggleClass(div, "on", false);
    expect(div.className).toBe("");

    toggleClass(div, "on");
    expect(div.className).toBe("on");
  });
});
