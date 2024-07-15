import { describe, expect, it } from "vitest";
import { parseCookie, serializeCookie } from "../src";

describe("parseCookie(str)", () => {
  it("should throw with no arguments", () => {
    expect(parseCookie).throws(/argument str must be a string/);
  });

  it("should throw when not a string", () => {
    // @ts-expect-error Ignore type check
    expect(() => parseCookie(null)).throws(/argument str must be a string/);
  });

  it("should parse cookie string to object", () => {
    expect(parseCookie("foo=bar")).toStrictEqual({ foo: "bar" });
    expect(parseCookie("foo=123")).toStrictEqual({ foo: "123" });
  });

  it("should ignore OWS", () => {
    expect(parseCookie("FOO    = bar;   baz  =   raz")).toStrictEqual({ FOO: "bar", baz: "raz" });
  });

  it("should parse cookie with empty value", () => {
    expect(parseCookie("foo= ; bar=")).toStrictEqual({ foo: "", bar: "" });
  });

  it("should URL-decode values", () => {
    expect(parseCookie('foo="bar=123456789&name=Magic+Mouse"')).toStrictEqual({
      foo: "bar=123456789&name=Magic+Mouse",
    });

    expect(parseCookie("email=%20%22%2c%3b%2f")).toStrictEqual({ email: ' ",;/' });
  });

  it("should return original value on escape error", () => {
    expect(parseCookie("foo=%1;bar=bar")).toStrictEqual({ foo: "%1", bar: "bar" });
  });

  it("should ignore cookies without value", () => {
    expect(parseCookie("foo=bar;fizz  ;  buzz")).toStrictEqual({ foo: "bar" });
    expect(parseCookie("  fizz; foo=  bar")).toStrictEqual({ foo: "bar" });
  });

  it("should ignore duplicate cookies", () => {
    expect(parseCookie("foo=%1;bar=bar;foo=boo")).toStrictEqual({ foo: "%1", bar: "bar" });
    expect(parseCookie("foo=false;bar=bar;foo=true")).toStrictEqual({ foo: "false", bar: "bar" });
    expect(parseCookie("foo=;bar=bar;foo=boo")).toStrictEqual({ foo: "", bar: "bar" });
  });
});

describe("parseCookie(str, options)", () => {
  describe('with "decode" option', () => {
    it("should specify alternative value decoder", () => {
      expect(
        parseCookie('foo="YmFy"', {
          decode: (v) => Buffer.from(v, "base64").toString(),
        }),
      ).toStrictEqual({ foo: "bar" });
    });
  });
});

describe("serializeCookie(name, value)", () => {
  it("should serialize name and value", () => {
    expect(serializeCookie("foo", "bar")).toEqual("foo=bar");
  });

  it("should URL-encode value", () => {
    expect(serializeCookie("foo", "bar +baz")).toEqual("foo=bar%20%2Bbaz");
  });

  it("should serialize empty value", () => {
    expect(serializeCookie("foo", "")).toEqual("foo=");
  });

  it("should throw for invalid name", () => {
    expect(() => serializeCookie("foo\n", "bar")).throws(/argument name is invalid/);
    expect(() => serializeCookie("foo\u280a", "bar")).throws(/argument name is invalid/);
  });
});

describe("serializeCookie(name, value, options)", () => {
  describe('with "domain" option', () => {
    it("should serialize domain", () => {
      expect(
        serializeCookie("foo", "bar", { domain: "example.com" }),
        "foo=bar; Domain=example.com",
      );
    });

    it("should throw for invalid value", () => {
      expect(() => serializeCookie("foo", "bar", { domain: "example.com\n" })).throws(
        /option domain is invalid/,
      );
    });
  });

  describe('with "encode" option', () => {
    it("should throw on non-function value", () => {
      // @ts-expect-error Ignore type check
      expect(() => serializeCookie("foo", "bar", { encode: 42 })).throw(/option encode is invalid/);
    });

    it("should specify alternative value encoder", () => {
      expect(
        serializeCookie("foo", "bar", {
          encode: (v) => Buffer.from(v, "utf8").toString("base64"),
        }),
      ).toEqual("foo=YmFy");
    });

    it("should throw when returned value is invalid", () => {
      expect(() =>
        serializeCookie("foo", "+ \n", {
          encode: (v) => v,
        }),
      ).throw(/argument val is invalid/);
    });
  });

  describe('with "expires" option', () => {
    it("should throw on non-Date value", () => {
      expect(
        // @ts-expect-error Ignore type check
        () => serializeCookie("foo", "bar", { expires: 42 }),
      ).throws(/option expires is invalid/);
    });

    it("should throw on invalid date", () => {
      expect(() => serializeCookie("foo", "bar", { expires: new Date(Number.NaN) })).throws(
        /option expires is invalid/,
      );
    });

    it("should set expires to given date", () => {
      expect(
        serializeCookie("foo", "bar", {
          expires: new Date(Date.UTC(2000, 11, 24, 10, 30, 59, 900)),
        }),
      ).toEqual("foo=bar; Expires=Sun, 24 Dec 2000 10:30:59 GMT");
    });
  });

  describe('with "httpOnly" option', () => {
    it("should include httpOnly flag when true", () => {
      expect(serializeCookie("foo", "bar", { httpOnly: true })).toBe("foo=bar; HttpOnly");
    });

    it("should not include httpOnly flag when false", () => {
      expect(serializeCookie("foo", "bar", { httpOnly: false })).toEqual("foo=bar");
    });
  });

  describe('with "maxAge" option', () => {
    it("should throw when not a number", () => {
      // @ts-expect-error Ignore type check
      expect(() => serializeCookie("foo", "bar", { maxAge: "buzz" })).throws(
        /option maxAge is invalid/,
      );
    });

    it("should throw when Infinity", () => {
      expect(() => serializeCookie("foo", "bar", { maxAge: Number.POSITIVE_INFINITY })).throws(
        /option maxAge is invalid/,
      );
    });

    it("should set max-age to value", () => {
      expect(serializeCookie("foo", "bar", { maxAge: 1000 })).toEqual("foo=bar; Max-Age=1000");
      // @ts-expect-error Ignore type check
      expect(serializeCookie("foo", "bar", { maxAge: "1000" })).toEqual("foo=bar; Max-Age=1000");
      expect(serializeCookie("foo", "bar", { maxAge: 0 })).toEqual("foo=bar; Max-Age=0");
      // @ts-expect-error Ignore type check
      expect(serializeCookie("foo", "bar", { maxAge: "0" })).toEqual("foo=bar; Max-Age=0");
    });

    it("should set max-age to integer value", () => {
      expect(serializeCookie("foo", "bar", { maxAge: 3.14 })).toEqual("foo=bar; Max-Age=3");
      expect(serializeCookie("foo", "bar", { maxAge: 3.99 })).toEqual("foo=bar; Max-Age=3");
    });

    it("should not set when null", () => {
      // @ts-expect-error Ignore type check
      expect(serializeCookie("foo", "bar", { maxAge: null })).toEqual("foo=bar");
    });
  });

  describe('with "path" option', () => {
    it("should serialize path", () => {
      expect(serializeCookie("foo", "bar", { path: "/" })).toEqual("foo=bar; Path=/");
    });

    it("should throw for invalid value", () => {
      expect(() => serializeCookie("foo", "bar", { path: "/\n" })).throws(/option path is invalid/);
    });
  });

  describe('with "priority" option', () => {
    it("should throw on invalid priority", () => {
      // @ts-expect-error Ignore type check
      expect(() => serializeCookie("foo", "bar", { priority: "foo" })).throws(
        /option priority is invalid/,
      );
    });

    it("should throw on non-string", () => {
      // @ts-expect-error Ignore type check
      expect(() => serializeCookie("foo", "bar", { priority: 42 })).throws(
        /option priority is invalid/,
      );
    });

    it("should set priority low", () => {
      expect(serializeCookie("foo", "bar", { priority: "Low" })).toEqual("foo=bar; Priority=Low");
    });

    it("should set priority medium", () => {
      expect(serializeCookie("foo", "bar", { priority: "Medium" }), "foo=bar; Priority=Medium");
    });

    it("should set priority high", () => {
      expect(serializeCookie("foo", "bar", { priority: "High" }), "foo=bar; Priority=High");
    });
  });

  describe('with "sameSite" option', () => {
    it("should throw on invalid sameSite", () => {
      // @ts-expect-error Ignore type check
      expect(() => serializeCookie("foo", "bar", { sameSite: "foo" })).throws(
        /option sameSite is invalid/,
      );
    });

    it("should set sameSite strict", () => {
      // @ts-expect-error Ignore type check
      expect(serializeCookie("foo", "bar", { sameSite: "Strict" })).toEqual(
        "foo=bar; SameSite=Strict",
      );
      expect(serializeCookie("foo", "bar", { sameSite: "strict" })).toEqual(
        "foo=bar; SameSite=Strict",
      );
    });

    it("should set sameSite lax", () => {
      // @ts-expect-error Ignore type check
      expect(serializeCookie("foo", "bar", { sameSite: "Lax" })).toEqual("foo=bar; SameSite=Lax");
      expect(serializeCookie("foo", "bar", { sameSite: "lax" })).toEqual("foo=bar; SameSite=Lax");
    });

    it("should set sameSite none", () => {
      // @ts-expect-error Ignore type check
      expect(serializeCookie("foo", "bar", { sameSite: "None" })).toEqual("foo=bar; SameSite=None");
      expect(serializeCookie("foo", "bar", { sameSite: "none" })).toEqual("foo=bar; SameSite=None");
    });

    it("should set sameSite strict when true", () => {
      expect(serializeCookie("foo", "bar", { sameSite: true })).toEqual("foo=bar; SameSite=Strict");
    });

    it("should not set sameSite when false", () => {
      expect(serializeCookie("foo", "bar", { sameSite: false })).toEqual("foo=bar");
    });
  });

  describe('with "secure" option', () => {
    it("should include secure flag when true", () => {
      expect(serializeCookie("foo", "bar", { secure: true })).toEqual("foo=bar; Secure");
    });

    it("should not include secure flag when false", () => {
      expect(serializeCookie("foo", "bar", { secure: false })).toEqual("foo=bar");
    });
  });
});
