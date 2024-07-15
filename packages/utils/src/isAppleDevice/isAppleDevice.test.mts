import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { isAppleDevice } from ".";

const browserDevices = [
  {
    name: "iPad Air",
    userAgent:
      "Mozilla/5.0 (iPad; CPU OS 13_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/87.0.4280.77 Mobile/15E148 Safari/604.1",
    vendor: "Apple Computer, Inc.",
    iOSDevice: true,
  },
  {
    name: "Samsung SM-G955U",
    userAgent:
      "Mozilla/5.0 (Linux; Android 8.0.0; SM-G955U Build/R16NW) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.141 Mobile Safari/537.36",
    vendor: "Google Inc.",
    iOSDevice: false,
  },
  {
    name: "iPhone 12 Pro",
    userAgent:
      "Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1",
    vendor: "Apple Computer, Inc.",
    iOSDevice: true,
  },
  {
    name: "Samsung SM-G981B",
    userAgent:
      "Mozilla/5.0 (Linux; Android 10; SM-G981B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.162 Mobile Safari/537.36",
    vendor: "Google Inc.",
    iOSDevice: false,
  },
  {
    name: "Nest Hub Max",
    userAgent:
      "Mozilla/5.0 (X11; Linux aarch64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.188 Safari/537.36 CrKey/1.54.250320",
    vendor: "Google Inc.",
    iOSDevice: false,
  },
  {
    name: "Windows Chrome",
    userAgent:
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36",
    vendor: "",
    iOSDevice: false,
  },
  {
    name: "Windows Firefox",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:102.0) Gecko/20100101 Firefox/102.0",
    vendor: "",
    iOSDevice: false,
  },
  {
    name: "Windows edge",
    userAgent:
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.5060.114 Safari/537.36 Edg/103.0.1264.62",
    vendor: "Google Inc.",
    iOSDevice: false,
  },
  {
    name: "Chrome on Macos",
    userAgent:
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36",
    vendor: "Apple Computer, Inc.",
    iOSDevice: true,
  },
];

describe.concurrent.each(browserDevices)("iOS test for $name", (device) => {
  const { userAgent: originalUserAgent } = window.navigator;

  beforeEach(() => {
    Object.defineProperty(window, "navigator", {
      configurable: true,
      writable: true,
      value: { userAgent: device.userAgent, vendor: device.vendor },
    });
  });

  afterEach(() => {
    Object.defineProperty(window, "navigator", {
      configurable: true,
      value: originalUserAgent,
    });
  });

  it(`Should returns ${device.iOSDevice}`, () => {
    expect(isAppleDevice()).toBe(device.iOSDevice);
  });
});
