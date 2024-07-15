/**
 * A list of bot identifiers to be used in a regular expression against user agent strings.
 */
export const botPatterns = [
  " daum[ /]",
  " deusu/",
  " yadirectfetcher",
  "(?:^| )site",
  "(?:^|[^g])news",
  "(?<! (?:channel/|google/))google(?!(app|/google| pixel))",
  "(?<! cu)bot(?:[^\\w]|_|$)",
  "(?<! ya(?:yandex)?)search",
  "(?<!(?:lib))http",
  "(?<![hg]m)score",
  "@[a-z]",
  "\\(at\\)[a-z]",
  "\\[at\\][a-z]",
  "^12345",
  "^<",
  "^[\\w \\.\\-\\(?:\\):]+(?:/v?\\d+(\\.\\d+)?(?:\\.\\d{1,10})?)?(?:,|$)",
  "^[^ ]{50,}$",
  "^active",
  "^ad muncher",
  "^amaya",
  "^anglesharp/",
  "^avsdevicesdk/",
  "^bidtellect/",
  "^biglotron",
  "^bot",
  "^btwebclient/",
  "^clamav[ /]",
  "^client/",
  "^cobweb/",
  "^coccoc",
  "^custom",
  "^ddg[_-]android",
  "^discourse",
  "^dispatch/\\d",
  "^downcast/",
  "^duckduckgo",
  "^facebook",
  "^fdm[ /]\\d",
  "^getright/",
  "^gozilla/",
  "^hatena",
  "^hobbit",
  "^hotzonu",
  "^hwcdn/",
  "^jeode/",
  "^jetty/",
  "^jigsaw",
  "^linkdex",
  "^metauri",
  "^microsoft bits",
  "^movabletype",
  "^mozilla/\\d\\.\\d \\(compatible;?\\)$",
  "^mozilla/\\d\\.\\d \\w*$",
  "^navermailapp",
  "^netsurf",
  "^nuclei",
  "^offline explorer",
  "^php",
  "^postman",
  "^postrank",
  "^python",
  "^rank",
  "^read",
  "^reed",
  "^rest",
  "^serf",
  "^snapchat",
  "^space bison",
  "^svn",
  "^swcd ",
  "^taringa",
  "^thumbor/",
  "^tumblr/",
  "^user-agent:",
  "^valid",
  "^venus/fedoraplanet",
  "^w3c",
  "^webbandit/",
  "^webcopier",
  "^wget",
  "^whatsapp",
  "^xenu link sleuth",
  "^yahoo",
  "^yandex",
  "^zdm/\\d",
  "^zoom marketplace/",
  "^{{.*}}$",
  "adbeat\\.com",
  "appinsights",
  "archive",
  "ask jeeves/teoma",
  "bit\\.ly/",
  "bluecoat drtr",
  "browsex",
  "burpcollaborator",
  "capture",
  "catch",
  "check",
  "chrome-lighthouse",
  "chromeframe",
  "classifier",
  "cloud",
  "crawl",
  "cryptoapi",
  "dareboost",
  "datanyze",
  "dataprovider",
  "dejaclick",
  "dmbrowser",
  "download",
  "evc-batch/",
  "feed",
  "firephp",
  "freesafeip",
  "gomezagent",
  "headless",
  "httrack",
  "hubspot marketing grader",
  "hydra",
  "ibisbrowser",
  "images",
  "inspect",
  "iplabel",
  "ips-agent",
  "java(?!;)",
  "library",
  "mail\\.ru/",
  "manager",
  "monitor",
  "neustar wpm",
  "nutch",
  "offbyone",
  "optimize",
  "pageburst",
  "parser",
  "perl",
  "phantom",
  "pingdom",
  "powermarks",
  "preview",
  "proxy",
  "ptst[ /]\\d",
  "reader",
  "reputation",
  "resolver",
  "retriever",
  "rexx;",
  "rigor",
  "robot",
  "rss",
  "scan",
  "scrape",
  "server",
  "sogou",
  "sparkler/",
  "speedcurve",
  "spider",
  "splash",
  "statuscake",
  "stumbleupon\\.com",
  "supercleaner",
  "synapse",
  "synthetic",
  "torrent",
  "trace",
  "transcoder",
  "twingly recon",
  "url",
  "virtuoso",
  "wappalyzer",
  "webglance",
  "webkit2png",
  "whatcms/",
  "wordpress",
  "zgrab",
];

export const botFullPattern =
  " daum[ /]| deusu/| yadirectfetcher|(?:^| )site|(?:^|[^g])news|(?<! (?:channel/|google/))google(?!(app|/google| pixel))|(?<! cu)bot(?:[^\\w]|_|$)|(?<! ya(?:yandex)?)search|(?<!(?:lib))http|(?<![hg]m)score|@[a-z]|\\(at\\)[a-z]|\\[at\\][a-z]|^12345|^<|^[\\w \\.\\-\\(?:\\):]+(?:/v?\\d+(\\.\\d+)?(?:\\.\\d{1,10})?)?(?:,|$)|^[^ ]{50,}$|^active|^ad muncher|^amaya|^anglesharp/|^avsdevicesdk/|^bidtellect/|^biglotron|^bot|^btwebclient/|^clamav[ /]|^client/|^cobweb/|^coccoc|^custom|^ddg[_-]android|^discourse|^dispatch/\\d|^downcast/|^duckduckgo|^facebook|^fdm[ /]\\d|^getright/|^gozilla/|^hatena|^hobbit|^hotzonu|^hwcdn/|^jeode/|^jetty/|^jigsaw|^linkdex|^metauri|^microsoft bits|^movabletype|^mozilla/\\d\\.\\d \\(compatible;?\\)$|^mozilla/\\d\\.\\d \\w*$|^navermailapp|^netsurf|^nuclei|^offline explorer|^php|^postman|^postrank|^python|^rank|^read|^reed|^rest|^serf|^snapchat|^space bison|^svn|^swcd |^taringa|^thumbor/|^tumblr/|^user-agent:|^valid|^venus/fedoraplanet|^w3c|^webbandit/|^webcopier|^wget|^whatsapp|^xenu link sleuth|^yahoo|^yandex|^zdm/\\d|^zoom marketplace/|^{{.*}}$|adbeat\\.com|appinsights|archive|ask jeeves/teoma|bit\\.ly/|bluecoat drtr|browsex|burpcollaborator|capture|catch|check|chrome-lighthouse|chromeframe|classifier|cloud|crawl|cryptoapi|dareboost|datanyze|dataprovider|dejaclick|dmbrowser|download|evc-batch/|feed|firephp|freesafeip|gomezagent|headless|httrack|hubspot marketing grader|hydra|ibisbrowser|images|inspect|iplabel|ips-agent|java(?!;)|library|mail\\.ru/|manager|monitor|neustar wpm|nutch|offbyone|optimize|pageburst|parser|perl|phantom|pingdom|powermarks|preview|proxy|ptst[ /]\\d|reader|reputation|resolver|retriever|rexx;|rigor|robot|rss|scan|scrape|server|sogou|sparkler/|speedcurve|spider|splash|statuscake|stumbleupon\\.com|supercleaner|synapse|synthetic|torrent|trace|transcoder|twingly recon|url|virtuoso|wappalyzer|webglance|webkit2png|whatcms/|wordpress|zgrab";
const regularExpression =
  / daum[ /]| deusu\/| yadirectfetcher|(?:^| )site|(?:^|[^g])news|(?<! (?:channel\/|google\/))google(?!(app|\/google| pixel))|(?<! cu)bot(?:[^\w]|_|$)|(?<! ya(?:yandex)?)search|(?<!(?:lib))http|(?<![hg]m)score|@[a-z]|\(at\)[a-z]|\[at\][a-z]|^12345|^<|^[\w \.\-\(?:\):]+(?:\/v?\d+(\.\d+)?(?:\.\d{1,10})?)?(?:,|$)|^[^ ]{50,}$|^active|^ad muncher|^amaya|^anglesharp\/|^avsdevicesdk\/|^bidtellect\/|^biglotron|^bot|^btwebclient\/|^clamav[ /]|^client\/|^cobweb\/|^coccoc|^custom|^ddg[_-]android|^discourse|^dispatch\/\d|^downcast\/|^duckduckgo|^facebook|^fdm[ /]\d|^getright\/|^gozilla\/|^hatena|^hobbit|^hotzonu|^hwcdn\/|^jeode\/|^jetty\/|^jigsaw|^linkdex|^metauri|^microsoft bits|^movabletype|^mozilla\/\d\.\d \(compatible;?\)$|^mozilla\/\d\.\d \w*$|^navermailapp|^netsurf|^nuclei|^offline explorer|^php|^postman|^postrank|^python|^rank|^read|^reed|^rest|^serf|^snapchat|^space bison|^svn|^swcd |^taringa|^thumbor\/|^tumblr\/|^user-agent:|^valid|^venus\/fedoraplanet|^w3c|^webbandit\/|^webcopier|^wget|^whatsapp|^xenu link sleuth|^yahoo|^yandex|^zdm\/\d|^zoom marketplace\/|^{{.*}}$|adbeat\.com|appinsights|archive|ask jeeves\/teoma|bit\.ly\/|bluecoat drtr|browsex|burpcollaborator|capture|catch|check|chrome-lighthouse|chromeframe|classifier|cloud|crawl|cryptoapi|dareboost|datanyze|dataprovider|dejaclick|dmbrowser|download|evc-batch\/|feed|firephp|freesafeip|gomezagent|headless|httrack|hubspot marketing grader|hydra|ibisbrowser|images|inspect|iplabel|ips-agent|java(?!;)|library|mail\.ru\/|manager|monitor|neustar wpm|nutch|offbyone|optimize|pageburst|parser|perl|phantom|pingdom|powermarks|preview|proxy|ptst[ /]\d|reader|reputation|resolver|retriever|rexx;|rigor|robot|rss|scan|scrape|server|sogou|sparkler\/|speedcurve|spider|splash|statuscake|stumbleupon\.com|supercleaner|synapse|synthetic|torrent|trace|transcoder|twingly recon|url|virtuoso|wappalyzer|webglance|webkit2png|whatcms\/|wordpress|zgrab/i;

/**
 * Naive bot pattern.
 */
const naivePattern = /bot|spider|crawl|http|lighthouse/i;

// Workaround for TypeScript's type definition of imported variables and JSON files.

/**
 * A pattern that matches bot identifiers in user agent strings.
 */
export const botRegPattern = regularExpression;

/**
 * Check if the given user agent includes a bot pattern. Naive implementation (less accurate).
 */
export function isBotNaive(userAgent?: string | null): boolean {
  return naivePattern.test(userAgent || "");
}

let usedPattern: RegExp;
/**
 * Check if the given user agent includes a bot pattern.
 */
export function isBot(userAgent?: string | null): boolean {
  if (typeof usedPattern === "undefined") {
    try {
      // Build this RegExp dynamically to avoid syntax errors in older engines.
      usedPattern = new RegExp(botFullPattern, "i");
    } catch (error) {
      usedPattern = naivePattern;
    }
  }
  return usedPattern.test(userAgent || "");
}

/**
 * Create a custom isbot function with a custom pattern.
 */
export function createIsBot(customPattern: RegExp) {
  return (userAgent?: string | null) => {
    return customPattern.test(userAgent || "");
  };
}

/**
 * Create a custom isbot function with a custom pattern.
 */
export function createIsBotFromList(list: string[]): (userAgent?: string | null) => boolean {
  const pattern = new RegExp(list.join("|"), "i");
  return (userAgent?: string | null): boolean => {
    return pattern.test(userAgent || "");
  };
}

/**
 * Find the first part of the user agent that matches a bot pattern.
 */
export function isBotMatch(userAgent?: string | null): string | null {
  return userAgent?.match(botRegPattern)?.[0] ?? null;
}

/**
 * Find all parts of the user agent that match a bot pattern.
 */
export function isBotMatches(userAgent?: string | null): string[] {
  if (!userAgent) return [];
  return botPatterns
    .map((part) => {
      const matched = userAgent.match(new RegExp(part, "i"));
      if (!matched) return "";
      return matched[0];
    })
    .filter(Boolean);
}

/**
 * Find the first bot pattern that match the given user agent.
 */
export function isBotPattern(userAgent?: string | null): string | null {
  return userAgent
    ? botPatterns.find((pattern) => new RegExp(pattern, "i").test(userAgent)) ?? null
    : null;
}

/**
 * Find all bot patterns that match the given user agent.
 */
export function isBotPatterns(userAgent?: string | null): string[] {
  return userAgent ? botPatterns.filter((pattern) => new RegExp(pattern, "i").test(userAgent)) : [];
}
