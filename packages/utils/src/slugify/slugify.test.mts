import { describe } from "node:test";
import { expect, test } from "vitest";
import { slugify } from ".";

describe("Function Slugify", () => {
  test("Should return slug-value", () => {
    expect(slugify("Tìm hiểu về tự do tài chính - Phần 1")).toEqual(
      "tim-hieu-ve-tu-do-tai-chinh-phan-1",
    );
    expect(slugify("Ăn quả nhớ kẻ trồng cây OK OK OK ")).toEqual(
      "an-qua-nho-ke-trong-cay-ok-ok-ok",
    );
    expect(slugify("SB_PLB_PODPL_POPLC_11")).toEqual("sb-plb-podpl-poplc-11");
  });
});
