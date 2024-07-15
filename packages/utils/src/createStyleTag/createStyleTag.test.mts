// @vitest-environment happy-dom

import "@testing-library/jest-dom/vitest";
import { afterEach, describe, expect, it } from "vitest";
import { createStyleTag } from ".";

const baseStyle = ".hello-world { position: relative; }";

describe("Create style tag", () => {
  afterEach(() => {
    document.getElementsByTagName("head")[0].innerHTML = "";
  });

  it("Should create an style element", () => {
    const style = createStyleTag(baseStyle, { id: "editor-style" });
    expect(style.innerHTML).toBe(baseStyle);
    expect(style).toHaveAttribute("id", "editor-style");
  });
  it("Should create an style with once attribute", () => {
    const style = createStyleTag(baseStyle, {
      id: "style-for-fun",
      "data-testid": "for-fun",
      nonce: "true",
    });
    expect(style.innerHTML).toBe(baseStyle);
    expect(style).toHaveAttribute("id", "style-for-fun");
    expect(style).toHaveAttribute("nonce", "true");
    expect(style).toHaveAttribute("data-testid", "for-fun");
  });
});
