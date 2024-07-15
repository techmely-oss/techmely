/**
 * example: parseQueryString('https://techmely.com/articles?page=1&type=developer') ==> {page: '1', type: 'developer'}
 * @returns an object from the given query string or URL.
 */
export function parseQueryString(url: string): Record<string, string> {
  const params = [...new URLSearchParams(url.split("?")[1])];
  return params.reduce((acc, [key, value]) => {
    acc[key] = value;
    return acc;
  }, {});
}
