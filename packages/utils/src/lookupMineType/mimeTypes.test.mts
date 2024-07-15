import { describe, expect } from "vitest";
import { MIME_TYPES, lookupMineType } from ".";

describe("Look up mine types", () => {
  expect(lookupMineType("foobar")).toBe(undefined);

  MIME_TYPES.foobar = "foobar";
  expect(lookupMineType("foobar")).toBe("foobar");

  expect(lookupMineType("foo/bar.txt")).toBe("text/plain");
  expect(lookupMineType("txt")).toBe("text/plain");
  expect(lookupMineType("  txt  ")).toBe("text/plain");
  // @ts-expect-error I knew
  expect(lookupMineType(123)).toBe(undefined);
  expect(lookupMineType("123")).toBe(undefined);
  expect(lookupMineType("C:\\\\hello\\\\world.html")).toBe("text/html");
  expect(lookupMineType("xsl")).toBe("application/xml");
  expect(lookupMineType("mp3")).toBe("audio/mpeg");
  expect(lookupMineType("wav")).toBe("audio/wav");
  expect(lookupMineType("x3db")).toBe("model/x3d+fastinfoset");
  expect(lookupMineType("x3dv")).toBe("model/x3d-vrml");
  expect(lookupMineType("rtf")).toBe("text/rtf");
  expect(lookupMineType("xml")).toBe("text/xml");
  expect(lookupMineType("3gpp")).toBe("video/3gpp");
  expect(lookupMineType("jpm")).toBe("image/jpm");
  //
  expect(lookupMineType("js")).toBe("text/javascript");
  expect(lookupMineType("mjs")).toBe("text/javascript");
  expect(lookupMineType("mp4")).toBe("video/mp4");
});
