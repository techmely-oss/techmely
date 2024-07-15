export function stringifyQueryObject(queryParameters: Record<string, unknown>) {
  if (!queryParameters) return "";
  return Object.entries(queryParameters).reduce((queryString, [key, val]) => {
    const symbol = queryString.length === 0 ? "?" : "&";
    // biome-ignore lint/style/noParameterAssign: Ignore
    queryString += typeof val === "string" ? `${symbol}${key}=${val}` : "";
    return queryString;
  }, "");
}
