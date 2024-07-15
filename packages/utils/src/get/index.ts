/**
 * @description Get nested object property from path string
 * @example const obj = {
  selector: { to: { val: 'val to select' } },
  target: [1, 2, { a: 'test' }] };

  get(obj, 'selector.to.val') --> 'val to select'
  get(obj, 'target[0]') --> 1
  get(obj, 'target[2].a'); --> 'test'
 */
export function get(from: any, selector: string): any {
  return selector
    .replace(/\[([^\[\]]*)\]/g, ".$1.")
    .split(".")
    .filter((t) => t !== "")
    .reduce((acc, curr) => acc?.[curr], from);
}
