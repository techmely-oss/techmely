import { describe, expect, test } from "vitest";
import { formatLot10Volume } from "../src/formatLot10Volume";
import { formatNumber } from "../src/formatNumber";
import { isNumber } from "../src/isNumber";
import { digitLengthPrecision } from "../src/numberDigitLengthPrecision";
import { dividePrecision } from "../src/numberDivinePrecision";
import { float2FixedPrecision } from "../src/numberFloat2FixedPrecision";
import { minusPrecision } from "../src/numberMinusPrecision";
import { plusPrecision } from "../src/numberPlusPrecision";
import { roundPrecision } from "../src/numberRoundPrecision";
import { stripPrecision } from "../src/numberStripPrecision";
import { timesPrecision } from "../src/numberTimesPrecision";

const dataTestFormatNumber = [
  [123123, 0, "-", "123,123"],
  [9999, 1, "-", "9,999.0"],
  [9999, 2, "+", "9,999.00"],
  [undefined, 0, "*", "*"],
];

const dataTestFormat10Volume = [
  [123123, 0, "-", "1,231,23"],
  [232323, 1, "-", "2,323,230."],
  [69696969, 2, "+", "696,969,690.0"],
  [undefined, 2, "*"],
];

describe("Format number to desire form", () => {
  test.concurrent.each(dataTestFormatNumber)(
    "When input is %d, precision %d, fallbackValue %s, should return %s ",
    (input, precision, fallbackValue, expected) => {
      if (input && isNumber(precision)) {
        expect(formatNumber(input, precision, fallbackValue)).toBe(expected);
      } else {
        expect(formatNumber(input, precision ? +precision : 0, fallbackValue)).toBe(fallbackValue);
      }
    },
  );

  test.concurrent.each(dataTestFormat10Volume)(
    "Should return %s when input is %d, %d, %s, %s",
    (input, precision, fallbackValue, expected) => {
      if (input && isNumber(precision)) {
        expect(formatLot10Volume(input, precision, fallbackValue)).toBe(expected);
      } else {
        expect(formatLot10Volume(input, precision ? +precision : 0, fallbackValue)).toBe(
          fallbackValue,
        );
      }
    },
  );
});

describe("Check number precision", () => {
  test("Np Strip can eliminate rounding errors", () => {
    expect(stripPrecision(0.09999999999999998)).toBe(0.1);
    // biome-ignore lint/correctness/noPrecisionLoss: Ignore test
    expect(stripPrecision(1.0000000000000001)).toBe(1);
    expect(stripPrecision("0.09999999999999998")).toBe(0.1);
    expect(stripPrecision("1.0000000000000001")).toBe(1);
  });

  const dataDigitLength = [
    [123.4567890123, 10],
    [1.23e-5, 7],
    [1.23e-5, 7],
    [1.233467e-5, 11],
    [123.45e-5, 7],
    [1.23e-10, 12],
    [1.23e1, 1],
    [1e20, 0],
    [1.12345e20, 0],
    [1.123e30, 0],
    [1.123e-100, 103],
    ["1.23e-5", 7],
    ["1.23E-5", 7],
    ["1.233467e-5", 11],
    ["123.45e-5", 7],
    ["1.23e-10", 12],
    ["1.23e1", 1],
    ["1e20", 0],
    ["1.12345e20", 0],
    ["1.123e30", 0],
    ["1.123e-100", 103],
  ];
  test.concurrent.each(dataDigitLength)(
    "DigitLength can do digitLength operation from %s to %d",
    (input, output) => {
      expect(digitLengthPrecision(input)).toBe(output);
    },
  );

  const dataFloat2Fixed = [
    [1e-1, 1],
    [1e-6, 1],
    [1e-7, 1],
    [1e-13, 1],
    [1.123e30, 1.123e30],
    [1.6e-30, 16],
    [1.234567e-13, 1234567],
    [1.2345678912345e10, 12345678912345],
    [0.000000123456, 123456],
    [1.23456e-7, 123456],
    ["1e-1", 1],
    ["1e-6", 1],
    ["1e-7", 1],
    ["1e-13", 1],
    ["1.123e30", 1.123e30],
    ["1.6e-30", 16],
    ["1.234567e-13", 1234567],
    ["1.2345678912345e10", 12345678912345],
    ["0.000000123456", 123456],
    ["1.23456e-7", 123456],
  ];

  test.concurrent.each(dataFloat2Fixed)(
    "Float2Fixed can change float %s to fixed %d",
    (input, output) => {
      expect(float2FixedPrecision(input)).toBe(output);
    },
  );

  const dataPlus = [
    [0.1, 0.2, 0.3],
    [2.3, 2.4, 4.7],
    [-1.6, -1, -2.6],
    [-2.0, 63, 61],
    [-3, 7, 4],
    [-221, 38, -183],
    [-1, 0, -1],
    [2.018, 0.001, 2.019],
    [1.3224e10, 1.3224e3, 13224001322.4],
    [1.6e-30, 1.6e-30, 3.2e-30],
    ["0.1", "0.2", 0.3],
    ["2.3", "2.4", 4.7],
    ["-1.6", "-1", -2.6],
    ["-2.0", "63", 61],
    ["-3", "7", 4],
    ["-221", "38", -183],
    ["-1", "0", -1],
    ["2.018", "0.001", 2.019],
    ["1.3224e10", "1.3224e3", 13224001322.4],
    ["1.6e-30", "1.6e-30", 3.2e-30],
  ];

  test.concurrent.each(dataPlus)("Plus operation: %s + %s = %d", (a, b, output) => {
    expect(plusPrecision(a, b)).toBe(output);
  });
  expect(plusPrecision("-1", "0", "2", "3", 4)).toBe(8);
  expect(plusPrecision(0.1, 0.2, 0.3)).toBe(0.6);
  expect(plusPrecision("0.1", "0.2", "0.3")).toBe(0.6);
  expect(plusPrecision(...new Array(500).fill(1)) === 500);

  const dataMinus = [
    [0.07, 0.01, 0.06],
    [0.7, 0.1, 0.6],
    [1.0, 0.9, 0.1],
    [1, 0, 1],
    [1, -0, 1],
    [-1, 0, -1],
    [-1, -0, -1],
    [1, 22, -21],
    // biome-ignore lint/correctness/noPrecisionLoss: Ignore test
    [8893568.397103781249, -7.2967405955, 8893575.693844376749],
    [105468873, 0, 105468873],
    ["0.07", "0.01", 0.06],
    ["0.7", "0.1", 0.6],
    ["1.0", "0.9", 0.1],
    ["1", "0", 1],
    ["1", "-0", 1],
    ["-1", "0", -1],
    ["-1", "-0", -1],
    ["1", "22", -21],
    // biome-ignore lint/correctness/noPrecisionLoss: Ignore test
    ["8893568.397103781249", "-7.29674059550", 8893575.693844376749],
    ["105468873", "0", 105468873],
    [1.23e5, 10, 122990],
    [1.23e-5, 1.0023, -1.0022877],
    [1.3224e10, 21, 13223999979],
    [1.3224e10, 1.3224e3, 13223998677.6],
    [1.7e-30, 0.1e-30, 1.6e-30],
    ["1.23e5", "10", 122990],
    ["1.23e-5", "1.0023", -1.0022877],
    ["1.3224e10", "21", 13223999979],
    ["1.3224e10", "1.3224e3", 13223998677.6],
    ["1.7e-30", "0.1e-30", 1.6e-30],
  ];

  test.concurrent.each(dataMinus)("Minus operation: %s - %s = %d", (a, b, output) => {
    expect(minusPrecision(a, b)).toBe(output);
  });

  expect(minusPrecision(6, 3, 2) === 1);
  expect(minusPrecision(6, 3, 2, 1) === 0);
  expect(minusPrecision(6, 3, 2, 1, 2, 3) === -5);
  expect(minusPrecision(6, 3, 2, 1, 2, 3, -5) === -10);
  expect(minusPrecision("6", "3", "2") === 1);
  expect(minusPrecision("6", "3", "2", "1", "2", "3") === -5);
  expect(minusPrecision(500, ...new Array(500).fill(1)) === 0);

  const dataTimes = [
    [0.07, 100, 7],
    [0.7, 0.1, 0.07],
    [3, 0.3, 0.9],
    [118762317358.75, 1e-8, 1187.6231735875],
    [0.362, 100, 36.2],
    [1.1, 1.1, 1.21],
    [2.018, 1000, 2018],
    // biome-ignore lint/correctness/noPrecisionLoss: Ignore test
    [5.2, -3.8461538461538462, -20],
    [1.22, -1.639344262295082, -2],
    [2.5, -0.92, -2.3],
    [-2.2, 0.6363636363636364, -1.4],
    ["0.07", "100", 7],
    ["0.7", "0.1", 0.07],
    ["3", "0.3", 0.9],
    ["118762317358.75", "1e-8", 1187.6231735875],
    ["0.362", "100", 36.2],
    ["1.1", "1.1", 1.21],
    ["2.018", "1000", 2018],
    ["5.2", "-3.8461538461538462", -20],
    ["1.22", "-1.639344262295082", -2],
    ["2.5", "-0.92", -2.3],
    ["-2.2", "0.6363636363636364", -1.4],
    [8.0, -0.3625, -2.9],
    [6.6, 0.30303030303030304, 2],
    [10.0, -0.8, -8],
    [-1.1, -7.272727272727273, 8],
    ["8.0", "-0.3625", -2.9],
    ["6.6", "0.30303030303030304", 2],
    ["10.0", "-0.8", -8],
    ["-1.1", "-7.272727272727273", 8],
    [-1.23e4, 20, -246000],
    [1.7e-30, 1.5e20, 2.55e-10],
    ["-1.23e4", "20", -246000],
    ["1.7e-30", "1.5e20", 2.55e-10],
    [0.000000123456, 0.000000123456, 1.5241383936e-14],
    [1.23456e-7, 1.23456e-7, 1.5241383936e-14],
    ["0.000000123456", "0.000000123456", 1.5241383936e-14],
    ["1.23456e-7", "1.23456e-7", 1.5241383936e-14],
  ];

  test.concurrent.each(dataTimes)("Times operation: %s * %s = %d", (a, b, output) => {
    expect(timesPrecision(a, b)).toBe(output);
  });

  expect(timesPrecision(2, 2, 3) === 12);
  expect(timesPrecision(2, 2, 3, 0.1) === 1.2);
  expect(timesPrecision("2", "2", "3") === 12);
  expect(timesPrecision("2", "2", "3", "0.1") === 1.2);

  expect(timesPrecision(...new Array(500).fill(1)) === 1);
  // expect(npTimes(-3, 2.3333333333333335) === 7);
  // expect(npTimes(-0.076, -92.10526315789471) === 7);

  const dataDivide = [
    [1.21, 1.1, 1.1],
    [4750.49269435, 4, 1187.6231735875],
    [0.9, 3, 0.3],
    [36.2, 0.362, 100],
    // biome-ignore lint/correctness/noPrecisionLoss: Ignore test
    [-20, 5.2, -3.8461538461538462],
    [-2, 1.22, -1.639344262295082],
    [-2.3, 2.5, -0.92],
    [-1.4, -2.2, 0.6363636363636364],
    [7, -3, -2.3333333333333335],
    [7, -0.076, -92.10526315789471],
    [-2.9, 8.0, -0.3625],
    [2, 6.6, 0.30303030303030304],
    [-8, 10.0, -0.8],
    [8, -1.1, -7.272727272727273],
    ["1.21", "1.1", 1.1],
    ["4750.49269435", "4", 1187.6231735875],
    ["0.9", "3", 0.3],
    ["36.2", "0.362", 100],
    // biome-ignore lint/correctness/noPrecisionLoss: Ignore test
    ["-20", "5.2", -3.8461538461538462],
    ["-2", "1.22", -1.639344262295082],
    ["-2.3", "2.5", -0.92],
    ["-1.4", "-2.2", 0.6363636363636364],
    ["7", "-3", -2.3333333333333335],
    ["7", "-0.076", -92.10526315789471],
    ["-2.9", "8.0", -0.3625],
    ["2", "6.6", 0.30303030303030304],
    ["-8", "10.0", -0.8],
    ["8", "-1.1", -7.272727272727273],
    [-1.23e4, 20, -615],
    [2.55e-10, 1.7e-30, 1.5e20],
    ["-1.23e4", "20", -615],
    ["2.55e-10", "1.7e-30", 1.5e20],
    [33.3333, 100, 0.333333],
    [83.42894732749, 100, 0.8342894732749],
    [1, 3, 0.3333333333333333],
    ["33.3333", "100", 0.333333],
    ["83.42894732749", "100", 0.8342894732749],
    ["1", "3", 0.3333333333333333],
  ];

  test.concurrent.each(dataDivide)("Divide operation: %s / %s = %d", (a, b, output) => {
    expect(dividePrecision(a, b)).toBe(output);
  });
  expect(dividePrecision("12", "3", "2")).toBe(2);
  expect(dividePrecision(12, 3, 2)).toBe(2);
  expect(dividePrecision(1024, 4, 8, 2) === 16);
  expect(dividePrecision(...new Array(500).fill(1)) === 1);

  const dataRound = [
    [0, 1, 0],
    [0, 0, 0],
    [0.7875, 3, 0.788],
    [0.105, 2, 0.11],
    [1, 1, 1],
    [0.1049999999, 2, 0.1],
    [0.105, 1, 0.1],
    [1.335, 2, 1.34],
    [1.35, 1, 1.4],
    [12345.105, 2, 12345.11],
    [0.0005, 2, 0],
    [0.0005, 3, 0.001],
    ["0", 1, 0],
    ["0", 0, 0],
    ["0.7875", 3, 0.788],
    ["0.105", 2, 0.11],
    ["1", 1, 1],
    ["0.1049999999", 2, 0.1],
    ["0.105", 1, 0.1],
    ["1.335", 2, 1.34],
    ["1.35", 1, 1.4],
    ["12345.105", 2, 12345.11],
    ["0.0005", 2, 0],
    ["0.0005", 3, 0.001],
    [1.2345e3, 3, 1234.5],
    [1.2344e3, 3, 1234.4],
    [1e3, 1, 1000],
    ["1.2345e3", 3, 1234.5],
    ["1.2344e3", 3, 1234.4],
    ["1e3", 1, 1000],
    // ["-0.125", 2, -0.13],
    // ["-0.001", 2, 0.0],
    // ["-0.005", 2, -0.01],
    ["0.125", 2, 0.13],
    ["0.001", 2, 0.0],
    ["0.005", 2, 0.01],
    [-0.125, 2, -0.13],
    [-0.001, 2, 0.0],
    [-0.005, 2, -0.01],
    [0.125, 2, 0.13],
    [0.001, 2, 0.0],
    [0.005, 2, 0.01],
  ];
  test.concurrent.each(dataRound)("Round %s with %d fixed = %d", (a, b, output) => {
    // @ts-expect-error Ignore type check
    expect(roundPrecision(a, b)).toBe(output);
  });
});
