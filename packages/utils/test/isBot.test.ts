import { describe, expect, test } from "vitest";
import {
  botPatterns,
  botRegPattern,
  createIsBot,
  createIsBotFromList,
  isBot,
  isBotMatch,
  isBotMatches,
  isBotNaive,
  isBotPattern,
  isBotPatterns,
} from "../src/isBot";

let isBotInstance: ReturnType<typeof createIsBot>;
const browsers = getBrowsersAgent();
const crawlers = getCrawlers();

const BOT_USER_AGENT_EXAMPLE =
  "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)";
const BROWSER_USER_AGENT_EXAMPLE =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91 Safari/537.36";

const USER_AGENT_COMMON = [
  "Ada Chat Bot/1.0 Request Block",
  "Mozilla/5.0 (compatible; Yahoo! Slurp; http://help.yahoo.com/help/us/ysearch/slurp)",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4590.2 Safari/537.36 Chrome-Lighthouse",
];
const USER_AGENT_GOTCHAS = [
  "Mozilla/5.0 (Linux; Android 10; CUBOT_X30) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.85 Mobile Safari/537.36",
  "PS4Application libhttp/1.000 (PS4) CoreMedia libhttp/6.72 (PlayStation 4)",
];

describe("isBot", () => {
  describe("features", () => {
    test("pattern: pattern is a regex", () => {
      expect(botRegPattern).toBeInstanceOf(RegExp);
    });
    test("botPatterns: botPatterns is an array", () => {
      expect(botPatterns).toBeInstanceOf(Array);
      expect(botPatterns.every((item) => typeof item === "string")).toBe(true);
    });
    test("isBot: bot user agect string is recognized as bot", () => {
      expect(isBot(BOT_USER_AGENT_EXAMPLE)).toBe(true);
    });
    test("isBotMatch: find pattern in bot user agent string", () => {
      expect(isBotMatch(BOT_USER_AGENT_EXAMPLE)).toBe("Google");
    });
    test("isBotMatches: find all patterns in bot user agent string", () => {
      expect(isBotMatches(BOT_USER_AGENT_EXAMPLE)).toContain("Google");
      expect(isBotMatches(BOT_USER_AGENT_EXAMPLE)).toHaveLength(3);
    });
    test("isBotPattern: find first pattern in bot user agent string", () => {
      expect(isBotPattern(BOT_USER_AGENT_EXAMPLE)).toBe(
        "(?<! (?:channel/|google/))google(?!(app|/google| pixel))",
      );
    });
    test("isBotPatterns: find all patterns in bot user agent string", () => {
      expect(isBotPatterns(BOT_USER_AGENT_EXAMPLE)).toContain(
        "(?<! (?:channel/|google/))google(?!(app|/google| pixel))",
      );
      expect(isBotPatterns(BOT_USER_AGENT_EXAMPLE)).toHaveLength(3);
    });
    test("createIsBot: create custom isBot function with custom pattern", () => {
      const customisBot = createIsBot(/bot/i);
      expect(customisBot(BOT_USER_AGENT_EXAMPLE)).toBe(true);
    });
    test("createIsBotFromList: create custom isBot function with custom pattern", () => {
      const ChromeLighthouseUserAgentStrings: string[] = [
        "mozilla/5.0 (macintosh; intel mac os x 10_15_7) applewebkit/537.36 (khtml, like gecko) chrome/94.0.4590.2 safari/537.36 chrome-lighthouse",
        "mozilla/5.0 (linux; android 7.0; moto g (4)) applewebkit/537.36 (khtml, like gecko) chrome/94.0.4590.2 mobile safari/537.36 chrome-lighthouse",
      ];
      const patternsToRemove: Set<string> = new Set(
        ChromeLighthouseUserAgentStrings.flatMap(isBotMatches),
      );
      const isBot2 = createIsBotFromList(
        botPatterns.filter((record: string): boolean => patternsToRemove.has(record) === false),
      );
      const [ua] = ChromeLighthouseUserAgentStrings;
      expect(isBot(ua)).toBe(true);
      expect(isBot2(ua)).toBe(false);
    });
    test.each([null, undefined, ""])(
      "all functions can accept %p",
      (value: string | null | undefined) => {
        expect(isBot(value)).toBe(false);
        expect(isBotMatch(value)).toBe(null);
        expect(isBotMatches(value)).toEqual([]);
        expect(isBotPattern(value)).toBe(null);
        expect(isBotPatterns(value)).toEqual([]);
      },
    );
  });

  describe("isBotNaive", () => {
    test.each([50])("a large number of user agent strings can be detected (>%s%)", (percent) => {
      const ratio = crawlers.filter((ua) => isBotNaive(ua)).length / crawlers.length;
      expect(ratio).toBeLessThan(1);
      expect(ratio).toBeGreaterThan(percent / 100);
    });
    test.each([2])("a small number of browsers is falsely detected as bots (<%s%)", (percent) => {
      const ratio = browsers.filter((ua) => isBotNaive(ua)).length / browsers.length;
      expect(ratio).toBeGreaterThan(0);
      expect(ratio).toBeLessThan(percent / 100);
    });
  });

  describe("fixtures", () => {
    test(`✔︎ ${crawlers.length} user agent string should be recognized as crawler`, () => {
      let successCount = 0;
      const misidentifiedStrings: string[] = [];
      for (const crawler of crawlers) {
        if (isBot(crawler)) {
          successCount++;
        } else {
          misidentifiedStrings.push(crawler);
        }
      }
      expect(misidentifiedStrings).toEqual([]);
      expect(successCount).toBe(crawlers.length);
    });
    test(`✘ ${browsers.length} user agent string should not be recognized as crawler`, () => {
      let successCount = 0;
      const misidentifiedStrings: string[] = [];
      for (const browser of browsers) {
        if (isBot(browser)) {
          misidentifiedStrings.push(browser);
        } else {
          successCount++;
        }
      }
      expect(misidentifiedStrings).toEqual([]);
      expect(successCount).toBe(browsers.length);
    });
  });
});

function getBrowsersAgent() {
  return [
    // AAA App User Agent String Examples "Native and Webview based user agent forms for a correct app user agent string composition:",
    "ExampleApp/1 Dalvik/2.1.0 (Linux; U; Android 6.0.1; vivo 1610 Build/MMB29M)",
    "ExampleApp/1 iPhone5,2 iOS/10_1 CFNetwork/808.3 Darwin/16.3.0",
    "ExampleApp/1 Windows Phone/10.0 Microsoft; Lumia 550",
    "Mozilla/5.0 (iPhone; CPU iPhone OS 12_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 WebViewApp ExampleApp/1 iPhone11,8",
    "Mozilla/5.0 (Linux; Android 9; Pixel Build/PQ3A.190801.002; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/77.0.3865.73 Mobile Safari/537.36 WebViewApp ExampleApp/1",
    "Mozilla/5.0 (Windows Phone 10.0; Android 4.2.1; Microsoft; Lumia 535 Dual SIM) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.0.0 Mobile Safari/537.36 Edge/13.0 WebViewApp ExampleApp/1",
    // ABrowse:
    "Mozilla/5.0 (compatible; U; ABrowse 0.6; Syllable) AppleWebKit/420+ (KHTML, like Gecko)",
    // Amazon 4K Fire TV:
    "Mozilla/5.0 (Linux; Android 5.1; AFTS Build/LMY47O) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/41.99900.2250.0242 Safari/537.36",
    // Amiga:
    "Amiga-AWeb/3.4.167SE",
    "AmigaOS 4.0 AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94 Tablet Safari/537.36)",
    "AmigaVoyager/3.2 (AmigaOS/MC680x0)",
    "AmigaVoyager/3.4.4 (MorphOS/PPC native)",
    "IBrowse/2.4demo (AmigaOS 3.9; 68K)",
    "IBrowse/2.5.4demo (Amiga; AmigaOS 3.1.4; Build 25.96 68K)",
    "IBrowse/2.5.5 (Amiga; MorphOS 3.16; Build 25.99 68K)",
    "IBrowse/2.55 (AmigaOS 3.2)",
    "Mozilla/5.0 (Amiga; PowerPC AmigaOS 4.1; Odyssey Web Browser; rv:1.23) AppleWebKit/538.1 (KHTML, like Gecko) OWB/1.23 Safari/538.1",
    "Mozilla/5.0 (AmigaOs; 4.0; en-US; rv:1.8.1.21pre)  AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.666.4147.105 Safari/537.36",
    "Mozilla/5.0 (compatible; IBrowse 2.5.3; AmigaOS 3.1.2)",
    "Mozilla/5.0 (PowerPC AmigaOS 4.1; Odyssey Web Browser; rv:1.23) AppleWebKit/538.1 (KHTML, like Gecko) OWB/1.23 Safari/538.1",
    "Mozilla/6.0 (compatible; Amiga-AWeb)",
    "Mozilla/6.0 (compatible; MSIE 7.01; Amiga-AWeb)",
    "Mozilla/6.0 (Macintosh; U; Amiga-AWeb) Safari 2.9",
    "Mozilla/6.0 (Macintosh; U; Amiga-AWeb) Safari 3.1",
    "Voyager3/AmigaoS3.1",
    // Amigo:
    "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/28.0.1500.74 Safari/537.36 MRCHROME",
    // Android:
    "Dalvik/2.1.0 (Linux; U; Android 5.1.1; AFTT Build/LVY48F) CTV",
    "Dalvik/2.1.0 (Linux; U; Android 9; Portal Build/PKQ1.191225.001)",
    "Dalvik/2.1.0 (Linux; U; Android 9; SM-G965U Build/PPR1.180610.011)",
    "Mozilla/5.0 (Linux; U; Android 2.1-update1; de-de; HTC Desire 1.19.161.5 Build/ERE27) AppleWebKit/530.17 (KHTML, like Gecko) Version/4.0 Mobile Safari/530.17(Linux LLC 1.2)",
    "Mozilla/5.0 (Linux; U; Android 2.2) AppleWebKit/533.1 (KHTML, like Gecko) Version/4.0 Mobile Safari/533.1",
    // Android Browser:
    "Mozilla/5.0 (Linux; U; Android 4.04; pt-pt; H135 Build/MocorDroid2.3.5) AppleWebKit/533.1 (KHTML, like Gecko) Version/4.0 Mobile Safari/533.1",
    // Android WebView:
    "Mozilla/5.0 (Linux; Android 10; SM-G973F Build/QQ3A.200805.001; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/85.0.4183.101 Mobile Safari/537.36 trill_2021806060 JsSdk/1.0 NetType/WIFI Channel/googleplay AppName/musical_ly app_version/18.6.6 ByteLocale/fr ByteFullLocale/fr Region/FR",
    "Mozilla/5.0 (Linux; Android 8.1.0; BQ-5516L Build/O11019; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/81.0.4044.117 Mobile Safari/537.36 trill_2021509030 JsSdk/1.0 NetType/WIFI Channel/googleplay AppName/musical_ly app_version/15.9.3 ByteLocale/ru-RU ByteFullLocale/ru-RU Region/RU AppSkin/white",
    // AOL:
    "Mozilla/4.0 (compatible; MSIE 6.0; AOL 7.0; Windows NT 5.1)",
    "Mozilla/4.0 (compatible; MSIE 6.0; AOL 9.0; Windows NT 5.1; SV1; .NET CLR 1.1.4322)",
    "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.100 ADG/11.0.2566 AOLBUILD/11.0.2566 Safari/537.36",
    // Apple TV:
    "AppName/1 CFNetwork/758.1.2 Darwin/15.0.0",
    "AppName/1 CFNetwork/758.1.3 AppleTV/16.0.0",
    "Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Mobile/15J380",
    // Arora:
    "Mozilla/5.0 (Macintosh; U; Intel Mac OS X; en-US) AppleWebKit/532.1 (KHTML, like Gecko) Arora/0.10.1 (Git: 1329 e5385f3) Safari/532.1",
    "Mozilla/5.0 (Macintosh; U; PPC Mac OS X; en-US) AppleWebKit/533.3 (KHTML, like Gecko) Arora/0.11.0 Safari/533.3",
    "Mozilla/5.0 (Windows; U; ; en-NZ) AppleWebKit/527 (KHTML, like Gecko, Safari/419.3) Arora/0.8.0",
    "Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US) AppleWebKit/527+ (KHTML, like Gecko, Safari/419.3) Arora/0.6 (Change: )",
    "Mozilla/5.0 (Windows; U; Windows NT 5.1; zh-CN) AppleWebKit/523.15 (KHTML, like Gecko, Safari/419.3) Arora/0.3 (Change: 287 c9dfb30)",
    "Mozilla/5.0 (X11; U; Linux; hu-HU) AppleWebKit/523.15 (KHTML, like Gecko, Safari/419.3) Arora/0.4",
    // Avant:
    "Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.0; Avant Browser [avantbrowser.com]; Hotbar 4.4.5.0)",
    "Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; Avant Browser; Avant Browser; .NET CLR 1.1.4322)",
    "Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; Avant Browser; Avant Browser; InfoPath.2)",
    "Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 6.1; Trident/4.0; Avant Browser; SLCC2; .NET CLR 2.0.50727; .NET CLR 3.5.30729; .NET CLR 3.0.30729; Media Center PC 6.0; InfoPath.2; .NET4.0C; Tablet PC 2.0; .NET4.0E; Avant Browser)",
    "Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 6.1; WOW64; Trident/4.0; Avant Browser; SLCC2; .NET CLR 2.0.50727; .NET CLR 3.5.30729; .NET CLR 3.0.30729; Media Center PC 6.0; BRI/2; MAEM; .NET4.0C; .NET4.0E; EIE10;ENUSWOL)",
    // Avant Browser:
    "Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1; Avant Browser; InfoPath.1)",
    // Baidu Box App:
    "Mozilla/5.0 (iPhone; CPU iPhone OS 10_0_1 like Mac OS X) AppleWebKit/602.1.50 (KHTML, like Gecko) Mobile/14A403 baiduboxapp/11.0.0.12 (Baidu; P2 10.0.1)",
    "Mozilla/5.0 (iPhone; CPU iPhone OS 13_3_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 SP-engine/2.16.0 main/1.0 baiduboxapp/11.20.0.17 (Baidu; P2 13.3.1) NABar/1.0",
    "Mozilla/5.0 (Linux; Android 5.1.1; vivo X7 Build/LMY47V; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/48.0.2564.116 Mobile Safari/537.36 baiduboxapp/8.6.5 (Baidu; P1 5.1.1)",
    "Mozilla/5.0 (Linux; U; Android 4.1.2; zh-cn; HUAWEI MT1-U06 Build/HuaweiMT1-U06) AppleWebKit/534.30 (KHTML, like Gecko) Version/4.0 Mobile Safari/534.30 baiduboxapp/042_2.7.3_diordna_8021_027/IEWAUH_61_2.1.4_60U-1TM+IEWAUH/7300001a/|544176010472968/1",
    // Baidu Spark:
    "Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 5.1; Trident/4.0; BIDUBrowser 2.6)",
    // Beonex:
    "Mozilla/5.0 (Windows; U; Win9x; en; Stable) Gecko/20020911 Beonex/0.8.1-stable",
    // Bing Search App:
    "Mozilla/5.0 (iPhone; CPU iPhone OS 12_3_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/12.0 Mobile/15E148 Safari/605.1.15 BingWeb/6.37.2.0",
    "Mozilla/5.0 (Linux; Android 8.0.0; SM-G960U Build/R16NW; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/70.0.3538.110 Mobile Safari/537.36 BingWeb/9.4.26267402",
    // Blackberry Browser:
    "BlackBerry8520/5.0.0.681 Profile/MIDP-2.1 Configuration/CLDC-1.1 VendorID/600",
    "Mozilla/5.0 (BB10; Kbd) AppleWebKit/537.35+ (KHTML, like Gecko) Version/10.3.2.2876 Mobile Safari/537.35+",
    "Mozilla/5.0 (BB10; Touch) AppleWebKit/537.35+ (KHTML, like Gecko) Version/10.3.2.2639 Mobile Safari/537.35+",
    "Mozilla/5.0 (BlackBerry; U; BlackBerry 9780; en-GB) AppleWebKit/534.8+ (KHTML, like Gecko) Version/6.0.0.546 Mobile Safari/534.8+",
    // Brave:
    "Mozilla/5.0 (Linux; Android 8.0.0; SM-G935F Build/R16NW) AppleWebKit/537.36 (KHTML, like Gecko) Brave Chrome/69.0.3497.100 Mobile Safari/537.36",
    "Mozilla/5.0 (Linux; Android 9; Nokia 7 plus) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.157 Mobile Safari/537.36 Brave/74",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_2) AppleWebKit/537.36 (KHTML, like Gecko) brave/0.7.9 Chrome/47.0.2526.73 Electron/0.36.2 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_4) AppleWebKit/537.36 (KHTML, like Gecko) brave/0.8.3 Chrome/49.0.2623.108 Brave/0.37.3 Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Brave Chrome/80.0.3987.132 Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) brave/0.8.3 Chrome/49.0.2623.108 Brave/0.37.3 Safari/537.36",
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Brave Chrome/76.0.3809.132 Safari/537.36",
    // Camino:
    "Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10.6; en; rv:1.9.2.28) Gecko/20120308 Camino/2.1.2 (like Firefox/3.6.28)",
    // Charon:
    "Mozilla/4.08 (Charon; Inferno)",
    // Cheetah Browser:
    "Mozilla/5.0 (Windows NT 5.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/34.0.1847.137 Safari/537.36 LBBROWSER",
    // Cheshire:
    "Mozilla/5.0 (Macintosh; U; PPC Mac OS X; en) AppleWebKit/418.9 (KHTML, like Gecko, Safari) Safari/419.3 Cheshire/1.0.ALPHA",
    // Chrome:
    "Mozilla/5.0 (Linux; Android 4.4.2; SM-G7102 Build/KOT49H) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3202.84 Mobile Safari/537.36",
    "Mozilla/5.0 (Linux; Android 5.1.1; Nexus 5 Build/LMY48B; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/43.0.2357.65 Mobile Safari/537.36",
    "Mozilla/5.0 (Linux; Android 6.0.1; RedMi Note 5 Build/RB3N5C; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/68.0.3440.91 Mobile Safari/537.36",
    "Mozilla/5.0 (Linux; Android 7.0; BLL-L22 Build/HUAWEIBLL-L22) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.91 Mobile Safari/537.36",
    "Mozilla/5.0 (Linux; Android 9; ANE-LX1; Tesseract/1.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.132 Mobile Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4758.102 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/31.0.1650.63 Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36",
    "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.1 (KHTML, like Gecko) Chrome/21.0.1180.83 Safari/537.1",
    "Mozilla/5.0 (X11; CrOS x86_64 11895.118.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.159 Safari/537.36",
    "Mozilla/5.0 (X11; CrOS x86_64 13904.66.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36",
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/44.0.2403.157 Safari/537.36",
    // Chromecast:
    "Mozilla/5.0 (CrKey armv7l 1.5.16041) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/31.0.1650.0 Safari/537.36",
    // ChromePlus:
    "Mozilla/5.0 (Windows; U; Windows NT 6.1; en-US) AppleWebKit/534.13 (KHTML, like Gecko) Chrome/9.0.597.98 Safari/534.13 ChromePlus/1.6.0.0",
    // Chromium:
    "Mozilla/5.0 (Linux; Ubuntu 14.04 like Android 4.4) AppleWebKit/537.36 Chromium/35.0.1870.2 Mobile Safari/537.36",
    "Mozilla/5.0 (SMART-TV; X11; Linux armv7l) AppleWebKit/537.42 (KHTML, like Gecko) Chromium/25.0.1349.2 Chrome/25.0.1349.2 Safari/537.42",
    "Mozilla/5.0 (X11; Linux i686) AppleWebKit/537.36 (KHTML, like Gecko) Ubuntu Chromium/65.0.3325.181 Chrome/65.0.3325.181 Safari/537.36",
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/534.30 (KHTML, like Gecko) Ubuntu/11.04 Chromium/12.0.742.112 Chrome/12.0.742.112 Safari/534.30",
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Ubuntu Chromium/31.0.1650.63 Chrome/31.0.1650.63 Safari/537.36",
    // CometBird:
    "Mozilla/5.0 (Windows NT 6.2; WOW64; rv:11.0) Gecko/20100101 Firefox/11.0 CometBird/11.0",
    // Comodo Dragon:
    "Mozilla/5.0 (Windows NT 5.1) AppleWebKit/537.1 (KHTML, like Gecko) Chrome/21.0.1180.75 Safari/537.1 Comodo_Dragon/21.0.2.0",
    "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/535.11 (KHTML, like Gecko) Comodo_Dragon/17.1.0.0 Chrome/17.0.963.38 Safari/535.11",
    "Mozilla/5.0 (Windows; U; Windows NT 6.1; en-US) AppleWebKit/534.3 (KHTML, like Gecko) Comodo_Dragon/6.0.0.10 Chrome/6.0.472.63 Safari/534.3",
    "Mozilla/5.0 (X11; U; Linux x86_64; en-US) AppleWebKit/532.5 (KHTML, like Gecko) Comodo_Dragon/4.1.1.11 Chrome/4.1.249.1042 Safari/532.5",
    // Comodo IceDragon:
    "Mozilla/5.0 (US-Government.80.1; rv:40.0) Gecko/20100101 IceDragon/40.1.1.18 Firefox/40.0.2",
    "Mozilla/5.0 (Web0S 10.0; Linux/SmartTV) Gecko/20100101 Firefox/72.0 IceDragon/72.0.2",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:65.0) Gecko/20100101 Firefox/65.0 IceDragon/65.0.2",
    "Mozilla/5.0 (Windows NT 10.0; WOW64; rv:40.0) Gecko/20100101 IceDragon/40.1.1.18 Firefox/40.0.2",
    "Mozilla/5.0 (Windows NT 6.1; rv:26.0) Gecko/20100101 Firefox/26.0 IceDragon/26.0.0.2",
    // Conkeror:
    "Mozilla/5.0 (X11; Linux x86_64; rv:25.0) Gecko/20100101 conkeror/1.0pre",
    // CoolNovo:
    "Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 6.1; WOW64; Trident/6.0; SLCC2; .NET CLR 2.0.50727; .NET CLR 3.5.30729; .NET CLR 3.0.30729; Media Center PC 6.0; .NET4.0C; .NET4.0E; InfoPath.2; CoolNovo/2.0.9.20)",
    "Mozilla/5.0 (Windows NT 5.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/27.0.1453.110 Safari/537.36 CoolNovo/2.0.9.20",
    "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/27.0.1453.110 Safari/537.36 CoolNovo/2.0.9.20",
    // Cubot:
    "Mozilla/5.0 (Linux; Android 4.2.2; CUBOT C11 Build/JDQ39) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/31.0.1650.57 Mobile Safari/537.36 OPR/18.0.1290.66961",
    "Mozilla/5.0 (Linux; Android 6.0; CUBOT DINOSAUR Build/MRA58K; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/44.0.2403.119 Mobile Safari/537.36",
    "Mozilla/5.0 (Linux; Android 6.0; CUBOT MAX Build/MRA58K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.81 Mobile Safari/537.36",
    "Mozilla/5.0 (Linux; Android 6.0; CUBOT MAX) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.121 Mobile Safari/537.36",
    "Mozilla/5.0 (Linux; Android 8.0.0; CUBOT_P20) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.110 Mobile Safari/537.36",
    // Dolfin:
    "Mozilla/5.0 (SAMSUNG; SAMSUNG-GT-S5780/S5780XXKF5; U; Bada/1.1; de-de) AppleWebKit/533.1 (KHTML, like Gecko) Dolfin/2.0 Mobile WQVGA SMM-MMS/1.2.0 OPN-B",
    "SAMSUNG-GT-S5620/1.0 SHP/VPP/R5 Dolfin/1.5 Nextreaming SMM-MMS/1.2.0 profile/MIDP-2.1 configuration/CLDC-1.1",
    // Dooble:
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14) AppleWebKit/605.1.15 (KHTML, like Gecko) Dooble/2.1.9.3 Safari/605.1.15",
    "Mozilla/5.0 (Windows NT 6.2; WOW64) AppleWebKit/538.1 (KHTML, like Gecko) Dooble/1.56d Safari/538.1",
    "Mozilla/5.0 (X11; FreeBSD amd64) AppleWebKit/605.1.15 (KHTML, like Gecko) Dooble/2.1.9.2",
    "Mozilla/5.0 (X11; OpenBSD amd64) AppleWebKit/605.1.15 (KHTML, like Gecko) Dooble/2.1.9.2",
    // DuckDuckGo:
    "Android 13) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/118.0.0.0 Mobile DuckDuckGo/5 Safari/537.36",
    "AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/118.0.0.0 Mobile DuckDuckGo/5 Safari/537.36",
    "AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/81.0.4044.138 DuckDuckGo/5 Safari/537.36",
    "Mozilla/5.0 (Linux; Android 10) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/84.0.4147.111 Mobile DuckDuckGo/5 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 DuckDuckGo/7",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_4) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 DuckDuckGo/7",
    // Edge:
    "Mozilla/5.0 (iPhone; CPU iPhone OS 13_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0 EdgiOS/44.10.19 Mobile/15E148 Safari/605.1.15",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.92 Safari/537.36 Edg/81.0.416.45",
    "Mozilla/5.0 (Windows IoT 10.0; Android 6.0.1; WebView/3.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/64.0.3282.140 Mobile Safari/537.36 Edge/17.17134",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/64.0.3282.140 Safari/537.36 Edge/17.17134",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.113 Safari/537.36 Edg/81.0.416.62",
    "Mozilla/5.0 (Windows Phone 10.0; Android 6.0.1; Microsoft; Lumia 650) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/52.0.2743.116 Mobile Safari/537.36 Edge/15.15254",
    "Mozilla/5.0 (Windows Phone 10.0; Android 6.0.1; NOKIA; Lumia 930) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.79 Mobile Safari/537.36 Edge/14.14393",
    // Edge Xbox One:
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64; Xbox; Xbox One) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.102 Safari/537.36 Edge/18.18363",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64; XBOX_ONE_ED) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.79 Safari/537.36 Edge/14.14393",
    // Electron Application:
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) PlutoTV/0.2.0 Chrome/49.0.2623.75 Electron/0.37.2 Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0.18362; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Slack/4.4.2 Chrome/78.0.3904.130 Electron/7.2.1 Safari/537.36 WindowsStore/10.0.18362 Sonic Slack_SSB/4.4.2",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Atom/1.45.0 Chrome/69.0.3497.128 Electron/4.2.7 Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) discord/0.0.306 Chrome/78.0.3904.130 Electron/7.1.11 Safari/537.36",
    "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) electron/1.0.0 Chrome/53.0.2785.113 Electron/1.4.3 Safari/537.36",
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Cypress/3.3.2 Chrome/61.0.3163.100 Electron/2.0.18 Safari/537.36",
    // Elinks:
    "ELinks/0.12~pre6-1ubuntu1 (textmode; Ubuntu; Linux 3.11.0-13-generic i686; 100x25-2)",
    // ESPN: Sports News & Highlights App:
    "ESPN App/6.12.0 Dalvik/2.1.0 (Linux; U; Android 9; SM-G965U Build/PPR1.180610.011)",
    "espn app/6.14.0 dalvik/2.1.0 (linux; u; android 5.1.1; kfsuwi build/lvy48f)",
    // Facebook:
    "Mozilla/5.0 (Windows NT 10.0.16299.98; osmeta 10.3.3308) AppleWebKit/602.1.1 (KHTML, like Gecko) Version/9.0 Safari/602.1.1 osmeta/10.3.3308 Build/3308 [FBAN/FBW;FBAV/140.0.0.232.179;FBBV/83145113;FBDV/WindowsDevice;FBMD/Predator G9-793;FBSN/Windows;FBSV/10.0.16299.125;FBSS/1;FBCR/;FBID/desktop;FBLC/de_DE;FBOP/45;FBRV/0]",
    // Facebook App:
    "Mozilla/5.0 (iPhone; CPU iPhone OS 11_4_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15G77 [FBAN/FBIOS;FBAV/183.0.0.41.81;FBBV/119182652;FBDV/iPhone6,2;FBMD/iPhone;FBSN/iOS;FBSV/11.4.1;FBSS/2;FBCR/VIVO;FBID/phone;FBLC/pt_BR;FBOP/5;FBRV/0]",
    "Mozilla/5.0 (iPhone; CPU iPhone OS 13_3_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 [FBAN/FBIOS;FBDV/iPhone11,8;FBMD/iPhone;FBSN/iOS;FBSV/13.3.1;FBSS/2;FBID/phone;FBLC/en_US;FBOP/5;FBCR/]",
    "Mozilla/5.0 (Linux; Android 7.0; SM-G570M Build/NRD90M; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/69.0.3497.100 Mobile Safari/537.36 [FB_IAB/FB4A;FBAV/192.0.0.34.85;]",
    "Mozilla/5.0 (Linux; Android 9; SM-G950U Build/PPR1.180610.011; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/80.0.3987.149 Mobile Safari/537.36 [FB_IAB/FB4A;FBAV/263.0.0.46.121;]",
    // Fennec:
    "Mozilla/5.0 (Android; Linux armv7l; rv:2.0.1) Gecko/20100101 Firefox/4.0.1 Fennec/2.0.1(Linux LLC 1.2)",
    "Mozilla/5.0 (Maemo; Linux armv7l; rv:2.0.1) Gecko/20100101 Firefox/4.0.1 Fennec/2.0.1(Linux LLC 1.2)",
    // Firebird:
    "Mozilla/5.0 (Windows; U; Win95; en-US; rv:1.5) Gecko/20031007 Firebird/0.7",
    // Firefox:
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.9; rv:26.0) Gecko/20100101 Firefox/26.0",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10; rv:33.0) Gecko/20100101 Firefox/33.0",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:100.0) Gecko/20100101 Firefox/100.0",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:67.0) Gecko/20100101 Firefox/67.0",
    "Mozilla/5.0 (Windows NT 5.1; rv:7.0.1) Gecko/20100101 Firefox/7.0.1",
    "Mozilla/5.0 (Windows; rv:26.0) Gecko/20100101 Firefox/26.0",
    "Mozilla/5.0 (Windows; rv:49.0) Gecko/20100101 Firefox/49.0",
    "Mozilla/5.0 (Windows; rv:55.0) Gecko/20100101 Firefox/55.0",
    "Mozilla/5.0 (Windows; rv:65.0) Gecko/20100101 Firefox/65.0",
    "Mozilla/5.0 (Windows; rv:81.0) Gecko/20100101 Firefox/81.0",
    "Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US; rv:1.8.0.8) Gecko/20061025 Firefox/1.5.0.8",
    "Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US; rv:1.9.1.7) Gecko/20091221 Firefox/3.5.7 (.NET CLR 3.5.30729)",
    "Mozilla/5.0 (X11; U; Darwin Power Macintosh; en-US; rv:1.8.0.12) Gecko/20070803 Firefox/1.5.0.12 Fink Community Edition",
    "Mozilla/5.0 (X11; Ubuntu; Linux i686; rv:24.0) Gecko/20100101 Firefox/24.0",
    // Firefox Focus:
    "Mozilla/4.0 (compatible; MSIE 6.0; Windows 98; FOCUS247; .NET CLR 1.1.4322)",
    "Mozilla/5.0 (iPhone; CPU iPhone OS 11_4_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Focus/4.1 Mobile/15G77",
    "Mozilla/5.0 (Linux; Android 4.4.2; InFocus M2_3G Build/KOT49H) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.91 Mobile Safari/537.36",
    "Mozilla/5.0 (Linux; Android 6.0.1) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Focus/4.1 Chrome/63.0.3239.111 Mobile Safari/537.36",
    "Mozilla/5.0 (Linux; Android 8.0.0) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Focus/7.0.13 Chrome/70.0.3538.110 Mobile Safari/537.36",
    // Firefox Lite:
    "Mozilla/5.0 (Linux; Android 8.1.0; BKK-LX2 Build/HONORBKK-LX2; rv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Rocket/2.1.2(17721) Chrome/79.0.3945.93 Mobile Safari/537.36",
    "Mozilla/5.0 (Linux; Android 9; SM-N935K Build/PPR1.180610.011; rv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Rocket/2.1.10(18757) Chrome/80.0.3987.119 Mobile Safari/537.36",
    "Mozilla/5.0 (Linux; U; Android 4.3.1; en-us; SAMSUNG-SGH-I727 Build/JLS36I) AppleWebKit/534.30 (KHTML, like Gecko) Version/4.0 Mobile Safari/534.30 CyanogenMod/10.2.0/skyrocket",
    // Fireweb Navigator:
    "Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US; rv:2.0) Treco/20110515 Fireweb Navigator/2.4",
    // Flipboard:
    "Mozilla/5.0 (iPad; CPU OS 12_1_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/16C50 Flipboard/4.2.32",
    "Mozilla/5.0 (Linux; Android 4.4.2; SM-G7102 Build/KOT49H) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/30.0.0.0 Mobile Safari/537.36 Flipboard/2.2.9/2199,2.2.9.2199,Ù¢Ù Ù¡Ù¤-Ù Ù¤-Ù Ù§ Ù¡Ù§:Ù¢Ù§, +Ù Ù¢Ù Ù",
    "Mozilla/5.0 (Linux; Android 6.0.1; SM-J500M Build/MMB29M; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/68.0.3440.91 Mobile Safari/537.36 Flipboard-Briefing/2.1.22",
    "Mozilla/5.0 (Linux; Android 8.0.0; LG-LS998 Build/OPR1.170623.026; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/74.0.3729.157 Mobile Safari/537.36 Flipboard/4.2.24/4732,4.2.24.4732",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15) AppleWebKit/605.1.15 (KHTML, like Gecko) Flipboard/4.2.59",
    // Flock:
    "Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10.6; en-US; rv:1.9.0.19) Gecko/2010062819 Firefox/3.0.19 Flock/2.6.1",
    "Mozilla/5.0 (Macintosh; U; PPC Mac OS X Mach-O; en-US; rv:1.8b5) Gecko/20051102 Flock/0.4 Firefox/1.0+",
    "Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US; rv:1.8.0.12; photobucket) Gecko/20070531 Firefox/1.5.0.12 Flock/0.7.14",
    "Mozilla/5.0 (Windows; U; Windows NT 6.1; en-US; rv:1.9.0.19) Gecko/2010062819 Firefox/3.0.19 Flock/2.6.1",
    "Mozilla/5.0 (Windows; U; Windows NT 6.1; pl; rv:1.9.0.16) Gecko/2010021013 Firefox/3.0.16 Flock/2.5.6",
    // Fluid:
    "Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_5_6; en-us) AppleWebKit/528.16 (KHTML, like Gecko) Fluid/0.9.6 Safari/528.16",
    // Fubo TV:
    "fuboTV/4.75.0 (Linux;Android 9; AFTDCT31 Build/PS7664.3772N) FuboPlayer/v1.34.0",
    // Galeon:
    "Mozilla/5.0 (X11; U; FreeBSD i386; en-US; rv:1.7.12) Gecko/20051105 Galeon/1.3.21",
    // Ghostery Private Browser:
    "Mozilla/5.0 (Android 11; Mobile; rv:105.0; Ghostery:3.0) Gecko/105.0 Firefox/105.0",
    // GNOME Web:
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/534.26+ (KHTML, like Gecko) Version/5.0 Safari/534.26+ Ubuntu/10.10 (2.30.6-1ubuntu5) Epiphany/2.30.6",
    // Gog Galaxy:
    "GOGGalaxyClient/2.0.62.26 (GOG Galaxy) 83b6745cff679691b69876bc7ee33e05e5d90bda (win10 x64)",
    // Google News:
    "Mozilla/5.0 (Linux; Android 14; Pixel 6 Build/UPB3.230519.014) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/115.0.5790.21 Mobile Safari/537.36 GNews Android/2022137898",
    // Google Nexus Player:
    "Dalvik/2.1.0 (Linux; U; Android 6.0.1; Nexus Player Build/MMB29T)",
    // Google Pixel:
    "Mozilla/5.0 (Linux; Android 12; Pixel 3a) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Mobile Safari/537.36",
    "Mozilla/5.0 (Linux; Android 13; Pixel 6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.0.0 Mobile Safari/537.36",
    "Mozilla/5.0 (Linux; Android 7.1.2; google Pixel 2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.0.0 Mobile Safari/537.36",
    "Safari/600.2.5 MobileRicardo (Google Pixel 6; android 13) ricardo.ch/8.28.2-82802 (debug) deviceId/dfa51331-fdeb-46d7-aa01-8d09a263ef90",
    // Google Search App:
    "Mozilla/5.0 (iPad; CPU OS 9_1 like Mac OS X) AppleWebKit/600.1.4 (KHTML, like Gecko) GSA/10.0.63022 Mobile/13B143 Safari/600.1.4",
    "Mozilla/5.0 (iPhone; CPU iPhone OS 13_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) GSA/102.0.304944559 Mobile/15E148 Safari/604.1",
    // Hawk QuickBrowser:
    "Mozilla/5.0 (Linux; U; Android 7.0; es-us; Moto C Build/NRD90M.063) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/69.0.3497.100 Mobile Safari/537.36 Hawk/QuickBrowser/2.4.8.22800",
    // HuaweiBrowser:
    "Mozilla/5.0 (Linux; Android 10; MAR-LX3A; HMSCore 6.12.4.311; GMSCore 23.48.16) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4844.88 HuaweiBrowser/14.0.2.311 Mobile Safari/537.36",
    "Mozilla/5.0 (Linux; Android 12; HarmonyOS; TET-AN00; HMSCore 6.12.4.312) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4844.88 HuaweiBrowser/14.0.5.301 Mobile Safari/537.36",
    // Hulu:
    "hulu/3.65.0.308030 (android 9; en_us; sm-g965u; build/ppr1.180610.011;)",
    "hulu/50000130 cfnetwork/976 darwin/18.2.0",
    "Hulu/6.8.1 (iOS 13.3; en_US; iPhone12,1; 17C54)",
    // IBrowse:
    "Mozilla/5.0 (compatible; IBrowse 3.0; AmigaOS4.0)",
    // iCab:
    "Mozilla/5.0 (Macintosh; U; PPC Mac OS X 10_5_8; en-us) AppleWebKit/533.19.4 (KHTML, like Gecko) iCab/4.8 Safari/533.16",
    // IceCat:
    "Mozilla/5.0 (X11; U; Linux sparc64; es-PY; rv:5.0) Gecko/20100101 IceCat/5.0 (like Firefox/5.0; Debian-6.0.1)",
    // IceDragon:
    "Mozilla/5.0 (Windows NT 6.2; WOW64; rv:25.0) Gecko/20100101 Firefox/25.0 IceDragon/25.0.0.1",
    // Iceweasel:
    "Mozilla/5.0 (X11; Linux x86_64; rv:17.0) Gecko/20131030 Firefox/17.0 Iceweasel/17.0.10",
    "Mozilla/5.0 (X11; Linux x86_64; rv:38.0) Gecko/20100101 Firefox/38.0 Iceweasel/38.4.0",
    "Mozilla/5.0 (X11; U; Linux i686; fr; rv:1.9.0.11) Gecko/2009061212 Iceweasel/3.0.6 (Debian-3.0.6-1)",
    // Instagram:
    "Mozilla/5.0 (iPhone; CPU iPhone OS 12_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/16A366 Instagram 66.0.0.14.101 (iPhone10,2; iOS 12_0; pt_BR; pt-BR; scale=2.61; gamut=wide; 1080x1920; 126719886)",
    "Mozilla/5.0 (iPhone; CPU iPhone OS 13_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 Instagram 123.1.0.26.115 (iPhone11,8; iOS 13_3; en_US; en-US; scale=2.00; 828x1792; 190542906)",
    "Mozilla/5.0 (Linux; Android 11; Pixel 2 Build/RP1A.201005.004.A1; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/91.0.4472.120 Mobile Safari/537.36 Instagram 194.0.0.36.172 Android (30/11; 420dpi; 1080x1878; Google/google; Pixel 2; walleye; walleye; en_US; 301484483)",
    "Mozilla/5.0 (Linux; Android 7.0; Lenovo K33b36 Build/NRD90N; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/65.0.3325.109 Mobile Safari/537.36 Instagram 41.0.0.13.92 Android (24/7.0; 480dpi; 1080x1920; LENOVO/Lenovo; Lenovo K33b36; K33b36; qcom; pt_BR; 103516666)",
    "Mozilla/5.0 (Linux; Android 7.0; TRT-LX3 Build/HUAWEITRT-LX3; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/70.0.3538.80 Mobile Safari/537.36 Instagram 70.0.0.22.98 Android (24/7.0; 320dpi; 720x1208; HUAWEI; TRT-LX3; HWTRT-Q; qcom; es_CO; 130580485)",
    // Internet Explorer:
    "Mozilla/4.0 (compatible; MSIE 5.0; Mac_PowerPC)",
    "Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1; .NET CLR 1.1.4322)",
    "Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 6.0)",
    "Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 6.0; SLCC1; .NET CLR 2.0.50727; Media Center PC 5.0; .NET CLR 3.0.04506)",
    "Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 5.1; Trident/4.0; .NET CLR 2.0.50727; .NET CLR 3.0.4506.2152; .NET CLR 3.5.30729)",
    "Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; WOW64; Trident/5.0; KTXN)",
    "Mozilla/5.0 (Windows NT 10.0; WOW64; Trident/7.0; Touch; .NET4.0C; .NET4.0E; .NET CLR 2.0.50727; .NET CLR 3.0.30729; .NET CLR 3.5.30729; Tablet PC 2.0; wbx 1.0.0; rv:11.0) like Gecko",
    "Mozilla/5.0 (Windows NT 6.3; WOW64; Trident/7.0; TNJB; rv:11.0) like Gecko",
    "Mozilla/5.0 CK={} (Windows NT 6.1; WOW64; Trident/7.0; rv:11.0) like Gecko",
    // Internet Explorer Mobile:
    "Mozilla/4.0 (compatible; MSIE 6.0; Windows CE; IEMobile 6.12)",
    "Mozilla/5.0 (compatible; MSIE 10.0; Windows Phone 8.0; Trident/6.0; IEMobile/10.0; ARM; Touch; HUAWEI; 4Afrika)",
    "Mozilla/5.0 (compatible; MSIE 9.0; Windows Phone OS 7.5; Trident/5.0; IEMobile/9.0; NOKIA; Lumia 710)",
    "Mozilla/5.0 (compatible; MSIE 9.0; Windows Phone OS 7.5; Trident/5.0; IEMobile/9.0; Xbox)",
    "Mozilla/5.0 (Mobile; Windows Phone 8.1; Android 4.0; ARM; Trident/7.0; Touch; rv:11.0; IEMobile/11.0; NOKIA; Lumia 620) like iPhone OS 7_0_3 Mac OS X AppleWebKit/537 (KHTML, like Gecko) Mobile Safari/537",
    "Mozilla/5.0 (Mobile; Windows Phone 8.1; Android 4.0; ARM; Trident/7.0; Touch; rv:11.0; IEMobile/11.0; NOKIA; Lumia 635) like iPhone OS 7_0_3 Mac OS X AppleWebKit/537 (KHTML, like Gecko) Mobile Safari/537",
    // Internet TV:
    "Opera/9.80 (Linux mips; U; InettvBrowser/2.2 (00014A;SonyDTV115;0002;0100) KDL40EX520; CC/XLA; en) Presto/2.7.61 Version/11.00",
    // Iron:
    "Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Iron/26.0.1450.0 Chrome/26.0.1450.0 Safari/537.36",
    // K-meleon:
    "Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US; rv:1.8.1.24pre) Gecko/20100228 K-Meleon/1.5.4",
    // Kapiko:
    "Mozilla/5.0 (Windows; U; Windows NT 5.1; zh-CN; rv:1.9) Gecko/20080705 Firefox/3.0 Kapiko/3.0",
    // Kazehakase:
    "Mozilla/5.0 (X11; U; FreeBSD i386; en-US; rv:1.8.1.18) Gecko/20081206 Firefox/2.0.0.18 Kazehakase/0.5.4",
    // Kindle:
    "Dalvik/2.1.0 (Linux; U; Android 5.1.1; KFSUWI Build/LVY48F)",
    "Mozilla/5.0 (Linux; U; Android 2.3.4; en-us; Kindle Fire Build/GINGERBREAD) AppleWebKit/533.1 (KHTML, like Gecko) Version/4.0 Mobile Safari/533",
    "Mozilla/5.0 (Linux; U; en-US) AppleWebKit/528.5+ (KHTML, like Gecko, Safari/528.5+) Version/4.0 Kindle/3.0 (screen 600x800; rotate)",
    "Mozilla/5.0 (X11; U; Linux armv7l like Android; en-us) AppleWebKit/531.2+ (KHTML, like Gecko) Version/5.0 Safari/533.2+ Kindle/3.0+",
    // Konqueror:
    "Mozilla/5.0 (compatible; Konqueror/3.2; Linux) (KHTML, like Gecko)",
    "Mozilla/5.0 (compatible; Konqueror/3.4; CYGWIN_NT-5.1) KHTML/3.4.89 (like Gecko)",
    "Mozilla/5.0 (compatible; Konqueror/4.4; Linux) KHTML/4.4.5 (like Gecko) Kubuntu",
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.21 (KHTML, like Gecko) konqueror/4.14.16 Safari/537.21",
    // Links:
    "Links (2.1pre23; Linux 3.5.0 i686; 237x63)",
    // Lunascape:
    "Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; .NET CLR 1.1.4322; Lunascape 1.2)",
    "Mozilla/5.0 (iPhone; CPU iPhone OS 12_1_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/16D5039a Safari/605.1 iLunascape/4310",
    "Mozilla/5.0 (Windows; N; Windows NT 5.2; ru-RU) AppleWebKit/529 (KHTML, like Gecko, Safari/529.0) Lunascape/4.9.9.94",
    "Mozilla/5.0 (Windows; U; Windows NT 6.0; ja; rv:1.9.1.15) Gecko/20101029 Firefox/3.5.15 Lunascape/6.3.4.23051 ( .NET CLR 3.5.30729)",
    // Lynx:
    "Lynx/2.8.5rel.1 libwww-FM/2.15FC SSL-MM/1.4.1c OpenSSL/0.9.7e-dev",
    "Lynx/2.8.9rel.1 libwww-FM/2.14 SSL-MM/1.4.1 GNUTLS/3.6.5",
    "Lynx/2.9.0dev.4 libwww-FM/2.14 SSL-MM/1.4.1 GNUTLS/2.12.23",
    "Lynx/2.9.0dev.5 libwww-FM/2.14 SSL-MM/1.4.1 GNUTLS/3.6.13",
    "Lynx/2.9.0dev.6 libwww-FM/2.14 SSL-MM/1.4.1 OpenSSL/1.1.1j-dev",
    // Maxthon:
    "Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; FunWebProducts-MyWay; Maxthon; .NET CLR 1.1.4322)",
    "Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1; Maxthon)",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_8_5) AppleWebKit/537.22 (KHTML, like Gecko) Maxthon/4.1.2.2000 Chrome/25.0.1364.99 Safari/537.22",
    "Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Maxthon/4.4.8.1000 Chrome/30.0.1599.101 Safari/537.36",
    // Mercury:
    "Mozilla/5.0 (iPad; CPU OS 7_0_4 like Mac OS X) AppleWebKit/537.51.1 (KHTML, like Gecko) Mercury/8.9.4 Mobile/11B554a Safari/9537.53",
    "Mozilla/5.0 (Windows NT 10.0; WOW64; Trident/7.0; IE8Mercury; rv:11.0) like Gecko",
    // MicroB:
    "Mozilla/5.0 (X11; U; Linux armv7l; en-GB; rv:1.9.2a1pre) Gecko/20090514 Firefox/3.0 Tablet browser 0.9.7 RX-34",
    // Microsoft Outlook:
    "Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 6.1; WOW64; Trident/7.0; SLCC2; .NET CLR 2.0.50727; .NET CLR 3.5.30729; .NET CLR 3.0.30729; Media Center PC 6.0; MAGW; .NET4.0C; .NET4.0E; Microsoft Outlook 14.0.7113; ms-office; MSOffice 14)",
    // Midori:
    "Mozilla/5.0 (Macintosh; U; Intel Mac OS X; de-de) AppleWebKit/535+ (KHTML, like Gecko) Version/5.0 Safari/535.22+ Midori/0.4",
    // Minefield:
    "Mozilla/5.0 (Windows NT 6.1; WOW64; rv:2.0b4pre) Gecko/20100815 Minefield/4.0b4pre(Linux LLC 1.2)",
    // Minix NEO X5:
    "Mozilla/5.0 (Linux; U; Android 4.2.2; he-il; NEO-X5-116A Build/JDQ39) AppleWebKit/534.30 (KHTML, like Gecko) Version/4.0 Safari/534.30",
    // Miui:
    "Mozilla/5.0 (Linux; U; Android 7.0; en-us; Redmi Note 4 Build/NRD90M) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/53.0.2785.146 Mobile Safari/537.36 XiaoMi/MiuiBrowser/9.2.8",
    "Mozilla/5.0 (Linux; U; Android 9; pl-pl; Redmi Note 7 Build/PKQ1.180904.001) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/71.0.3578.141 Mobile Safari/537.36 XiaoMi/MiuiBrowser/11.4.3-g",
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/534.24 (KHTML, like Gecko) Chrome/71.0.3578.141 Safari/534.24 XiaoMi/MiuiBrowser/11.4.3-g",
    // Motorola Internet:
    "MOT-V177/0.1.75 UP.Browser/6.2.3.9.c.12 (GUI) MMP/2.0 UP.Link/6.3.1.13.0",
    "mot-V3/OE.40.79R MIB/2.2.1 profile/MIDP-2.0 configuration/CLDC-1.0 UP.Link/6.2.3.15.0",
    "MOT-VE240/00.72 UP.Browser/7.2.7.5.548 (GUI) MMP/2.0 Novarra-Vision/8.0",
    // Mozilla Android Components:
    "MozacFetch/49.0.20200702190156",
    // Naver Whale:
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.57 Whale/3.14.133.23 Safari/537.36",
    // NCSA Mosaic:
    "NCSA_Mosaic/2.7b5 (X11;Linux 2.6.7 i686) libwww/2.12 modified",
    "NCSA_Mosaic/2.7ck11 (X11;OpenBSD 7.1 i386) libwww/2.12 modified",
    // NetFront:
    "SonyEricssonW810i/R46EA Browser/NetFront/3.3 Profile/MIDP-2.0 Configuration/CLDC-1.1 UP.Link/6.3.0.0.0(Linux LLC 1.2)",
    // NetPositive:
    "Mozilla/3.0 (compatible; NetPositive/2.2.1; BeOS)",
    // Netscape:
    "Mozilla/5.0 (X11; U; Linux 2.4.2-2 i586; en-US; m18) Gecko/20010131 Netscape6/6.01",
    // Netscape Navigator:
    "Mozilla/5.0 (Macintosh; U; PPC Mac OS X Mach-O; en-US; rv:1.7.12) Gecko/20050915",
    "Mozilla/5.0 (Windows; U; Win 9x 4.90; SG; rv:1.9.2.4) Gecko/20101104 Netscape/9.1.0285",
    "Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US; rv:1.7.2) Gecko/20040804 Netscape/7.2 (ax)",
    "Mozilla/5.0 (X11; U; Linux i686; en-US; rv:0.9.3) Gecko/20010801",
    // Nintendo 3DS:
    // "Mozilla/5.0 (Nintendo 3DS; U; ; en) Version/1.7412.EU",
    // Nintendo Wii U:
    "Mozilla/5.0 (Nintendo WiiU) AppleWebKit/536.30 (KHTML, like Gecko) NX/3.0.4.2.12 NintendoBrowser/4.3.1.11264.US",
    // Nokia:
    "Mozilla/5.0 (Linux; Android 4.1.2; Nokia_X Build/JZO54K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/30.0.1599.82 Mobile Safari/537.36 NokiaBrowser/1.2.0.12",
    "Mozilla/5.0 (Mobile; Windows Phone 8.1; Android 4.0; ARM; Trident/7.0; Touch; rv:11.0; IEMobile/11.0; NOKIA; 909) like iPhone OS 7_0_3 Mac OS X AppleWebKit/537 (KHTML, like Gecko) Mobile Safari/537",
    "Mozilla/5.0 (Symbian/3; Series60/5.2 NokiaX7-00/0261.004; Profile/MIDP-2.1 Configuration/CLDC-1.1 ) AppleWebKit/533.4 (KHTML, like Gecko) NokiaBrowser/7.3.1.21 Mobile Safari/533.4 3gpp-gba(Linux LLC 1.2)",
    "Nokia6280/2.0 (03.60) Profile/MIDP-2.0 Configuration/CLDC-1.1",
    "Nokia7610/2.0 (5.0509.0) SymbianOS/7.0s Series60/2.1 Profile/MIDP-2.0 Configuration/CLDC-1.0",
    // Nook:
    "Mozilla/5.0 (Linux; Android 4.4.2; BN NookHD+ Build/KOT49H) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/30.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Linux; U; Android 2.3.4; en-us; NOOK BNTV250 Build/GINGERBREAD 1.4.3) AppleWebKit/533.1 (KHTML, like Gecko) Version/4.0 Safari/533.1",
    "Mozilla/5.0 (Linux; U; Android 4.2.2; de-de; BN NookHD+ Build/JDQ39E) AppleWebKit/534.30 (KHTML, like Gecko) Version/4.0 Safari/534.30 CyanogenMod/10.1.3/ovation",
    // Odyssey Web Browser:
    "Mozilla/5.0 (Macintosh; PowerPC MorphOS 3.7; Odyssey Web Browser; rv:1.23) AppleWebKit/538.1 (KHTML, like Gecko) OWB/1.23 Safari/538.1",
    // Office:
    "Microsoft Office/16.0 (Windows NT 10.0; MAPI 16.0.8431; Pro)",
    "Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 6.1; WOW64; Trident/7.0; SLCC2; .NET CLR 2.0.50727; .NET CLR 3.5.30729; .NET CLR 3.0.30729; Media Center PC 6.0; .NET4.0C; .NET4.0E; MSOffice 12)",
    // OmniWeb:
    "Mozilla/5.0 (Macintosh; Intel  Mac OS X 10_9_1; en-US) AppleWebKit/9537.73.11 (KHTML, like Gecko) Version/7.0 Safari/537.71 OmniWeb/v624.0",
    // OneBrowser:
    "OneBrowser/4.2.0/Adr(Linux; U; Android 4.2.1; en-us; HUAWEI G610-U00 Build/HuaweiG610-U00) AppleWebKit/533.1 (KHTML, like Gecko) Mobile Safari/533.1",
    "OneBrowser/for Blackberry3.0.0 (BlackBerry9320/7.1.0.398)",
    // Opera:
    "Mozilla/5.0 (Linux armv7l) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/49.0.2623.112 Safari/537.36 OPR/36.0.2128.0 OMI/4.8.0.129.ALISHAN6.19 VIZIO-DTV/V7.20.8 (Vizio, D32f-E1, wireless)",
    "Mozilla/5.0 (Linux; U; Android 5.0.2; zh-CN; Redmi Note 3 Build/LRX22G) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 OPR/11.2.3.102637 Mobile Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.130 Safari/537.36 OPR/66.0.3515.72",
    "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36 OPR/43.0.2442.991",
    "Opera/9.25 (Windows NT 6.0; U; en)(Linux LLC 1.2)",
    "Opera/9.80 (Linux armv7l) Presto/2.12.407 Version/12.51 , D50u-D1-UHD/V1.5.16-UHD (Vizio, D50u-D1, Wireless)",
    "Opera/9.80 (Macintosh; Intel Mac OS X 10.6.8; U; de) Presto/2.9.168 Version/11.52",
    "Opera/9.80 (Windows NT 5.1; U; de) Presto/2.2.15 Version/10.10",
    "Opera/9.80 (Windows NT 6.1; WOW64) Presto/2.12.388 Version/12.18",
    // Opera Mini:
    "Mozilla/5.0 (iPhone; CPU iPhone OS 8_1_2 like Mac OS X) AppleWebKit/600.1.4 (KHTML, like Gecko) OPiOS/9.1.0.86723 Mobile/12B440 Safari/9537.53",
    "Opera/8.01 (J2ME/MIDP; Opera Mini/3.1.10423/1724; en; U; ssr)",
    "Opera/9.80 (Android; Opera Mini/12.0.1987/37.7327; U; pl) Presto/2.12.423 Version/12.16",
    "Opera/9.80 (BlackBerry; Opera Mini/6.5.27548/27.2020; U; en) Presto/2.8.119 Version/11.10",
    // Opera Neon:
    "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/53.0.2785.21 Safari/537.36 MMS/1.0.2459.0",
    // Opera Next:
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 1091) AppleWebKit/537.36 (KHTML like Gecko) Chrome/33.0.1750.91 Safari/537.36 OPR/20.0.1387.37 (Edition Next)",
    // Opera Touch:
    "Mozilla/5.0 (iPad; CPU OS 12_4_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) OPT/1.11.0 Mobile/15E148",
    "Mozilla/5.0 (iPhone; CPU iPhone OS 12_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) OPT/5 Mobile/16B92",
    "Mozilla/5.0 (Linux; Android 5.1.1; D2406 Build/18.6.A.0.182) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/43.0.2357.121 Mobile Safari/537.36 OPT/1.9.31",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) OPT/2.2.1",
    // Orca:
    "Mozilla/5.0 (Linux; Android 6.0; CAM-UL00 Build/HONORCAM-UL00) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2840.85 Mobile Safari/537.36",
    "Mozilla/5.0 (Windows; U; Windows NT 6.1; en-US; rv:1.9.1.6) Gecko/20091222 Firefox/3.5.6 Orca/1.2 build 6",
    // Ordissimo:
    "Mozilla/5.0 (X11; Linux i686; rv:45.0) Gecko/20100101 Firefox/45.0 Ordissimo/3.8.6.6+svn37147",
    // Outlook:
    "Microsoft Office/14.0 (Windows NT 6.1; Microsoft Outlook 14.0.7143; Pro)",
    "Mozilla/4.0 (compatible; ms-office; MSOffice 16)",
    "Outlook-iOS/709.2189947.prod.iphone (3.24.0)",
    // Outlook Express:
    "Outlook-Express/7.0 (MSIE 7.0; Windows NT 6.1; Trident/7.0; SLCC2; .NET CLR 2.0.50727; .NET CLR 3.5.30729; .NET CLR 3.0.30729; Media Center PC 6.0; OfficeLiveConnector.1.5; OfficeLivePatch.1.3; .NET4.0C; .NET4.0E; Tablet PC 2.0; TmstmpExt)",
    "Outlook-Express/7.0 (MSIE 7.0; Windows NT 6.2; WOW64; Trident/7.0; .NET4.0C; .NET4.0E; .NET CLR 2.0.50727; .NET CLR 3.0.30729; .NET CLR 3.5.30729; TmstmpExt)",
    // Outlook Mail:
    "Microsoft Office/16.0 (Microsoft Outlook Mail 16.0.8008; Pro)",
    // Ovi:
    "Mozilla/5.0 (Series40; Nokia200/11.64; Profile/MIDP-2.1 Configuration/CLDC-1.1) Gecko/20100401 S40OviBrowser/2.0.2.68.14",
    "Mozilla/5.0 (Series40; NokiaX2-01/08.65; Profile/MIDP-2.1 Configuration/CLDC-1.1) Gecko/20100401 S40OviBrowser/1.0.0.9.17.2",
    // Pale Moon:
    "Mozilla/5.0 (Windows NT 5.1; rv:52.9) Gecko/20100101 Goanna/3.4 Firefox/52.9 PaleMoon/27.9.1a1",
    "Mozilla/5.0 (Windows NT 6.0; rv:12.0) Gecko/20120424 Firefox/12.0 PaleMoon/12.0",
    "Mozilla/5.0 (Windows NT 6.2; Win64; x64; rv:24.0) Gecko/20140419 Firefox/24.0 PaleMoon/24.5.0",
    "Mozilla/5.0 (X11; Linux i686; rv:45.9) Gecko/20100101 Goanna/3.0 Firefox/45.9 PaleMoon/27.1.2",
    // Phoenix:
    "Mozilla/5.0 (X11; U; Linux i686; en-US; rv:1.2b) Gecko/20021029 Phoenix/0.4",
    // Pinterest App:
    "Mozilla/5.0 (iPad; CPU OS 6_1_3 like Mac OS X) AppleWebKit/536.26 (KHTML, like Gecko) Mobile/10B329 [Pinterest/iOS]",
    "Mozilla/5.0 (Linux; Android 5.1.1; KFDOWI Build/LVY48F; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/70.0.3538.110 Safari/537.36 [Pinterest/Android]",
    "Mozilla/5.0 (Linux; Android 5.1; HUAWEI LUA-L23 Build/HUAWEILUA-L23; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/69.0.3497.100 Mobile Safari/537.36 [Pinterest/Android]",
    "Mozilla/5.0 (Linux; Android 7.1.1; Acer Chromebook R11 (CB5-132T, C738T) Build/R78-12499.51.0; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/78.0.3904.96 Safari/537.36 [Pinterest/Android]",
    "Mozilla/5.0 (Linux; Android 9; STF-L09 Build/HUAWEISTF-L09; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/79.0.3945.79 Mobile Safari/537.36 [Pinterest/Android]",
    // PlayStation 4:
    "Mozilla/5.0 (PlayStation 4 5.55) AppleWebKit/601.2 (KHTML, like Gecko)",
    "Mozilla/5.0 (PlayStation 4/SmartTV) AppleWebKit/605.1.15 (KHTML, like Gecko) THEWORLD",
    "PS4Application libhttp/1.000 (PS4) CoreMedia libhttp/6.72 (PlayStation 4)",
    // Playstation Vita:
    "Mozilla/5.0 (PlayStation Vita 3.61) AppleWebKit/537.73 (KHTML, like Gecko) Silk/3.2",
    // Postbox:
    "Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10.6; en-US; rv:1.9.1.8) Gecko/20100317 Postbox/1.1.3",
    // PowerPoint:
    "Microsoft Office/16.0 (Windows NT 10.0; Microsoft PowerPoint 16.0.10325; Pro)",
    // Puffin:
    "Mozilla/5.0 (Linux; Android 8.0.0; moto g(6) play Build/OPP27.91-87; pt-br) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.111 Mobile Safari/537.36 Puffin/7.5.3.20547AP",
    "Mozilla/5.0 (X11; U; Linux x86_64; en-de) AppleWebKit/534.35 (KHTML, like Gecko) Chrome/11.0.696.65 Safari/534.35 Puffin/2.10990AP",
    "Mozilla/5.0 (X11; U; Linux x86_64; en-TW) AppleWebKit/537.36 (KHTML, like Gecko) Safari/537.36 Puffin/5.1.0IT Chrome/49.0.2623",
    "Mozilla/5.0 (X11; U; Linux x86_64; en-US) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/30.0.1599.114 Safari/537.36 Puffin/5.2.2IT",
    "Mozilla/5.0 (X11; U; U; Linux x86_64; en-us) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Safari/537.36 Puffin/8.5.0.42207AP",
    // QQ:
    "Mozilla/5.0 (Linux; U; Android 6.0; zh-cn; FRD-AL00 Build/HUAWEIFRD-AL00) AppleWebKit/537.36 (KHTML, like Gecko)Version/4.0 Chrome/37.0.0.0 MQQBrowser/6.0 Mobile Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/43.0.2357.134 Safari/537.36 QQBrowser/3.8.3858.400",
    "Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.26 Safari/537.36 Core/1.63.6788.400 QQBrowser/10.3.2727.400",
    // QQ Browser:
    "Mozilla/5.0 (Windows NT 5.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/31.0.1650.48 Safari/537.36 QQBrowser/8.0.3197.400",
    // QtWebEngine:
    "Mozilla/5.0 (Windows NT 6.2) AppleWebKit/537.36 (KHTML, like Gecko) QtWebEngine/5.5.1 Chrome/40.0.2214.115 Safari/537.36",
    // QuickTime:
    "QuickTime/7.6.6 (qtver=7.6.6;cpu=IA32;os=Mac 10.6.8)",
    // RadiosNet:
    "RadiosNet/2.1.1 (Java; Android)",
    "RadiosNet/2.2.1 (Java; Android)",
    "RadiosNet/2.2.3 (Java; Android)",
    "RadiosNet/2.2.4 (Java; Android)",
    "RadiosNet/2.2.5 (Java; Android)",
    "RadiosNet/2.3.1 (Java; Android)",
    "RadiosNet/2.3.2 (Java; Android)",
    "RadiosNet/2.3.3 (Java; Android)",
    "RadiosNet/2.4.0 (Java; Android)",
    "RadiosNet/2.4.1 (Java; Android)",
    "RadiosNet/2.4.2 (Java; Android)",
    "RadiosNet/2.5.0 (Java; Android)",
    "RadiosNet/2.5.1 (Java; Android)",
    "RadiosNet/2.5.2 (Java; Android)",
    "RadiosNet/2.6.0 (Java; Android)",
    "RadiosNet/2.6.1 (Java; Android)",
    "RadiosNet/2.6.2 (Java; Android)",
    "RadiosNet/2.7.0 (Java; Android)",
    "RadiosNet/2.7.1 (Java; Android)",
    "RadiosNet/2.8.0 (Java; Android)",
    // Rekonq:
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.21 (KHTML, like Gecko) rekonq/2.3.2 Safari/537.21",
    // retweet:
    "retweet/2.17 (iPhone; iOS 17.1.2; Scale/3.00)",
    // RockMelt:
    "Mozilla/5.0 (Windows NT 6.1) AppleWebKit/535.7 (KHTML, like Gecko) RockMelt/0.16.91.483 Chrome/16.0.912.77 Safari/535.7",
    // Roku Ultra:
    "Roku4640X/DVP-7.70 (297.70E04154A)",
    // Safari:
    "MobileSafari/9537.53 CFNetwork/672.0.2 Darwin/14.0.0",
    "Mozilla/5.0 (iPhone; CPU iPhone OS 12_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/12.1 Mobile/15E148 Safari/604.1",
    "Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1",
    "Mozilla/5.0 (iPhone; CPU iPhone OS 6_0_1 like Mac OS X) AppleWebKit/536.26 (KHTML, like Gecko) Version/6.0 Mobile/10A523 Safari/8536.25",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/12.1.1 Safari/605.1.15",
    "Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_5_8; en-us) AppleWebKit/531.9 (KHTML, like Gecko) Version/4.0.3 Safari/531.9",
    "Mozilla/5.0 (Windows NT 5.1) AppleWebKit/534.27+ (KHTML, like Gecko) Version/5.0.4 Safari/533.20.27",
    // Sailfish Browser:
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/47.0.2526.111 Safari/537.36 SailfishBrowser/Rulz ~LenovoG780",
    // Samsung:
    "Mozilla/5.0 (Linux; Android 5.0; SAMSUNG SM-G900F Build/LRX21T) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/2.1 Chrome/34.0.1847.76 Mobile Safari/537.36",
    "Mozilla/5.0 (Linux; Android 7.0; SAMSUNG SM-G610M Build/NRD90M) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/7.4 Chrome/59.0.3071.125 Mobile Safari/537.36",
    "Mozilla/5.0 (Linux; Android 9; SAMSUNG SM-G960U) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/10.2 Chrome/71.0.3578.99 Mobile Safari/537.36",
    // SeaMonkey:
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.9; rv:36.0) Gecko/20100101 Firefox/36.0 SeaMonkey/2.33.1",
    "Mozilla/5.0 (Windows NT 6.2; WOW64; rv:20.0) Gecko/20100101 Firefox/20.0 SeaMonkey/2.17.1",
    "Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US; rv:1.8.1.23) Gecko/20090825 SeaMonkey/1.1.18",
    "Mozilla/5.0 (X11; Linux x86_64; rv:29.0) Gecko/20100101 Firefox/29.0 SeaMonkey/2.26",
    // Seznam Browser:
    "Mozilla/5.0 (Windows NT 6.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/50.0.2661.102 Safari/537.36 SznProhlizec/3.0.0",
    // Silk:
    "Mozilla/5.0 (Linux; Android 5.1.1; KFFOWI Build/LVY48F) AppleWebKit/537.36 (KHTML, like Gecko) Silk/60.2.12 like Chrome/60.0.3112.107 Safari/537.36",
    "Mozilla/5.0 (Linux; Android 5.1.1; KFSUWI) AppleWebKit/537.36 (KHTML, like Gecko) Silk/80.5.3 like Chrome/80.0.3987.162 Safari/537.36",
    "Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_6_3; en-us; Silk/1.0.146.3-Gen4_12000410) AppleWebKit/533.16 (KHTML, like Gecko) Version/5.0 Safari/533.16 Silk-Accelerated=true",
    // Sleipnir:
    "Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.1; Trident/6.0; Sleipnir/2.9.18)",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_6_8) AppleWebKit/534.59.10 (KHTML, like Gecko) Version/5.1 Safari/6534.59.10 Sleipnir/4.5.1",
    "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3440.106 Safari/537.36 Sleipnir/6.2.14",
    // SlimBrowser:
    "Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SlimBrowser [flashpeak.com]; SV1)",
    "Mozilla/5.0 (SmartHub; Linux/SmartTV) AppleWebKit/606 (KHTML, like Gecko) SlimBrowser/11.0.8.0 Safari/606 OMI/4.8.0.129.PIXEL_UNICORN2.12",
    "Mozilla/5.0 (Windows NT 6.1; WOW64; Trident/7.0; SlimBrowser/7.00; MASBJS; rv:11.0) like Gecko",
    // Snapchat:
    "Mozilla/5.0 (iPad; CPU OS 13_3_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.5 Mobile/15E148 Snapchat/10.77.0.54 (like Safari/604.1)",
    "Mozilla/5.0 (iPhone; CPU iPhone OS 13_1_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Snapchat/10.69.5.72 (iPhone11,6; iOS 13.1.3; gzip)",
    "Mozilla/5.0 (iPhone; CPU iPhone OS 13_3_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.5 Mobile/15E148 Snapchat/10.77.5.59 (like Safari/604.1)",
    "Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.1 Mobile/15E148 Snapchat/11.36.0.36 (like Safari/604.1)",
    "Mozilla/5.0 (Linux; Android 10; SM-G973U Build/QP1A.190711.020; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/79.0.3945.136 Mobile Safari/537.36Snapchat10.74.6.0 (SM-G973U; Android 10#G973USQS2CSL1#29; gzip)",
    "Mozilla/5.0 (Linux; Android 8.1.0; LG-Q710AL Build/O11019; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/73.0.3683.90 Mobile Safari/537.36Snapchat10.54.0.31 (LG-Q710AL; Android 8.1.0#1916317118700#27; gzip)",
    // Snowshoe:
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.21 (KHTML, like Gecko) Snowshoe/1.0.0 Safari/537.21",
    // Sogou Explorer:
    "Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.1; Trident/4.0; SE 2.X MetaSr 1.0; SE 2.X MetaSr 1.0; .NET CLR 2.0.50727; SE 2.X MetaSr 1.0)",
    "Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1 SE 2.X MetaSr 1.0",
    "Mozilla/5.0 (Windows NT 10.0; WOW64; Trident/7.0; rv:11.0; SE 2.X MetaSr 1.0) like Gecko",
    "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/31.0.1650.63 Safari/537.36 SE 2.X MetaSr 1.0",
    // Songbird:
    "Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10.7; en-US; rv:1.9.2.3) Gecko/20101201 Songbird/2.2.0 (20130204083602)",
    "Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US; rv:1.8) Gecko/20060206 Songbird/0.1",
    "Mozilla/5.0 (Windows; U; Windows NT 6.1; en-US; rv:1.9.2.3) Gecko/20101201 Songbird/2.2.0 (20130204082828)",
    "Mozilla/5.0 (X11; U; Linux i686; fr; rv:1.9.0.5) Gecko/2009021916 Songbird/1.1.2 (20090331141709)",
    // Sonos Player:
    "Linux UPnP/1.0 Sonos/50.1-65071 (ACR_:samsung:dreamqltevl:SM-G950W)",
    "Linux UPnP/1.0 Sonos/54.2-72031 (WDCR:Microsoft Windows NT 10.0.18362)",
    "Linux UPnP/1.0 Sonos/54.2-72031 (ZPS11)",
    // Spotify:
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_0) AppleWebKit/537.36 (KHTML, like Gecko) Spotify/1.1.9.383 Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Spotify/1.1.31.703 Safari/537.36",
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Spotify/1.1.10.546 Safari/537.36",
    // SpringBoard:
    "SpringBoard/50 CFNetwork/1220.1 Darwin/20.3.0",
    // SRWare Iron:
    "Mozilla/5.0 (Linux; Android 6.0; IRON_2 Build/1474531013) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/64.0.3282.137 Mobile Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3050.0 Iron Safari/537.36",
    "Mozilla/5.0 (Windows NT 6.1) AppleWebKit/534.24 (KHTML, like Gecko) Iron/11.0.700.1 Chrome/11.0.700.1 Safari/534.24",
    "Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/43.0.2300.0 Iron/43.0.2300.0 Safari/537.36",
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2950.0 Iron Safari/537.36",
    // Sunrise:
    "Mozilla/5.0 (Macintosh; U; Intel Mac OS X; en) AppleWebKit/418.9.1 (KHTML, like Gecko) Sunrise/1.6.5 like Safari/419.3",
    // Swiftfox:
    "Mozilla/5.0 (X11; U; Linux i686; en-US; rv:1.8.1) Gecko/20061024 Firefox/2.0 (Swiftfox)",
    // Tesla:
    "Mozilla/5.0 (Linux; Android 7.0; Tesla_SP6.3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.143 Mobile Safari/537.36",
    "Mozilla/5.0 (X11; GNU/Linux) AppleWebKit/537.36 (KHTML, like Gecko) Chromium/79.0.3945.130 Chrome/79.0.3945.130 Safari/537.36 Tesla/2020.12.1-299292ad7782",
    "Mozilla/5.0 (X11; GNU/Linux) AppleWebKit/601.1 (KHTML, like Gecko) Tesla QtCarBrowser Safari/601.1",
    // TheWorld:
    "Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1; InfoPath.1; .NET4.0C; .NET4.0E; TheWorld 6)",
    "Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1; TheWorld)",
    "Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 6.1; Trident/4.0; SLCC2; .NET CLR 2.0.50727; .NET CLR 3.5.30729; .NET CLR 3.0.30729; Media Center PC 6.0; InfoPath.2; Tablet PC 2.0; CIBA; TheWorld)",
    "Mozilla/5.0 (Web0S 100.0; Linux/SmartTV) AppleWebKit/605.1.15 (KHTML, like Gecko) QIHU THEWORLD",
    // Thunderbird:
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.14; rv:60.0) Gecko/20100101 Thunderbird/60.6.1 Lightning/6.2.6.1",
    "Mozilla/5.0 (Windows NT 10.0; WOW64; rv:60.0) Gecko/20100101 Thunderbird/60.7.0 Lightning/6.2.7",
    "Mozilla/5.0 (X11; Linux i686; rv:17.0) Gecko/20130330 Thunderbird/17.0.5",
    "Mozilla/5.0 (X11; Linux x86_64; rv:45.0) Gecko/20100101 Thunderbird/45.8.0",
    // Tor Browser:
    "Mozilla/5.0 (Android 9; Mobile; rv:78.0) Gecko/78.0 Firefox/78.0",
    // Twitter App:
    "Mozilla/5.0 (iPad; CPU OS 10_3_4 like Mac OS X) AppleWebKit/603.1.30 (KHTML, like Gecko) Mobile/14G61 Twitter for iPhone/7.51.5",
    "Mozilla/5.0 (iPhone; CPU iPhone OS 11_2_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Mobile/15C153 Twitter for iPhone/7.14",
    "Mozilla/5.0 (iPhone; CPU iPhone OS 13_3_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/17D50 Twitter for iPhone/8.10",
    "Mozilla/5.0 (iPhone; CPU iPhone OS 9_3_2 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Mobile/13F69 Twitter for iPhone",
    // UC:
    "BlackBerry9630/4.2.0.284 Profile/MIDP-2.0 Configuration/CLDC-1.1/UC Browser7.8.0.95/160/352",
    "Mozilla/5.0 (iPhone; CPU iPhone OS 10_3_2 like Mac OS X; zh-CN) AppleWebKit/537.51.1 (KHTML, like Gecko) Mobile/14F89 UCBrowser/11.5.9.992 Mobile AliApp(TUnionSDK/0.1.20)",
    "Mozilla/5.0 (iPhone; CPU iPhone OS 12_1 like Mac OS X; zh-CN) AppleWebKit/537.51.1 (KHTML, like Gecko) Mobile/16B92 UCBrowser/12.1.7.1109 Mobile AliApp(TUnionSDK/0.1.20.3)",
    "Mozilla/5.0 (Linux; U; Android 4.4.2; zh-CN; HUAWEI MT7-TL00 Build/HuaweiMT7-TL00) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/40.0.2214.89 UCBrowser/11.3.8.909 Mobile Safari/537.36",
    "Mozilla/5.0 (Linux; U; Android 6.0.1; zh-CN; F5121 Build/34.0.A.1.247) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/40.0.2214.89 UCBrowser/11.5.1.944 Mobile Safari/537.36",
    "Mozilla/5.0 (S60V5; U; en-us; Nokia5250)/UC Browser8.2.0.132/50/355/UCWEB Mobile",
    "Mozilla/5.0 (X11; U; Linux i686; en-US) U2/1.0.0 UCBrowser/9.3.1.344",
    "Nokia200/2.0 (11.81) Profile/MIDP-2.1 Configuration/CLDC-1.1 UCWEB/2.0(Java; U; MIDP-2.0; en-us; nokia200) U2/1.0.0 UCBrowser/8.7.1.234 U2/1.0.0 Mobile",
    "NokiaC2-00/2.0 (03.45) Profile/MIDP-2.1 Configuration/CLDC-1.1 Mozilla/5.0 (Java; U; kau; nokiac2-00) UCBrowser8.3.0.154/70/352/UCWEB Mobile",
    "SonyEricssonJ20i/R7CA Profile/MIDP-2.1 Configuration/CLDC-1.1 UNTRUSTED/1.0 UCWEB/2.0 (Java; U; MIDP-2.0; ru; SonyEricssonJ20i) U2/1.0.0 UCBrowser/9.5.0.449 U2/1.0.0 Mobile",
    "UCWEB/2.0 (Java; U; MIDP-2.0; ru; NokiaE71-1Opera/9.80 (J2ME/MIDP; Opera Mini/8.0.35626/19.886; U; ru) UCBrowser/9.5.0.449 U2/1.0.0 Mobile UNTRUSTED/1.0",
    "UCWEB/2.0 (Symbian; U; S60 V5; en-US; Nokia5250) U2/1.0.0 UCBrowser/8.9.0.277 U2/1.0.0 Mobile",
    "UNTRUSTED/1.0 UCWEB/2.0 (Java; U; MIDP-2.0; ru; MotorolaVE66) U2/1.0.0 UCBrowser/9.4.1.377 U2/1.0.0 Mobile",
    // undefined:
    "Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US; rv:1.452) Gecko/20041027 Mnenhy/0.6.0.104",
    // Viber:
    "Mozilla/5.0 (Linux; Android 7.1.2; G011A Build/N2G48H; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/66.0.3359.158 Safari/537.36 Viber/11.9.5.8",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_4) AppleWebKit/537.36 (KHTML, like Gecko) QtWebEngine/5.6.0 Chrome/45.0.2454.101 Safari/537.36 Viber",
    "Viber/12.8.0.1 CFNetwork/1121.2.2 Darwin/19.3.0",
    // Vision Mobile:
    "BlackBerry8320/4.5.0.81 Profile/MIDP-2.0 Configuration/CLDC-1.1 VendorID/100 Novarra-Vision/8.0",
    "Mozilla/5.0 (X11; U; Linux i686; en-US; rv:1.8.0.7) Gecko/20060909 Firefox/1.5.0.7 Novarra-Vision/unknown",
    "Mozilla/5.0 (X11; U; Linux i686; en-US; rv:1.8.1.20) Gecko/20081217 Firefox/2.0.0.20 Novarra-Vision/8.0",
    "Nokia3110c/2.0 (07.21) Profile/MIDP-2.0 Configuration/CLDC-1.1 Novarra-Vision/8.0",
    // Vivaldi:
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.102 Safari/537.36 Vivaldi/1.93.955.48",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.99 Safari/537.36 Vivaldi/2.9.1705.41",
    "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.183 Safari/537.36 Vivaldi/1.96.1147.64",
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.183 Safari/537.36 Vivaldi/1.96.1137.3",
    // Vivo:
    "Mozilla/5.0 (Linux; Android 6.0.1; vivo 1606 Build/MMB29M; wv) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3202.84 Mobile Safari/537.36 VivoBrowser/5.7.0.6",
    "Mozilla/5.0 (Linux; Android 8.1.0; vivo 1803 Build/O11019; wv) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3202.84 Mobile Safari/537.36 VivoBrowser/6.2.0.1",
    // Wapchoi:
    "M4A1-WAPCHOI/2.0 (Java; U; MIDP-2.0; vi; NokiaC5-00.2) WAPCHOI/1.0.0 UCPro/9.4.1.377 U2/1.0.0 Mobile UNTRUSTED/1.0 3gpp-gba",
    // Webkit:
    "com.apple.WebKit.Networking/8613.3.9.0.16 CFNetwork/1335.0.3 Darwin/21.6.0",
    "Mozilla/5.0 (iPad; CPU OS 11_2_5 like Mac OS X) AppleWebKit/604.5.6 (KHTML, like Gecko) Mobile/15D60",
    "Mozilla/5.0 (iPhone; CPU iPhone OS 12_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148",
    "Mozilla/5.0 (iPhone; CPU iPhone OS 12_4_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 [LinkedInApp]",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/605.1.15 (KHTML, like Gecko)",
    "Mozilla/5.0 (Windows; U; Windows NT 6.1; en-US) AppleWebKit/533+ (KHTML, like Gecko)",
    // WebPositive:
    "Mozilla/5.0 (compatible; U; Webpositive/533.4; Haiku) AppleWebkit/533.4 (KHTML, like gecko) Chrome/5.0.375.55 Safari/533.4",
    // WebView:
    "Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.2; ARM; Trident/6.0; Touch; WebView/1.0)",
    "Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.2; Win64; x64; Trident/6.0; MASMJS; WebView/1.0)",
    "Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.2; Win64; x64; Trident/6.0; Touch; WebView/1.0)",
    "Mozilla/5.0 (iPhone; CPU iPhone OS 9_3_4 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Mobile/13G35 QQ/6.5.3.410 V1_IPH_SQ_6.5.3_1_APP_A Pixel/750 Core/UIWebView NetType/2G Mem/117",
    "Mozilla/5.0 (Linux; Android 6.0.1; SM-G532M Build/MMB29T; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/88.0.4324.181 Mobile Safari/537.36 GoogleApp/12.4.9.23.arm",
    "Mozilla/5.0 (Windows Phone 8.1; ARM; Trident/7.0; Touch; WebView/2.0; rv:11.0; IEMobile/11.0; NOKIA; Lumia 525) like Gecko",
    "Mozilla/5.0 (Windows Phone 8.1; ARM; Trident/7.0; Touch; WebView/2.0; rv:11.0; IEMobile/11.0; NOKIA; Lumia 635) like Gecko",
    "YelpWebView/1.5 Android/6.0.1 YelpApp/9.9.0 (x-screen-scale 1.0;)",
    // WeChat:
    "Mozilla/5.0 (iPhone; CPU iPhone OS 10_3_3 like Mac OS X) AppleWebKit/603.3.8 (KHTML, like Gecko) Mobile/14G60 wxwork/2.1.5 MicroMessenger/6.3.22",
    "Mozilla/5.0 (Linux; Android 7.0; FRD-AL00 Build/HUAWEIFRD-AL00; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/53.0.2785.49 Mobile MQQBrowser/6.2 TBS/043602 Safari/537.36 MicroMessenger/6.5.16.1120 NetType/WIFI Language/zh_CN",
    "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.95 Safari/537.36 MicroMessenger/6.5.2.501 NetType/WIFI WindowsWechat QBCore/3.43.691.400 QQBrowser/9.0.2524.400",
    // Whale Browser:
    "Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/52.0.2743.116 Whale/0.7.33.5 Safari/537.36",
    // Xumo Media Player:
    "Xumo/1.1 (Linux;Android 5.1.1) AmznExoPlayerLib/2.9.0",
    "Xumo/2.6.19 (Linux;Android 7.1.1) ExoPlayerLib/2.9.0",
    // Yaani:
    "Mozilla/5.0 (Android 5.0.2; SM-G360M Build/LRX22G) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2840.9 YaaniBrowser/3.8.0.519 (Turkcell-TR) Mobile Safari/537.36",
    "Mozilla/5.0 (Android 9; Mobile; rv:68.0) Gecko/68.0 Firefox/68.0 Turkcell-YaaniBrowser/6.1.0 Mobile Turkcell-TR",
    // Yandex:
    "Mozilla/5.0 (Linux; Android 6.0; HTC One_M8 Build/MRA58K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.95 YaBrowser/17.1.0.412.00 Mobile Safari/537.36",
    "Mozilla/5.0 (Linux; arm_64; Android 11; Redmi Note 9S) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.5112.124 YaApp_Android/22.95.1 YaSearchBrowser/22.95.1 BroPP/1.0 SA/3 Mobile Safari/537.36",
    "Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/28.0.1500.95 YaBrowser/13.10.1500.9323 Safari/537.36",
    "Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.125 YaBrowser/17.7.1.791 Yowser/2.5 Safari/537.36",
    "Mozilla/5.0 (Windows NT 6.3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 YaBrowser/17.6.1.749 Yowser/2.5 Safari/537.36",
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 YaBrowser/17.3.1.873 (beta) Yowser/2.5 Safari/537.36",
    // Yandex Browser:
    "Mozilla/5.0 (Windows NT 6.2; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/28.0.1500.95 YaBrowser/13.10.1500.9323 Safari/537.36",
    // ZZZ Glitches and Misidentified Browsers "These browsers are legit user agent even though they are included in some bot listings (not all bots identify themselves):",
    "(iPhone; CPU iPhone OS 16_4_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.4 Mobile/15E148 DuckDuckGo/7 Safari/605.1.15",
    "; Android 11) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/96.0.4664.45 Mobile DuckDuckGo/5 Safari/537.36",
    "Android 11) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/86.0.4240.185 Mobile DuckDuckGo/5 Safari/537.36",
    "Android 13) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/114.0.5735.196 Mobile DuckDuckGo/5 Safari/537.36",
    "GoogleApp/14.35.18.28.arm64",
    "LWPrCa2l') OR 941=(SELECT 941 FROM PG_SLEEP(15))--",
    "Mozilla / 5.0 (Linux; Android 7.0; GHIA_ZEUS_3G) AppleWebKit / 537.36 (KHTML, como Gecko) Chrome / 87.0.4280.101 Mobile Safari / 537.36",
    "Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 5.1; Trident/4.0; GTB6.5; .NET CLR 2.0.50727; staticlogin:productcboxf09&actlogin&infoZmlsZW5hbWU9UG93ZXJ3b3JkMjAwOU94Zi4yNTI2OS40MDExLmV4ZSZtYWM9N0RDMTUwREU5MUEyNERBOTlBODYxREY3NjQ0Nzc1NDYmcGFzc3BvcnQ9JnZlcnN",
    "Mozilla/5.0 (compatible; Lucidworks-Anda/2.0/0.10; +; )",
    "Mozilla/5.0 (en-us) AppleWebKit/525.13 (KHTML, like Gecko) Version/3.1 Safari/525.13",
    "mWebView.getSettings().setUserAgentString(\x22Mozilla/5.0 (Amiga; U; AmigaOS 1.3; en; rv:1.8.1.19);",
    "ozilla/5.0 (Linux; Android 10) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/115.0.5790.166 Mobile DuckDuckGo/5 Safari/537.36",
    // ZZZ Insignificat bots "These bots have very low appearance rate and are not worth blocking:",
    "Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; WOW64; Trident/5.0; Banca Caboto s.p.a.)",
    "Opera/9.70 (Linux armv7l ; U; turbotabbee/TSV2.0/1.02Q; fr) Presto/2.2]",
  ];
}

function getCrawlers() {
  return [
    // 360Spider:
    "Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.1 (KHTML, like Gecko) Chrome/21.0.1180.89 Safari/537.1; 360Spider",
    // Aboundexbot:
    "Aboundex/0.3 (http://www.aboundex.com/crawler/)",
    // Acoon:
    "Mozilla/5.0 (compatible; AcoonBot/4.11.1; +http://www.acoon.de/robot.asp)",
    // AddThis.com:
    "AddThis.com robot tech.support@clearspring.com",
    // ADMantX:
    "ADmantX Platform Semantic Analyzer - ADmantX Inc. - www.admantx.com - support@admantx.com",
    // Agentslug:
    "agentslug.com - website monitoring tool",
    // aHrefs Bot:
    "Mozilla/5.0 (compatible; AhrefsBot/5.0; +http://ahrefs.com/robot/) AppEngine-Google; (+http://code.google.com/appengine; appid: s~proxyfile1-hrd)",
    // Akregator:
    "Akregator/1.2.9; librss/remnants",
    // AlertSite Monitoring:
    "Mozilla/5.0 (X11; Linux x86_64; rv:52.0) Gecko/20100101 Firefox/52.0 DejaClick/2.9.7.2",
    // Alexa:
    "ia_archiver (+http://www.alexa.com/site/help/webmasters; crawler@alexa.com)",
    // Alexa Crawler:
    "ia_archiver (+http://www.alexa.com/site/help/webmasters; crawler@alexa.com)",
    // Alexa Site Audit:
    "Mozilla/5.0 (compatible; alexa site audit/1.0; http://www.alexa.com/help/webmasters; )",
    // Amaya:
    "amaya/10 libwww/5.4.0",
    // Amazon Route53 Health Check:
    "Amazon-Route53-Health-Check-Service (ref b0eb04d5-cb5e-40e7-839b-558e52fc3f0d; report http://amzn.to/1vsZADi)",
    // Amorank Spider:
    "AmorankSpider/0.1; +http://amorank.com/webcrawler.html",
    // Analytics SEO Crawler:
    "Curious George - www.analyticsseo.com/crawler",
    // ApacheBench:
    "ApacheBench/2.3",
    // Apple:
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_5) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.1.1 Safari/605.1.15 (Applebot/0.1; +http://www.apple.com/go/applebot)",
    // Apple PubSub:
    "Apple-PubSub/65.28",
    // Applebot:
    "Mozilla/5.0 (iPhone; CPU iPhone OS 13_4_1 like Mac OS X) AppleWebKit/605.1.15Z (KHTML, like Gecko) Version/13.1 Mobile/15E148 Safari/604.1 (Applebot/0.1)",
    "Mozilla/5.0 (iPhone; CPU iPhone OS 8_1 like Mac OS X) AppleWebKit/600.1.4 (KHTML, like Gecko) Version/8.0 Mobile/12B410 Safari/600.1.4 (Applebot/0.1; +http://www.apple.com/go/applebot)",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit/600.2.5 (KHTML, like Gecko) Version/8.0.2 Safari/600.2.5 (Applebot/0.1)",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/12.1.1 Safari/605.1.15 (Applebot/0.1)",
    // Application Health Service:
    "ApplicationHealthService/1.0",
    "ELB-HealthChecker/2.0",
    // Arachni:
    "Arachni/v1.5.1",
    // archive.org bot:
    "Mozilla/5.0 (compatible; special_archiver/3.2.0 +http://www.loc.gov/webarchiving/notice_to_webmasters.html)",
    // ArchiveBox:
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.61 Safari/537.36 ArchiveBox/0.6.2",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.61 Safari/537.36 ArchiveBox/{VERSION} (+https://github.com/ArchiveBox/ArchiveBox/)",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Chrome/102.0.0.0 Safari/605.1.15 ArchiveBox/{VERSION} (+https://github.com/ArchiveBox/ArchiveBox/)",
    // Ask Jeeves:
    "Mozilla/2.0 (compatible; Ask Jeeves/Teoma)",
    // AspiegelBot:
    "Mozilla/5.0 (Linux; Android 7.0;) AppleWebKit/537.36 (KHTML, like Gecko) Mobile Safari/537.36 (compatible; AspiegelBot)",
    // Awario:
    "AwarioSmartBot/1.0 (+https://awario.com/bots.html; bots@awario.com)",
    // Backlink-Check.de:
    "Backlink-Check.de (+http://www.backlink-check.de/bot.html)",
    // BacklinkCrawler:
    "BacklinkCrawler (http://www.backlinktest.com/crawler.html)",
    // Baidu:
    "Mozilla/5.0 (compatible; Baiduspider/2.0; +http://www.baidu.com/search/spider.html)",
    // Baidu Spider:
    "Mozilla/5.0 (Windows; U; Windows NT 5.1; zh-CN; rv:1.9.2.8;baidu Transcoder) Gecko/20100722 Firefox/3.6.8 ( .NET CLR 3.5.30729)",
    // BazQux Reader:
    "Mozilla/5.0 (compatible; BazQux/2.4; +https://bazqux.com/fetcher; 2 subscribers)",
    // BingBot:
    "MSNBot/Nutch-1.5.1",
    // Bit Discovery:
    "bitdiscovery",
    // BitlyBot:
    "bitlybot/3.0",
    // Bitrix:
    "Bitrix link preview",
    // Blekkobot:
    "Mozilla/5.0 (compatible; Blekkobot; ScoutJet; +http://blekko.com/about/blekkobot)",
    // BLEXBot Crawler:
    "Mozilla/5.0 (compatible; BLEXBot/1.0; +http://webmeup-crawler.com/)",
    // Bloglovin:
    "Bloglovin/1.0 (http://www.bloglovin.com; 1 subscribers)",
    // Blogtrottr:
    "Blogtrottr/2.0",
    // Blogtrottr feed fetcher:
    "Blogtrottr/2.0",
    "Blogtrottr/3.0",
    // BoardReader:
    "BoardReader Favicon Fetcher /1.0 info@boardreader.com",
    // BoardReader Blog Indexer:
    "BoardReader Blog Indexer(http://boardreader.com)",
    // Bountii Bot:
    "Mozilla/5.0 (compatible; BountiiBot/1.1; +http://bountii.com/contact.php)",
    // BrandVerity:
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.10; rv:41.0) Gecko/20100101 Firefox/55.0 BrandVerity/1.0 (http://www.brandverity.com/why-is-brandverity-visiting-me)",
    // Braze:
    "Braze Sender f3c381e4920fede7f46d83610f0abf15fdc10433",
    // Breaker:
    "Breaker/v315 (subscribers=9999; feed-id=123456; url=https://www.breaker.audio/url-slug-to-podcast)",
    // Browsershots:
    "Browsershots",
    // BUbiNG:
    "BUbiNG (+http://law.di.unimi.it/BUbiNG.html)",
    // Buck:
    "Buck/2.2; (+https://app.hypefactors.com/media-monitoring/about.html)",
    // Burp Collaborator Scanner:
    "Godzilla/17.0 (Unknown Operator; Nexus 5X Build/MMB29P) NoWebKit/5.36 (DOM, like Rhino; n7vbji2k0wt3rsbev55blgx17sdk8lwek97zvo.burpcollaborator.net) TOR/540.5.35487 Torrent 2654.76",
    "http://5iojs2zo8rkhlrrwmm7oyl75twztnlo9ex9kz8o.burpcollaborator.net/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.142 Safari/537.36",
    "Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.142 Safari/537.36'+(select load_file('x97bjuqgzjb9cjiodeygpdyxkoqledf164uzhp5e.burpcollaborator.netszc'))+'",
    "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.87 Safari/537.36 root@8f6gtjctw9glvnasfrq438tprig56wty20ghwkf9.burpcollaborator.net",
    // Butterfly Robot:
    "Mozilla/5.0 (Macintosh; Butterfly/1.0; +http://labs.topsy.com/butterfly/) Gecko/2009032608 Firefox/3.0.8",
    // Bytespider:
    "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.5668.1446 Mobile Safari/537.36; Bytespider;bytespider@bytedance.com",
    // CareerBot:
    "Mozilla/5.0 (compatible; CareerBot/1.1; +http://www.career-x.de/bot.html)",
    // Castro 2:
    "Castro 2, Episode Duration Lookup",
    // Catchpoint:
    "Mozilla/4.0 (compatible; Catchpoint)",
    "Mozilla/5.0 (Linux; U; Android 4.0.2; en-us; Catchpoint) AppleWebKit/534.30 (KHTML, like Gecko) Version/4.0 Mobile Safari/534.30",
    "Mozilla/5.0 (Windows NT 6.3; WOW64; Trident/7.0; rv:11.0; Catchpoint) like Gecko",
    "Mozilla/5.0 (X11; Linux x86_64; Catchpoint) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.90 Safari/537.36",
    // CATExplorador:
    "CATExplorador/1.0beta (sistemes at domini dot cat; http://domini.cat/catexplorador.html)",
    // ccBot crawler:
    "CCBot/2.0 (http://commoncrawl.org/faq/)",
    // Censys:
    "Mozilla/5.0 (compatible; CensysInspect/1.1; +https://about.censys.io/)",
    // CF-UC:
    "CF-UC User Agent v.1d.374049",
    // Chrome Headless:
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/100.0.4896.88 Safari/537.36",
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/83.0.4103.61 Safari/537.36",
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/92.0.4512.0 Safari/537.36",
    // ClamAV Website Scanner:
    "ClamAV 0.95.3",
    "ClamAV/0.101.5 (OS: linux-gnu, ARCH: x86_64, CPU: x86_64)",
    // Cliqzbot:
    "Cliqzbot/0.1 (+http://cliqz.com/company/cliqzbot)",
    // CloudFlare:
    "Cloudflare Custom Hostname Verification",
    "Mozilla/5.0 (compatible; CloudFlare-AlwaysOnline/1.0; +http://www.cloudflare.com/always-online) AppleWebKit/534.34",
    "Mozilla/5.0 (compatible; Cloudflare-AMP/1.0; +https://amp.cloudflare.com/doc/fetcher.html) AppleWebKit/534.34",
    "Mozilla/5.0 (compatible;Cloudflare-Healthchecks/1.0;+https://www.cloudflare.com/; healthcheck-id: f867e0e43eca7aa4)",
    "nginx-ssl early hints",
    // Collectd:
    "collectd/5.5.1",
    // CommaFeed:
    "CommaFeed/1.0 (http://www.commafeed.com)",
    // Comscore:
    "Mozilla/5.0 (compatible; proximic; +https://www.comscore.com/Web-Crawler)",
    // Cốc Cốc:
    "Mozilla/5.0 (compatible; coccocbot-image/1.0 ; +http://help.coccoc.com/searchengine)",
    "Mozilla/5.0 (compatible; coccocbot-web/1.0; +http://help.coccoc.com/searchengine)",
    // Cốc Cốc Bot:
    "Mozilla/5.0 (compatible; coccocbot/1.0; +http://help.coccoc.com/searchengine)",
    // Dareboost test tool:
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36 DareBoost",
    // Datadog Agent:
    "Datadog Agent/5.10.1",
    // Datanyze:
    "Mozilla/5.0 (X11; Datanyze; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36",
    // Dataprovider:
    "Mozilla/5.0 (compatible; Dataprovider/6.92; +https://www.dataprovider.com/)",
    // Daum:
    "Mozilla/5.0 (compatible; MSIE or Firefox mutant;) Daum 4.1",
    // Dazoobot:
    "Mozilla/5.0 (compatible; Dazoobot/0.1; +http://dazoo.fr)",
    // DeepNOC:
    "deepnoc - https://deepnoc.com/bot",
    // Discobot:
    "Mozilla/5.0 (compatible; discobot/1.0; +http://discoveryengine.com/discobot.html)",
    // Discourse Onebox:
    "Discourse Forum Onebox v2.6.0.beta2",
    "Discourse/2.6.0.beta3",
    // Domain Control Violation:
    "COMODO DCV",
    "Sectigo DCV",
    // Domain Re-Animator Bot:
    "support@domainreanimator.com",
    // DotBot:
    "dotbot",
    // Dotcom Monitor:
    "Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.1; WOW64; Trident/6.0) DMBrowser/2.1 (UV)",
    "Mozilla/5.0 (Linux; U; Android 2.2; en-us; SCH-I800 Build/FROYO) AppleWebKit/533.1 (KHTML, like Gecko) Version/4.0 Mobile Safari/533.1 DMBrowser-BV",
    "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.117 Safari/537.36 DMBrowser/2.1 (BV; LV)",
    // Downcast:
    "Downcast/2.9.11 (iPhone; iOS 9.2; Scale/2.00)",
    // DuckDuckGo:
    "DDG-Android-3.1.0",
    "ddg_android/5.90.0 (com.duckduckgo.mobile.android; Android API 28)",
    "ddg_android/5.90.0 (com.duckduckgo.mobile.android; Android API 30)",
    "DuckDuckBot/1.0; (+http://duckduckgo.com/duckduckbot.html)",
    "DuckDuckGo/0 CFNetwork/1126 Darwin/19.5.0",
    "Mozilla/5.0 (compatible; DuckDuckBot-Https/1.1; https://duckduckgo.com/duckduckbot)",
    "Mozilla/5.0 (compatible; DuckDuckGo-Favicons-Bot/1.0; +http://duckduckgo.com)",
    // DuckDuckGo Bot:
    "Mozilla/5.0 (compatible; DuckDuckGo-Favicons-Bot/1.0; +http://duckduckgo.com)",
    // EA Origin Browser:
    "webcollage.original/1.176",
    "webcollage/1.182",
    "webcollage/1.183",
    // Easou Spider:
    "Mozilla/5.0 (iPhone; U; CPU iPhone OS 3_0 like Mac OS X; en-us; EasouSpider; +http://www.easou.com/search/spider.html)",
    // eCairn-Grabber:
    "Mozilla/5.0 eCairn-Grabber/1.0 (+http://ecairn.com/grabber)",
    // EMail Exractor:
    "EMail Exractor",
    // Embedly:
    "Mozilla/5.0 (compatible; Embedly/0.2; +http://support.embed.ly/)",
    // evc-batch:
    "Mozilla/5.0 (compatible; evc-batch/2.0)",
    // ExaBot:
    "Mozilla/5.0 (compatible; Konqueror/3.5; Linux) KHTML/3.5.5 (like Gecko) (Exabot-Thumbnails)",
    // Exabot:
    "Mozilla/5.0 (compatible; Exabot/3.0; +http://www.exabot.com/go/robot)",
    "Mozilla/5.0 (compatible; Konqueror/3.5; Linux) KHTML/3.5.5 (like Gecko) (Exabot-Thumbnails)",
    // ExactSeek Crawler:
    "ExactSeek Crawler (nutch 1.4)/Nutch-1.4 (ExactSeek Crawler; http://www.exactseek.com)",
    // Expanse:
    "Expanse, a Palo Alto Networks company, across the global IPv4 space multiple times per day to identify customers&#39; presences on the Internet. If you would like to be excluded from our, please send IP addresses/domains to: scaninfo@paloaltonetworks.com",
    // eZ Publish Link Validator:
    "eZ Publish Link Validator",
    // Ezooms:
    "Mozilla/5.0 (compatible; Ezooms/1.0; help@moz.com)",
    // Facebook:
    "facebookcatalog/1.0",
    "facebookexternalhit/1.0 (+http://www.facebook.com/externalhit_uatext.php)",
    "facebookexternalhit/1.1",
    "facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)",
    "facebookplatform/1.0 (+http://developers.facebook.com)",
    "facebot",
    // Feeder.co:
    "Mozilla/5.0 (feeder.co; Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/106.0.0.0 Safari/537.36",
    // Findxbot:
    "Mozilla/5.0 (compatible; Findxbot/1.0; +http://www.findxbot.com)",
    // FirePHP:
    "SAMSUNG-S8000/S8000XXIF3 SHP/VPP/R5 Jasmine/1.0 Nextreaming SMM-MMS/1.92.0 profile/MIDP-2.1 configuration/CLDC-1.1 FirePHP/0.3(Linux LLC 1.2)",
    // Flipboard:
    "Mozilla/5.0 (compatible; FlipboardRSS/1.2; +http://flipboard.com/browserproxy)",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.9; rv:28.0) Gecko/20100101 Firefox/28.0 (FlipboardProxy/1.6; +http://flipboard.com/browserproxy)",
    // Foregenix:
    "Foregenix Web Scan 1.100000 (www.foregenix.com/scan)",
    // Fuzz Faster U Fool (https://github.com/ffuf/ffuf):
    "Fuzz Faster U Fool v1.5.0-dev",
    // Generic Bot:
    "SeopultContentAnalyzer/1.0",
    // Genieo Web filter:
    "Mozilla/5.0 (compatible; Genieo/1.0 http://www.genieo.com/webfilter.html)",
    // GettHIT:
    "www.GettHIT.com | Free Traffic Exchange Bot | If you are seeing this, then your website has been listed in our traffic exchange service. | Visit Us : https://www.getthit.com/bot | Macintosh; Intel Mac OS X 10_7_5 (compatible; getthit.com/3.1;)",
    // Gigablast:
    "GigablastOpenSource/1.0",
    // Gluten Free Crawler:
    "Mozilla/5.0 (compatible; Gluten Free Crawler/1.0; +http://glutenfreepleasure.com/)",
    // Gmail Image Proxy:
    "Mozilla/5.0 (Windows NT 5.1; rv:11.0) Gecko Firefox/11.0 (via ggpht.com GoogleImageProxy)",
    // Goo:
    "DoCoMo/2.0 P900i(c100;TB;W24H11) (compatible; ichiro/mobile goo; +http://search.goo.ne.jp/option/use/sub4/sub4-1/)",
    // Google AdSense:
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_7_3) AppleWebKit/537.36 (KHTML, like Gecko, Mediapartners-Google) Chrome/114.0.5735.179 Safari/537.36",
    // Google Favicon:
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/49.0.2623.75 Safari/537.36 Google Favicon",
    // Google PageSpeed Insights:
    "Mozilla/5.0 (iPhone; U; CPU iPhone OS 4_0_1 like Mac OS X; en-us) AppleWebKit/537.4 (KHTML, like Gecko; Google Page Speed Insights) Version/4.0.5 Mobile/8A306 Safari/6531.22.7",
    // Google Partner Monitoring:
    "Mozilla/5.0 (Windows NT 5.1) AppleWebKit/535.1 (KHTML, like Gecko) Chrome/14.0.835.202 Safari/535.1 google_partner_monitoring FWSzVTDDBz14547302713138T",
    // Google Search Console:
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko; Google Search Console) Chrome/41.0.2272.118 Safari/537.36",
    // Google services:
    "AdsBot-Google (+http://www.google.com/adsbot.html)",
    "APIs-Google (+https://developers.google.com/webmasters/APIs-Google.html)",
    "AppEngine-Google; (+http://code.google.com/appengine; appid: s~snapchat-proxy)",
    "Dalvik/2.1.0 (Linux; U; Android 5.1.1_r1; Samsung Galaxy S4 Build/SGH-I337M)(googleweblight)",
    "FeedFetcher-Google; (+http://www.google.com/feedfetcher.html)",
    "Google-Cloud-Tasks",
    "GoogleAssociationService",
    "Mozilla/5.0 (compatible; Google-InspectionTool/1.0)",
    "Mozilla/5.0 (compatible; Google-Site-Verification/1.0)",
    "Mozilla/5.0 (iPhone; CPU iPhone OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1 (compatible; AdsBot-Google-Mobile; +http://www.google.com/mobile/a)",
    "Mozilla/5.0 (Linux; Android 4.2.1; en-us; Nexus 5 Build/JOP40D) AppleWebKit/535.19 (KHTML, like Gecko; googleweblight) Chrome/38.0.1025.166 Mobile Safari/535.19",
    "Mozilla/5.0 (Linux; Android 4.2.1; en-us; Nexus 5 Build/JOP40D) AppleWebKit/535.19 (KHTML, like Gecko; googleweblight) Chrome/38.0.1025.166 Mobile Safari/535.19,gzip(gfe)",
    "Mozilla/5.0 (Linux; Android 6.0.1; Nexus 5X Build/MMB29P) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.92 Mobile Safari/537.36 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
    "Mozilla/5.0 (Linux; Android 6.0.1; Nexus 5X Build/MMB29P) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.108 Mobile Safari/537.36 (compatible; Google-InspectionTool/1.0)",
    "Mozilla/5.0 (Macintosh; intel mac os x 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.175 Safari/537.36 Chrome-Lighthouse",
    "Mozilla/5.0 (Windows NT 5.1; rv:11.0) Gecko Firefox/11.0 (via ggpht.com GoogleImageProxy)",
    "Mozilla/5.0 (Windows; Linux; Android 4.2.1; en-us; Nexus 5 Build/JOP40D) AppleWebKit/535.19 (KHTML, like Gecko; googleweblight) Chrome/38.0.1025.166 Mobile Safari/535.19",
    "Mozilla/5.0 (X11; Linux x86_64)  AppleWebKit/537.36 (KHTML, like Gecko; Google Web Preview)  Chrome/84.0.4147.108 Safari/537.36",
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36 Google (+https://developers.google.com/+/web/snippet/)",
    "Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; Googlebot/2.1; +http://www.google.com/bot.html) Chrome/84.0.4147.108 Safari/537.36",
    "Nokia5800d-1/5.0 (SymbianOS/9.4; Series60/5.3 Nokia5800d-1/111.050.1511; Mozilla/5.0; Profile/MIDP-2.1 Configuration/CLDC-1.1; googleweblight) AppleWebKit/533.4 (KHTML, like Gecko, googleweblight) NokiaBrowser/8.3.7.4 Mobile Safari/533.4 3gpp-gba",
    // Google Structured Data Testing Tool:
    "Google-Structured-Data-Testing-Tool +https://search.google.com/structured-data/testing-tool)",
    // Googlebot:
    "Mozilla/5.0 (Linux; Android 8.0; Pixel 2 Build/OPD3.170816.012; DuplexWeb-Google/1.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.131 Mobile Safari/537.36",
    // Got:
    "got (https://github.com/sindresorhus/got)",
    // Grapeshot:
    "Mozilla/5.0 (iPhone; CPU iPhone OS 8_3 like Mac OS X) AppleWebKit/600.1.4 (KHTML, like Gecko) Version/8.0 Mobile/12F70 Safari/600.1. 4 (compatible; GrapeshotCrawler/2.0; +https://www.grapeshot.com/crawler/)",
    // GTmetrix:
    "Mozilla/5.0 (X11; Linux x86_64; GTmetrix https://gtmetrix.com/) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.100 Safari/537.36",
    // GuzzleHttp:
    "GuzzleHttp/7",
    // Heritrix:
    "Mozilla/5.0 (compatible; worio bot heritrix/1.10.0 +http://worio.com)",
    // Heureka Feed:
    "Heurekabot-Feed/1.0 (+https://sluzby.heureka.cz/napoveda/heurekabot/)",
    // Hexometer:
    "Hexometer",
    // HighWinds Content Delivery System:
    "HWCDN/GFS v1.80.995-4.38.2369.el7 CDS/AT2",
    "HWCDN/GFS v1.80.995-4.38.2369.el7 CDS/DA2",
    "HWCDN/GFS v1.89.1003-1.3.2692.el7 CDS/AT2",
    // Hobbit:
    "Hobbit bbtest-net/4.3.0-0.beta2",
    // HTTP Clients (Software Library):
    "Apache-HttpClient/4.3.6 (java 1.5)",
    "axios/0.18.1,gzip(gfe)",
    "axios/0.19.2",
    "axios/0.21.4, XFF:35.228.69.34",
    "curl/7.64.1",
    "Go 1.1 package http",
    "go-http-client/1.1",
    "go-resty/2.3.0 (https://github.com/go-resty/resty)",
    "grpc-java-netty/1.28.1",
    "grpc-node/1.24.2 grpc-c/8.0.0 (linux; chttp2; ganges)",
    "grpc-ruby/1.21.0 grpc-c/7.0.0 (linux; chttp2; gandalf)",
    "http-kit/2.0",
    "Jakarta Commons-HttpClient/3.1",
    "Java/1.8.0_121",
    "libwww-perl/6.04",
    "lua-resty-http/0.10 (Lua) ngx_lua/10000",
    "LWP Network",
    "lwp-trivial/5.810",
    "Microsoft-CryptoAPI/10.0",
    "Mozilla/5.0libwww-perl/5.826",
    "node-fetch",
    "okhttp/3.4.1",
    "PHP/5.2.14",
    "PostmanRuntime/7.9.1",
    "python-requests/2.21.0",
    "Python-urllib/2.7",
    "RestSharp/106.5.4.0",
    "scalaj-http/2.4.2",
    "WinHTTP",
    // HTTPMon:
    "HTTPMon/1.0b (http://www.httpmon.com)",
    // HubPages:
    "HubPages V0.2.2 (http://hubpages.com/help/crawlingpolicy)",
    // HubSpot:
    "HubSpot Website Grader (web-crawlers@hubspot.com)",
    // Hydra by addthis:
    "Mozilla/4.0 (Hydra)",
    "Mozilla/5.0 (Hydra Proxy)",
    // ICC-Crawler:
    "ICC-Crawler/2.0 (Mozilla-compatible; ; http://www.nict.go.jp/en/univ-com/plan/crawl.html)",
    // IDG/IT:
    "IDG/IT (http://spaziodati.eu/)",
    // IFTTT:
    "IFTTT-Protocol/v1",
    // IIS Site Analysis:
    "iisbot/1.0 (+http://www.iis.net/iisbot.html)",
    // inoreader:
    "Mozilla/5.0 (compatible; inoreader.com; 2 subscribers)",
    // Interasco:
    "InterascoAgent/1.0",
    // Invision:
    "Invision Community 4",
    // IP-Guide Crawler:
    "IP-Guide.com Crawler/1.0 (https://ip-guide.com)",
    // IPS Agent:
    "Mozilla/5.0 (compatible; ips-agent)",
    // JetBrains Omea Reader:
    "JetBrains Omea Reader 2.2 (http://www.jetbrains.com/omea/reader/)",
    // Jorgee Vulnerability Scanner:
    "Mozilla/5.0 Jorgee",
    // jsjcw_scanner:
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/71.0.3578.98 Safari/537.36 jsjcw_scanner",
    // Kaspersky:
    "Kaspersky Lab CFR link resolver cfradmins@kaspersky.com",
    // Knowledge AI:
    "The Knowledge AI",
    // Kuberneters:
    "applicationhealthservice/1.0",
    "kube-probe/1.15",
    // l9tcpid (github.com/LeakIX/l9tcpid):
    "l9tcpid/v1.1.0",
    // Larbin web crawler:
    "larbin_2.6.3 larbin2.6.3@unspecified.mail",
    // LCC:
    "LCC (+http://corpora.informatik.uni-leipzig.de/crawler_faq.html)",
    // Let's Encrypt Validation:
    "Mozilla/5.0 (compatible; Let's Encrypt validation server; +https://www.letsencrypt.org)",
    // Liferea:
    "Liferea/1.10.6 (Linux; en_US.UTF8; http://liferea.sf.net/) AppleWebKit (KHTML, like Gecko)",
    // Lighthouse:
    "Mozilla/5.0 (Linux; Android 6.0.1; Nexus 5 Build/MRA58N) AppleWebKit/537.36(KHTML, like Gecko) Chrome/61.0.3116.0 Mobile Safari/537.36 Chrome-Lighthouse",
    // Linespider:
    "Mozilla/5.0 (compatible; linespider/1.1; +https://lin.ee/4dwxkth)",
    // Linkdex Bot:
    "Mozilla/5.0 (iPhone; U; CPU iPhone OS 4_1 like Mac OS X; en-us) AppleWebKit/532.9 (KHTML, like Gecko) Version/4.0.5 Mobile/8B117 Safari/6531.22.7 (compatible; linkdexbot-mobile/2.1; +http://www.linkdex.com/about/bots/)",
    // Linkedin:
    "linkedinbot/1.0 (compatible; mozilla/5.0; apache-httpclient +http://www.linkedin.com)",
    // LinkedIn Bot:
    "LinkedInBot/1.0 (compatible; Mozilla/5.0; Jakarta Commons-HttpClient/3.1 +http://www.linkedin.com)",
    // LTX71:
    "ltx71 - (http://ltx71.com/)",
    // ltx71:
    "ltx71 - (http://ltx71.com/)",
    // M2E Pro Cron Service:
    "M2E Pro Cron Service/1.0",
    // Magpie-Crawler:
    "magpie-crawler/1.1 (U; Linux amd64; en-GB; +http://www.brandwatch.net)",
    // Mail.Ru Bot:
    "Mozilla/5.0 (compatible; Linux x86_64; Mail.RU_Bot/Fast/2.0; +http://go.mail.ru/help/robots)",
    // masscan:
    "masscan/1.0 (https://github.com/robertdavidgraham/masscan)",
    // Mastodon Bot:
    "http.rb/3.2.0 (Mastodon/2.4.3; +https://uwu.social/)",
    // Meanpath Bot:
    "Mozilla/5.0 (compatible; meanpathbot/1.0; +http://www.meanpath.com/meanpathbot.html)",
    // MediaHubMX:
    "MediaHubMX/2",
    // Medusa by pymedusa:
    "python/unicode Medusa/0.2.14 (Windows; 10; 3174120f-3388-11e9-b8bd-1c1b0d9d2a41)",
    "python/unicode Medusa/0.2.14 (Windows; 10; d26d37e1-3389-11e9-8d14-1c1b0d9d2a41)",
    // MetaInspector:
    "MetaInspector/5.4.0 (+https://github.com/jaimeiniesta/metainspector)",
    // MetaJobBot:
    "Mozilla/5.0 (compatible; MetaJobBot; http://www.metajob.de/crawler)",
    // Mixrank Bot:
    "Mozilla/5.0 (compatible; MixrankBot; crawler@mixrank.com)",
    // MJ12 Bot:
    "Mozilla/5.0 (compatible; MJ12bot/v1.4.4; http://www.majestic12.co.uk/bot.php?+)",
    // Mnogosearch:
    "Mnogosearch-3.1.21",
    // MojeekBot:
    "Mozilla/5.0 (compatible; MojeekBot/0.6; http://www.mojeek.com/bot.html)",
    // Monit:
    "Monit/5.23.0",
    // Monitor.Us:
    "Mozilla/5.0 (compatible; www.monitor.us - free monitoring service; http://www.monitor.us)",
    // Morningscore:
    "Mozilla/5.0 (Morningscore/1.0)",
    // Moz:
    "Mozilla/5.0 (compatible; DotBot/1.2; +https://opensiteexplorer.org/dotbot; help@moz.com)",
    "rogerbot/1.2 (https://moz.com/help/guides/moz-procedures/what-is-rogerbot, rogerbot-crawler+aardwolf-crawler-45@moz.com)",
    // Munin:
    "munin/http_loadtime",
    // Nagios check_http:
    "check_http/v1.5 (nagios-plugins 1.5)",
    // NalezenCzBot:
    "NalezenCzBot/1.0 (http://www.nalezen.cz/about-crawler)",
    // Naver Search:
    "Mozilla/5.0 (Linux; Android 12; SM-G975N Build/SP1A.210812.016; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/90.0.4430.232 Whale/1.0.0.0 Crosswalk/26.90.3.21 Mobile Safari/537.36 NAVER(inapp; search; 1010; 11.11.3)",
    "Mozilla/5.0 (Linux; Android 8.0.0; SM-N950N Build/R16NW; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/79.0.3945.88 Mobile Safari/537.36 NAVER(inapp; search; 1000; 11.8.4; 11)",
    // nbertaupete95:
    "Mozilla/5.0/Firefox/42.0 - nbertaupete95(at)gmail.com",
    // Netcraft Survey Bot:
    "Netcraft SSL Server Survey - contact info@netcraft.com",
    // NetLyzer FastProbe:
    "NetLyzer FastProbe",
    // NetNewsWire:
    "NetNewsWire/4.0.0 (Mac OS X; http://netnewswireapp.com/mac/; gzip-happy)",
    // Netvibes:
    "Netvibes (http://www.netvibes.com/; 8 subscribers; feedID: 2244192)",
    // Newsbeuter:
    "newsbeuter/2.4 (Linux 3.2.0-23-generic; i686; http://www.newsbeuter.org/) libcurl/7.22.0 GnuTLS/2.12.14 zlib/1.2.3.4 libidn/1.23 librtmp/2.3",
    // NewsBlur:
    "NewsBlur Page Fetcher - 7 subscribers - http://www.newsblur.com/site/3966817/analytics-piwik (Mozilla/5.0 (Macintosh; Intel Mac OS X 10_7_1) AppleWebKit/534.48.3 (KHTML, like Gecko) Version/5.1 Safari/534.48.3)",
    "NewsBlur/4.0.1 CFNetwork/672.1.13 Darwin/14.0.0",
    // NewsBlur Mobile App:
    "NewsBlur iPad App v3.6",
    // NewsGator:
    "NewsGatorOnline/2.0 (http://www.newsgator.com; 2 subscribers)",
    // Newspaper:
    "newspaper/0.0.8",
    "newspaper/0.2.8",
    // Ngios Monitor:
    "check_http/v2.2.1 (nagios-plugins 2.2.1)",
    // Nibbler (nibbler.silktide.com):
    "nibbler",
    // NLCrawler:
    "nlcrawler/1.0 (+http://northernlight.com/)",
    // Nmap:
    "Mozilla/5.0 (compatible; Nmap Scripting Engine; https://nmap.org/book/nse.html)",
    // Nodejs:
    "undici",
    // Nuclei:
    "Nuclei - Open-source project (github.com/projectdiscovery/nuclei)",
    // Nutch-based Bot:
    "your sipder name/Nutch-1.7",
    // Nuzzel:
    "Nuzzel",
    // oBot:
    "Mozilla/5.0 (compatible; oBot/2.3.1; http://www.xforce-security.com/crawler/)",
    // Octopus:
    "Octopus 1.0.2",
    // Off By One:
    "Mozilla/4.7 (compatible; OffByOne; Windows 2000) Webster Pro V3.4",
    // Omgili bot:
    "omgilibot/0.3 +http://www.omgili.com/Crawler.html",
    // Openindex Spider:
    "Mozilla/5.0 (compatible; OpenindexSpider; +http://www.openindex.io/en/webmasters/spider.html)",
    // OpenLinkProfiler:
    "Mozilla/5.0 (compatible; spbot/4.0.9; +http://OpenLinkProfiler.org/bot )",
    // OpenWebSpider:
    "OpenWebSpider v0.1.4 (http://www.openwebspider.org/)",
    // Orange Bot:
    "Mozilla/5.0 (Windows; U; Windows NT 5.1;fr;rv:1.8.1) VoilaBotCollector BETA 0.1 (http://www.voila.com/)",
    // Other Site Monitor Bots:
    "LogicMonitor SiteMonitor/1.0",
    // Outbrain:
    "Mozilla/5.0 (Java) outbrain",
    // Pageburst:
    "Mozilla/5.0 (iPad; CPU OS 9_1 like Mac OS X) AppleWebKit/601.1 (KHTML, like Gecko; compatible; pageburst) CriOS/79.0.3945.117 Mobile/13B143 Safari/601.1.46",
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko; compatible; pageburst) Chrome/109.0.5414.101 Safari/537.36",
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko; compatible; pageburst) Chrome/111.0.5563.146 Safari/537.36",
    // PaperLiBot:
    "Mozilla/5.0 (compatible; PaperLiBot/2.1; http://support.paper.li/entries/20023257-what-is-paper-li)",
    // PerimeterX:
    "PerimeterX Integration Services",
    // PetalBot:
    "Mozilla/5.0 (Linux; Android 7.0;) AppleWebKit/537.36 (KHTML, like Gecko) Mobile Safari/537.36 (compatible; PetalBot;+https://webmaster.petalsearch.com/site/petalbot)",
    // Phantomas:
    "phantomas/1.11.0 (PhantomJS/1.9.8; linux x64)",
    // PhantomJS:
    "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/538.1 (KHTML, like Gecko) PhantomJS/2.0.0 Safari/538.1",
    // PHP Server Monitor:
    "Mozilla/5.0 (compatible; phpservermon/3.1.1; +http://www.phpservermonitor.org)",
    // Picsearch bot:
    "psbot/0.1 (+http://www.picsearch.com/bot.html)",
    // Pingdom:
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Ubuntu Chromium/61.0.3163.100 Chrome/61.0.3163.100 Safari/537.36 PingdomPageSpeed/1.0 (pingbot/2.0; +http://www.pingdom.com/)",
    // Pingdom Bot:
    "Pingdom.com_bot_version_1.4_(http://www.pingdom.com/)",
    // Pinterest:
    "Mozilla/5.0 (compatible; Pinterestbot/1.0; http://www.pinterest.com/bot.html)",
    // Placid.app:
    "placid.app/v1",
    // PocketParser:
    "PocketParser/2.0 (+https://getpocket.com/pocketparser_ua)",
    // Postman:
    "PostmanRuntime/7.29.0",
    // PritTorrent:
    "PritTorrent/1.0",
    // Prometheus:
    "check_http/v2.1.2 (monitoring-plugins 2.1.2)",
    "prometheus/2.18.1",
    // proximic:
    "Mozilla/5.0 (compatible; proximic; +http://www.proximic.com/info/spider.php)",
    // Pulp:
    "Pulp/1.5.2 (iPad; http://www.acrylicapps.com/pulp/)",
    // QuerySeekerSpider:
    "QuerySeekerSpider ( http://queryseeker.com/bot.html )",
    // Quora Link Preview:
    "Quora Link Preview/1.0 (http://www.quora.com)",
    // Qwantify:
    "Mozilla/5.0 (compatible; Qwantify/2.2w; +https://www.qwant.com/)/*",
    // Rainmeter:
    "Rainmeter WebParser plugin",
    // RamblerMail Image Proxy:
    "RamblerMail/6.0 (incompatible; ImageProxy/6.0)",
    // ReadKit:
    "ReadKit/7017 CFNetwork/673.2.1 Darwin/13.1.0 (x86_64) (MacBookPro10%2C1)",
    // RebelMouse:
    "RebelMouse/0.1 Mozilla/5.0 (compatible; http://rebelmouse.com) Gecko/20100101 Firefox/7.0.1",
    // Reddit Bot:
    "Mozilla/5.0 (compatible; redditbot/1.0; +http://www.reddit.com/feedback)",
    // Reeder:
    "Reeder/3.2 CFNetwork/672.1.12 Darwin/14.0.0",
    // Request-Promise:
    "Request-Promise",
    // Rest Client github.com/rest-client/rest-client:
    "rest-client/2.1.0",
    "rest-client/2.1.0 (linux x86_64) ruby/2.7.6p219",
    // Rigor Synythetic Monitoring:
    "Mozilla/5.0 (X11; Linux x86_64; Rigor) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.106 Safari/537.36",
    "Mozilla/5.0 (X11; Linux x86_64; rv:45.0; Rigor) Gecko/20100101 Firefox/45.0",
    // Rogerbot:
    "rogerbot/1.0 (http://www.moz.com/dp/rogerbot, rogerbot-crawler@moz.com)",
    // ROI Hunter:
    "ROI Hunter; https://api-dev.roihunter.com",
    // RSS Feed Readers:
    "Bloglines/3.1 (http://www.bloglines.com)",
    "Feed Wrangler/1.0 (3 subscribers; feed-id=248559; http://feedwrangler.net; Allow like Gecko)",
    "Feedbin - 9 subscribers",
    "FeedBurner/1.0 (http://www.FeedBurner.com)",
    "FeedDemon/4.5 (http://www.feeddemon.com/; Microsoft Windows XP)",
    "FeeddlerRSS 2.4 (iPad; iPhone OS 5.1.1; en_US)",
    "Feedspot http://www.feedspot.com",
    "Fever/1.38 (Feed Parser; http://feedafever.com; Allow like Gecko)",
    "FreshRSS/1.12.0 (Linux; https://freshrss.org)",
    "kouio.com RSS reader - 6 subscribers",
    "MagpieRSS/0.72 (+http://magpierss.sf.net)",
    "MetaFeedly/1.0 (http://www.feedly.com)",
    "Mozilla/5.0 (feeder.co; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.99 Safari/537.36",
    "Mozilla/5.0 (Windows NT 6.1) AppleWebKit/602.1 (KHTML, like Gecko) QuiteRSS/0.18.12 Safari/602.1",
    "RSS Junkie Daemon",
    "RssBandit/1.9.0.1002 (.NET CLR 2.0.50727.7512; WinNT 6.2.9200.0; http://www.rssbandit.org)",
    "RSSOwl/2.2.1.201312301316 (X11; U; en)",
    "RSSRadio (Push Notification Scanner;support@dorada.co.uk)",
    "Tiny Tiny RSS/1.11.4c63934 (http://tt-rss.org/)",
    // RuxitSynthetic:
    "Chrome/80.0.3987.87 Safari/537.36 RuxitSynthetic/1.0 v6191106029376332690 t7889551165227354132",
    "Mozilla/5.0 (iPhone; CPU iPhone OS 10_3 like Mac OS X) AppleWebKit/602.1.50 (KHTML, like Gecko) CriOS/56.0.2924.75 Mobile/14E5239e Safari/602.1 RuxitSynthetic/1.0",
    // SafeDNSBot:
    "SafeDNSBot (https://www.safedns.com/searchbot)",
    // Scrapy:
    "Scrapy/1.0.3.post6+g2d688cd (+http://scrapy.org)",
    // Screaming Frog SEO Spider:
    "Screaming Frog SEO Spider/2.22",
    // Screeenly:
    "screeenly-bot 2.0",
    // ScreenerBot:
    "ScreenerBot Crawler Beta 2.0 (+http://www.ScreenerBot.com)",
    // Seekport:
    "Mozilla/5.0 (compatible; Seekport Crawler; http://seekport.com/)",
    // Semrush Bot:
    "Mozilla/5.0 (compatible; SemrushBot/0.97; +http://www.semrush.com/bot.html)",
    // Sensika Bot:
    "SensikaBot/x.33 (+http://sensika.com)",
    // Sentry Bot:
    "sentry/8.6.0 (https://getsentry.com)",
    // SEOENGBot:
    "SEOENGWorldBot/1.0 (+http://www.seoengine.com/seoengbot.htm)",
    // SEOkicks-Robot:
    "Mozilla/5.0 (compatible; SEOkicks-Robot; +http://www.seokicks.de/robot.html)",
    // Seoscanners.net:
    "Mozilla/5.0 (compatible; seoscanners.net/1; +spider@seoscanners.net)",
    // Server Density:
    "Server Density Service Monitoring v2",
    // Seznam Bot:
    "SeznamBot/3.0 (+http://fulltext.sblog.cz/)",
    // Seznam Email Proxy:
    "Mozilla/5.0 SeznamEmailProxy/2.0.174",
    // Seznam Zbozi.cz:
    "Seznam-Zbozi-robot/3.0",
    // SeznamBot:
    "Mozilla/5.0 (compatible; SeznamBot/4.0-RC1 +http://napoveda.seznam.cz/seznambot-intro/)",
    // Shared Web Credentials:
    "swcd (unknown version) CFNetwork/1128.0.1 Darwin/19.6.0",
    // ShopAlike:
    "Mozilla/5.0 (ShopAlike; LadenZeile) FeedBot",
    // Shopify Partner:
    "shopify-partner-homepage-scraper",
    // ShopWiki:
    "ShopWiki/1.0 ( +http://www.shopwiki.com/wiki/Help:Bot)",
    // SilverReader:
    "SilverReader/1.0; http://silverreader.com",
    // SimplePie:
    "SimplePie/1.3.1 (Feed Parser; http://simplepie.org; Allow like Gecko) Build/20121030175911",
    // Sistrix:
    "Mozilla/5.0 (compatible; Optimizer)",
    "Mozilla/5.0 (Linux; Android 7.0; Moto G (4)) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4143.7 Mobile Safari/537.36 Chrome-Lighthouse",
    "Python-urllib/3.7",
    // SISTRIX Crawler:
    "Mozilla/5.0 (compatible; SISTRIX Crawler; http://crawler.sistrix.net/)",
    // SISTRIX Optimizer:
    "Mozilla/5.0 (compatible; SISTRIX Optimizer; Uptime; +https://www.sistrix.com/faq/uptime)",
    // Site24x7 Website Monitoring:
    "Site24x7",
    // Siteimprove:
    "Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.1; Trident/6.0) LinkCheck by Siteimprove.com",
    // SiteScoreBot:
    "SiteScoreBot v20210315 - https://sitescore.ai",
    // SiteSucker:
    "SiteSucker for macOS/2.10.5",
    // Sixy.ch:
    "sixy.ch/1.0",
    // Skype:
    "Mozilla/5.0 (Windows nt 6.1; wow64) SkypeURIPreview Preview/0.5",
    // Skype URI Preview:
    "Mozilla/5.0 (Windows NT 6.1; WOW64) SkypeUriPreview Preview/0.5",
    // Slackbot:
    "Slackbot-LinkExpanding 1.0 (+https://api.slack.com/robots)",
    // SMTBot:
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3440.75 Safari/537.36 (compatible; SMTBot/1.0; +http://www.similartech.com/smtbot)",
    // Snapchat Proxy:
    "AppEngine-Google; (+http://code.google.com/appengine; appid: s~snapchat-proxy)",
    // Sogou:
    "Mozilla/5.0 (Linux; Android 9; NX569J Build/PQ3A.190505.002; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/68.0.3440.106 Mobile Safari/537.36 AWP/2.0 SogouMSE,SogouMobileBrowser/5.21.8",
    "Sogou head spider/3.0( http://www.sogou.com/docs/help/webmasters.htm#07)",
    "Sogou Orion spider/3.0( http://www.sogou.com/docs/help/webmasters.htm#07)",
    "Sogou Pic Spider/3.0( http://www.sogou.com/docs/help/webmasters.htm#07)",
    "Sogou web spider/4.0(+http://www.sogou.com/docs/help/webmasters.htm#07)",
    "Sogou-Test-Spider/4.0 (compatible; MSIE 5.5; Windows 98)",
    // Sogou Spider:
    "Sogou web spider/4.0(+http://www.sogou.com/docs/help/webmasters.htm",
    // Soso Spider:
    "Sosospider+(+http://help.soso.com/webspider.htm)",
    // Sparkler:
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/537.36 (KHTML, like Gecko) Sparkler/0.2.0-SNAPSHOT",
    // Speedcurve:
    "Mozilla/5.0 (iPhone; CPU iPhone OS 15_0_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/604.1 PTST/SpeedCurve/230120.120134",
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/106.0.0.0 Safari/537.36 PTST/SpeedCurve/230120.120134",
    // Spinn3r:
    "Mozilla/5.0 (X11; U; Linux x86_64; en-US; rv:1.9.0.19; aggregator:Spinn3r (Spinn3r 3.1); http://spinn3r.com/robot) Gecko/2010040121 Firefox/3.0.19",
    // Splash:
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) splash Version/10.0 Chrome/98.0.4758.80 Safari/537.36",
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/602.1 (KHTML, like Gecko) splash Version/10.0 Safari/602.1",
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/602.1 (KHTML, like Gecko) splash Version/9.0 Safari/602.1",
    // Spotify:
    "Spotify/1.0",
    // Sputnik Bot:
    "Mozilla/5.0 (compatible; SputnikImageBot/2.2)",
    // sqlmap:
    "sqlmap/1.1.8.2#dev (http://sqlmap.org)",
    // SSL Labs:
    "SSL Labs (https://www.ssllabs.com/about/assessment.html)",
    // Startpagina Linkchecker:
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_8_5) AppleWebKit/536.30.1 (KHTML, like Gecko) (compatible; Startpagina-Linkchecker/1.0; +https://www.startpagina.nl/linkchecker)",
    // StatusCake:
    "Mozilla/5.0 (Windows NT 6.2; WOW64) AppleWebKit/537.4 (KHTML, like Gecko) Chrome/98 Safari/537.4 (StatusCake)",
    // Steam:
    "Valve/Steam HTTP Client 1.0",
    // Superfeedr Bot:
    "Superfeedr bot/2.0 http://superfeedr.com - Make your feeds realtime: get in touch!",
    // Survey Bot:
    "Mozilla/5.0 (Windows; U; Windows NT 5.1; en; rv:1.9.0.13) Gecko/2009073022 Firefox/3.5.2 (.NET CLR 3.5.30729) SurveyBot/2.3 (DomainTools)",
    // SWCD:
    "SWCD (Unknown Version) CFNetwork/1107.1 Darwin/19.0.0",
    // SyntheticsAgent:
    "Mozilla/5.0 (Linux; Android 7.0; SM-G930V Build/NRD90M) AppleWebKit/605.36 (KHTML, like Gecko) Chrome/107.0.4183.121 Mobile Safari/537.36 SyntheticsAgent/1670084315573",
    // TagInspector:
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) TagInspector/500.1 Chrome/90.0.4430.72 Safari/537.36 Edg/90.0.818.42",
    // Tarmot Gezgin:
    "Tarmot Gezgin/1.0 (compatible; TarmotGezgin/1.1; +http://www.tarmot.com/gezgin)",
    // Telegram:
    "TelegramBot (like TwitterBot)",
    // TelegramBot:
    "TelegramBot (like TwitterBot)",
    // The Knowledge AI:
    "The Knowledge AI",
    // theoldreader:
    "Mozilla/5.0 (compatible; theoldreader.com; 1 subscribers; feed-id=aaa)",
    // Thumbor:
    "Thumbor/6.7.5, Mozilla/5.0 (Linux; Android 9; RAZER Phone Build/NMF26F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.111 Mobile Safari/537.36 AlohaBrowser/2.13.1",
    // TinEye Crawler:
    "TinEye-bot/0.02 (see http://www.tineye.com/crawler.html)",
    // TLSProbe:
    "TLSProbe/1.0 (+https://scan.trustnet.venafi.com/)",
    // ToolBot:
    "SEO Consulting; Redirect Checker Tool V.02; IP:",
    // TraceMyFile:
    "Mozilla/5.0 (compatible; tracemyfile/1.0)",
    // Trendiction Bot:
    "Mozilla/5.0 (Windows; U; Windows NT 6.0; en-GB; rv:1.0; trendictionbot0.5.0; trendiction search; http://www.trendiction.de/bot; please let us know of any problems; web at trendiction.com) Gecko/20071127 Firefox/3.0.0.11",
    // TurnitinBot:
    "TurnitinBot/3.0 (http://www.turnitin.com/robot/crawlerinfo.html)",
    // TweetedTimes Bot:
    "TweetedTimes Bot/1.0 (Mozilla/5.0 Compatible, +http://tweetedtimes.com)",
    // Tweetmeme Bot:
    "Mozilla/5.0 (compatible; TweetmemeBot/3.0; +http://tweetmeme.com/)",
    // Twingly Recon:
    "Mozilla/5.0 (compatible; Twingly Recon; twingly.com)",
    // Twitterbot:
    "Twitterbot/1.0",
    // UkrNet Mail Proxy:
    "Mozilla/5.0 (Windows NT 10.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.87 Safari/537.36 (via secureurl.fwdcdn.com - mail.ukr.net proxy)",
    // UniversalFeedParser:
    "UniversalFeedParser/5.2.1 +https://code.google.com/p/feedparser/",
    // updown.io monitoring:
    "updown.io daemon 2.2",
    // Uptime Robot:
    "Mozilla/5.0+(compatible; UptimeRobot/2.0; http://www.uptimerobot.com/)",
    // Uptimebot:
    "Mozilla/5.0 (compatible; Uptimebot/1.0; +http://www.uptime.com/uptimebot)",
    // URLAppendBot:
    "Mozilla/5.0 (compatible; URLAppendBot/1.0; +http://www.profound.net/urlappendbot.html)",
    // User-Agent prefix error:
    "User-Agent:Mozilla/5.0 (compatible; MSIE 11.0.190; Windows NT 10.0; .NET CLR 1.0.3705;)",
    "User-Agent:Mozilla/5.0 (compatible; MSIE 11.0.190; Windows Phone OS 10.0; Trident/5.0; IEMobile/9.0; NOKIA; Lumia 710)",
    "User-Agent:Mozilla/5.0 (Macintosh; Intel Mac OS X 11_3_1) AppleWebKit/535.7 (KHTML, like Gecko) Chrome/92.0 Safari /535.7",
    "User-Agent:Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.74 Safari/537.36 Edg/90.0.818.62",
    "User-Agent:Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0 Safari /537.36",
    // Vagabondo:
    "Mozilla/4.0 (compatible;  Vagabondo/4.0; http://webagent.wise-guys.nl/; http://www.wise-guys.nl/)",
    // Var:
    "Anonymous, Mozilla/5.0 (Linux; Android 11; CPH2211) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.166 Mobile Safari/537.36 OPR/65.2.3381.61420",
    "Anonymous, Mozilla/5.0 (Linux; Android 9; RAZER Phone Build/NMF26F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.111 Mobile Safari/537.36 AlohaBrowser/2.13.1",
    "Anonymous, Mozilla/5.0 (X11; Linux Mint x86_64) AppleWebKit/537.37 (KHTML, like Gecko) Chrome/50.0.2272.105 Safari/537.37 Vivaldi/1.5.201.2",
    // Visual Site Mapper Crawler:
    "Mozilla/5.0 (compatible; VSMCrawler; http://www.visualsitemapper.com/crawler/)",
    // VK Share Button:
    "Mozilla/5.0 (compatible; vkShare; +http://vk.com/dev/Share)",
    // W3C CSS Validator:
    "Jigsaw/2.3.0 W3C_CSS_Validator_JFouffa/2.0 (See <http://validator.w3.org/services>)",
    // W3C I18N Checker:
    "W3C_I18n-Checker/1.0 (http://validator.w3.org/services)",
    // W3C Link Checker:
    "W3C-checklink/4.81 libwww-perl/5.836",
    // W3C Markup Validation Service:
    "W3C_Validator/1.767",
    // W3C MobileOK Checker:
    "W3C-mobileOK/DDC-1.0 (see http://www.w3.org/2006/07/mobileok-ddc)",
    // W3C Unified Validator:
    "W3C_Unicorn/1.0 (http://validator.w3.org/services)",
    // Wappalyzer:
    "Mozilla/5.0 (compatible; Wappalyzer; +https://github.com/AliasIO/Wappalyzer)",
    // WebbCrawler:
    "WebbCrawler 1.0 ( http://badcheese.com/crawler.html )",
    // WebGazer:
    "WebGazer/1.0 (+https://www.webgazer.io)",
    // Weborama:
    "weborama-fetcher (+http://www.weborama.com)",
    // WebPageTest:
    "Mozilla/5.0 (Linux; Android 6.0.1; Moto G (4) Build/MPJ24.139-64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.146 Mobile Safari/537.36 PTST/180829.190838",
    // WebPurify:
    "WebPurify(callback)",
    // WebSitePulse:
    "websitepulse checker/1.1 (compatible; MSIE 5.5; Netscape 4.75; Linux)",
    // Wechat Dev Tools:
    "Mozilla/5.0 (iPhone; CPU iPhone OS 13_1_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 MicroMessenger/7.0.12(0x17000c2f) NetType/4G Language/zh_CN wechatdevtools qcloudcdn-xinan",
    "Mozilla/5.0 (Linux; Android 0; MIX 2S Build/QKQ1.190828.002; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/105.0.0.0MQQBrowser/6.2 TBS/045129 Mobile Safari/537.36 MMWEBID/5228 MicroMessenger/7.0.14.1660(0x27000E37) Process/tools NetType/WIFI Language/zh_CN ABI/arm64 WeChat/arm64 wechatdevtools qcloudcdn-xinan",
    "Mozilla/5.0 (Linux; Android 11; FIG-AL10 Build/HUAWEIFIG-AL10; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/105.0.0.0MQQBrowser/6.2 TBS/045223 Mobile Safari/537.36 MMWEBID/1214 MicroMessenger/7.0.14.1660(0x27000E39) Process/tools NetType/WIFI Language/zh_CN ABI/arm64 WeChat/arm64 wechatdevtools qcloudcdn-xinan",
    "Mozilla/5.0 (Linux; Android 7.1.2; M6 Note Build/N2G47H; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/105.0.0.0MQQBrowser/6.2 TBS/045223 Mobile Safari/537.36 MMWEBID/9551 MicroMessenger/7.0.14.1660(0x27000E37) Process/tools NetType/4G Language/zh_CN ABI/arm64 WeChat/arm64 wechatdevtools qcloudcdn-xinan",
    // WeSEE:Search:
    "WeSEE:Search/0.1 (Alpha, http://www.wesee.com/en/support/bot/)",
    // WhatsApp:
    "WhatsApp/2.21.12.21 A",
    "whatsapp/2.2123.8 n",
    // WikiDo:
    "WikiDo/1.1 (http://wikido.com; crawler@wikido.com)",
    // Wininet-APIs https://web.archive.org/web/20100715071639/http://blogs.msdn.com/b/jpsanders/archive/2009/04/17/how-to-get-certificate-information-using-wininet-apis.aspx:
    "Test Certificate Info",
    // WooRank:
    "Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1 (compatible; woorankreview/2.0; +https://www.woorank.com/)",
    // Woorank Test Tool:
    "Mozilla/5.0 (compatible; woorankreview/2.0; +https://www.woorank.com/)",
    "Mozilla/5.0 (iPad; CPU OS 11_0 like Mac OS X) AppleWebKit/604.1.34 (KHTML, like Gecko) Version/11.0 Mobile/15A5341f Safari/604.1 (compatible; woorankreview/2.0; +https://www.woorank.com/)",
    "Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1 (compatible; woorankreview/2.0; +https://www.woorank.com/)",
    "Mozilla/5.0 (Linux; Android 7.0; Moto G (4)) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4420.0 Mobile Safari/537.36 Chrome-Lighthouse (compatible; woorankreview/2.0; +https://www.woorank.com/)",
    // WordPress:
    "WordPress/4.7.2; https://example.com",
    // Wotbox:
    "Wotbox/2.01 (+http://www.wotbox.com/bot/)",
    // XaxisSemanticsClassifier:
    "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/40.0.2214.93 Safari/537.36 XaxisSemanticsClassifier/1.0",
    // XenForo:
    "XenForo/2.x (https://www.example.com)",
    // Xymon Site Monitor:
    "Xymon xymonnet/4.3.17",
    // YaCy:
    "yacybot (freeworld/global; x86 Windows XP 5.1; java 1.7.0_21; GMT+04:00/ru) http://yacy.net/bot.html",
    // Yahoo Ad monitoring:
    "Mozilla/5.0 (compatible; Yahoo Ad monitoring; https://help.yahoo.com/kb/yahoo-ad-monitoring-SLN24857.html) tands-prod-eng.hlfs-prod---sieve.hlfs-rest_client/1624415525-0",
    // Yahoo Gemini:
    "Mozilla/5.0 (compatible; Yahoo Ad monitoring; https://help.yahoo.com/kb/yahoo-ad-monitoring-SLN24857.html)",
    // Yahoo! Japan BRW:
    "Y!J-BRW/1.0 (https://www.yahoo-help.jp/app/answers/detail/p/595/a_id/42716)",
    // Yahoo! Link Preview:
    "Yahoo:LinkExpander:Slingstone",
    // Yahoo! Slurp:
    "Mozilla/5.0 (compatible; Yahoo! Slurp; http://help.yahoo.com/help/us/ysearch/slurp)",
    // Yandex:
    "Mozilla/5.0 (compatible; YandexBot/3.0; +http://yandex.com/bots)",
    // Yandex Bot:
    "Mozilla/5.0 (compatible; YaDirectFetcher/1.0; Dyatel)",
    "Mozilla/5.0 (compatible; YandexVerticals/1.0; http://yandex.com/bots)",
    // Yeti (Naver):
    "Mozilla/5.0 (compatible; yeti/1.1; +http://naver.me/spd)",
    "Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.0 Safari/537.36 (compatible; Yeti/1.1; +http://naver.me/spd)",
    "Yeti/1.1 (Naver Corp.; http://help.naver.com/robots/)",
    // Youdao Bot:
    "Mozilla/5.0 (compatible; YoudaoBot/1.0; http://www.youdao.com/help/webmaster/spider/; )",
    // Yourls:
    "YOURLS v1.5.1 +http://yourls.org/ (running on http://fhort.com)",
    // Yunyun Bot:
    "Mozilla/5.0 (compatible; YYSpider; +http://www.yunyun.com/spider.html)",
    // Zao:
    "Zao/0.1 (http://www.kototol.org/zao)",
    // Ze List:
    "zelist.ro feed parser (+http://www.zelist.ro)",
    // Zendesk:
    "Zendesk Webhook",
    // Zookabot:
    "Zookabot/2.5;++http://zookabot.com",
    // Zoom Webhook:
    "Zoom Marketplace/1.0a",
    // ZoomBot (seozoom.it):
    "zoombot (linkbot 1.0 http://suite.seozoom.it/bot.html)",
    // ZumBot:
    "ZumBot/1.0 (ZUM Search; http://help.zum.com/inquiry)",
    // ZZZ Miscellaneous Glitches and Errornous User Agent Strings:
    "123",
    "<class 'fake_useragent.fake.FakeUserAgent'>",
    "Chrome",
    "default_user_agent",
    "ipad",
    "iphone 6 plus;afengineurl=https://intoli.com:443;traceId=63028f8e-c5fc-4846-993f-59a96268a85d",
    "Mozilla/5.0 (Linux; Android 10; FIG-AL10 Build/HUAWEIFIG-AL10; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/105.0.0.0MQQBrowser/6.2 TBS/045223 Mobile Safari/537.36 MMWEBID/1214 MicroMessenger/7.0.14.1660(0x27000E39) Process/tools NetType/4G Language/zh_CN ABI/arm64 WeChat/arm64 wechatdevtools qcloudcdn-xinan",
    "Mozilla/5.0 (Linux; Android 10; M6 Note Build/N2G47H; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/105.0.0.0MQQBrowser/6.2 TBS/045223 Mobile Safari/537.36 MMWEBID/9551 MicroMessenger/7.0.14.1660(0x27000E37) Process/tools NetType/4G Language/zh_CN ABI/arm64 WeChat/arm64 wechatdevtools qcloudcdn-xinan",
    "pisya",
    "POST /parser Host: user-agents.net  action=parse&amp;format=[json|xml]&amp;string=Mozilla%2F5.0%20%28Linux%3B%20Android%2012%29%20AppleWebKit%2F537.36%20%28KHTML%2C%20like%20Gecko%29%20Version%2F4.0%20Chrome%2F96.0.4664.104%20Mobile%20DuckDuckGo%2F5%20Safari%2F537.36",
    "search.marginalia.nu",
    "U2FsdGVkX1+uKxeH2946/bMTDvtm/Fr0nWjvFR/oPtc64LSh1Gg0qkbJUIhLpSw5h/mjF86TFOXrl4U2SG1KBi4BC0EfphyIzeOxVXkpBWHDMfJnkrFGrubrRGjmJNIN49DKkOcjVgq2/iVDBMSAQe30k9wNIDtflfnlrOrmDPkXiYNjLbohSHLaNWS/GK5hu62gkOH25c9i1B+jMq5kc590HoQqJ0o4es9QrEnwluMsYPbQy14LxgPjeCQveiPHPXtkSM7TmfTY53HEJdbFHylstSOJNTQclbL67BKx33M=",
  ];
}
