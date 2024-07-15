import type { ComputeRange } from "@techmely/types";
import { describe, expect, it, test } from "vitest";
import { isHex } from "../src/isHexColor";
import { percentToHex } from "../src/percentToHex";

describe("Check hex color", () => {
  const validHexColors = ["#2f2f2f", "#010000"];
  const invalidHexColors = ["#checkhex", "#0101"];
  it("Should return boolean value when check element is Hex color", () => {
    for (const hex of validHexColors) {
      expect(isHex(hex)).toBe(true);
    }
    for (const hex of invalidHexColors) {
      expect(isHex(hex)).toBe(false);
    }
  });
});

/**
 * Get this from here {@link https://gist.github.com/lopspower/03fb1cc0ac9f32ef38f4}
 */
const percents: ComputeRange<101>[number][] = [
  100, 99, 98, 97, 96, 95, 94, 93, 92, 91, 90, 89, 88, 87, 86, 85, 84, 83, 82, 81, 80, 79, 78, 77,
  76, 75, 74, 73, 72, 71, 70, 69, 68, 67, 66, 65, 64, 63, 62, 61, 60, 59, 58, 57, 56, 55, 54, 53,
  52, 51, 50, 49, 48, 47, 46, 45, 44, 43, 42, 41, 40, 39, 38, 37, 36, 35, 34, 33, 32, 31, 30, 29,
  28, 27, 26, 25, 24, 23, 22, 21, 20, 19, 18, 17, 16, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3,
  2, 1, 0,
];

// prettier-ignore
const hexValues = [
  "FF",
  "FC",
  "FA",
  "F7",
  "F5",
  "F2",
  "F0",
  "ED",
  "EB",
  "E8",
  "E6",
  "E3",
  "E0",
  "DE",
  "DB",
  "D9",
  "D6",
  "D4",
  "D1",
  "CF",
  "CC",
  "C9",
  "C7",
  "C4",
  "C2",
  "BF",
  "BD",
  "BA",
  "B8",
  "B5",
  "B3",
  "B0",
  "AD",
  "AB",
  "A8",
  "A6",
  "A3",
  "A1",
  "9E",
  "9C",
  "99",
  "96",
  "94",
  "91",
  "8F",
  "8C",
  "8A",
  "87",
  "85",
  "82",
  "80",
  "7D",
  "7A",
  "78",
  "75",
  "73",
  "70",
  "6E",
  "6B",
  "69",
  "66",
  "63",
  "61",
  "5E",
  "5C",
  "59",
  "57",
  "54",
  "52",
  "4F",
  "4D",
  "4A",
  "47",
  "45",
  "42",
  "40",
  "3D",
  "3B",
  "38",
  "36",
  "33",
  "30",
  "2E",
  "2B",
  "29",
  "26",
  "24",
  "21",
  "1F",
  "1C",
  "1A",
  "17",
  "14",
  "12",
  "0F",
  "0D",
  "0A",
  "08",
  "05",
  "03",
  "00",
];

describe("Check convert percent number to hex value(opacity", () => {
  test("Should convert correctly", () => {
    percents.forEach((percent, index) => {
      expect(percentToHex(percent)).toBe(hexValues[index]);
    });
  });
});
