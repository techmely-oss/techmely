export function isIOS(): boolean {
  return typeof navigator !== "undefined"
    ? ["iPad Simulator", "iPhone Simulator", "iPod Simulator", "iPad", "iPhone", "iPod"].includes(
        navigator.platform,
      ) ||
        // iPad on iOS 13 detection
        (navigator.userAgent.includes("Mac") && "ontouchend" in document)
    : false;
}
