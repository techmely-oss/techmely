import { describe, expect, it, test } from "vitest";
import { formatDate } from "../src/dayjs";

const dataDateTest = [
  "2021-09-20T17:30:00Z",
  "2021-08-10T10:51:09.833Z",
  "2021-12-31T00:00:00+07:00",
];

const expectDefaultOutput = ["21/09/2021", "10/08/2021", "31/12/2021"];
const expectTimesOutput = ["00:30:00", "17:51:09", "00:00:00"];

describe("Unit test Date utils", () => {
  describe("Timezones", () => {
    it("should always be GMT+7", () => {
      expect(new Date().getTimezoneOffset()).toBe(-420);
    });
  });

  describe("Check date format utils", () => {
    describe("Test valid date with default format", () => {
      dataDateTest.forEach((date, index) => {
        test(`If user use ${date}`, () => {
          expect(formatDate(date)).toEqual(expectDefaultOutput[index]);
        });
      });
    });
    describe("Test valid time with HH:mm:ss format", () => {
      test("IF user use format HH:mm:ss", () => {
        dataDateTest.forEach((date, index) => {
          expect(formatDate(date, "HH:mm:ss")).toEqual(expectTimesOutput[index]);
        });
      });
    });
  });
});
