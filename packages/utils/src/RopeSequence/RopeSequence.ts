export type RopeSequenceCallback<T> = (elt: T, index: number) => boolean | VoidFunction;

/**
 * A rope sequence is a persistent sequence data structure that supports appending,
 * prepending, and slicing without doing a full copy.
 * It is represented as a mostly-balanced tree.
 */
export class RopeSequence<T> {
  static empty: RopeSequence<any>;
  values;
  // Create a rope representing the given array, or return the rope
  // itself if a rope was given.
  static from<T>(values: readonly T[] | RopeSequence<T>): RopeSequence<T> {
    if (values instanceof RopeSequence) return values;
    return values?.length ? new Leaf(values) : RopeSequence.empty;
  }

  leafAppend(other: Leaf<T>): RopeSequence<T> | Leaf<T> | undefined {
    return undefined;
  }

  leafPrepend(other): RopeSequence<T> | Leaf<T> | undefined {
    return undefined;
  }

  sliceInner(from: number, to: number) {
    return new Leaf([]);
  }

  getInner(index: number): T | undefined {
    return undefined;
  }
  forEachInner(f: RopeSequenceCallback<T>, from, to, start) {}
  forEachInvertedInner(f: RopeSequenceCallback<T>, from, to, start) {}

  /**
   * Append an array or other rope to this one, returning a new rope.
   */
  append(other: RopeSequence<T> | Leaf<T> | readonly T[]): RopeSequence<T> | Leaf<T> {
    if (!other.length) return this;
    // biome-ignore lint/style/noParameterAssign: Ignore
    other = RopeSequence.from(other);

    return (
      (!this.length && other) ||
      (other.length < GOOD_LEAF_SIZE && this.leafAppend(other as Leaf<T>)) ||
      (this.length < GOOD_LEAF_SIZE && other.leafPrepend(this)) ||
      this.appendInner(other as Leaf<T>)
    );
  }

  // :: (union<[T], RopeSequence<T>>) → RopeSequence<T>
  // Prepend an array or other rope to this one, returning a new rope.
  prepend(other: RopeSequence<T> | readonly T[]): RopeSequence<T> | Leaf<T> {
    if (!other.length) return this;
    return RopeSequence.from(other).append(this);
  }

  appendInner(other: Leaf<T>): Append<T> | Leaf<T> {
    // @ts-expect-error Ignore type checking
    return new Append(this, other);
  }

  /**
   * Create a rope representing a sub-sequence of this rope.
   */
  slice(from = 0, to = RopeSequence.length): RopeSequence<T> | Leaf<T> {
    if (from >= to) return RopeSequence.empty;
    return this.sliceInner(Math.max(0, from), Math.min(this.length, to));
  }

  // :: (number) → T
  // Retrieve the element at the given position from this rope.
  get(i: number): T | undefined {
    if (i < 0 || i >= RopeSequence.length) return undefined;
    return this.getInner(i);
  }

  // :: ((element: T, index: number) → ?bool, ?number, ?number)
  // Call the given function for each element between the given
  // indices. This tends to be more efficient than looping over the
  // indices and calling `get`, because it doesn't have to descend the
  // tree for every element.
  forEach(
    f: (elt: T, index: number) => boolean | VoidFunction,
    from = 0,
    to = RopeSequence.length,
  ) {
    if (from <= to) this.forEachInner(f, from, to, 0);
    else this.forEachInvertedInner(f, from, to, 0);
  }

  // Map the given functions over the elements of the rope, producing
  // a flat array.
  map<U>(f: RopeSequenceCallback<U>, from = 0, to = RopeSequence.length): U[] {
    const result = [];
    // @ts-expect-error Ignore type check
    this.forEach((elt, i) => result.push(f(elt, i)), from, to);
    return result;
  }

  set length(v: number) {
    this.length = v;
  }

  get length() {
    return this.values.length;
  }
}

export const GOOD_LEAF_SIZE = 200;

class Leaf<T = any> extends RopeSequence<T> {
  override values;
  constructor(values) {
    super();
    this.values = values;
  }

  flatten() {
    return this.values;
  }

  override sliceInner(from: number, to: number) {
    if (from === 0 && to === this.length) return this;
    return new Leaf(this.values.slice(from, to));
  }

  override getInner(i: number) {
    return this.values[i];
  }

  override forEachInner(f: RopeSequenceCallback<T>, from: number, to: number, start: number) {
    for (let i = from; i < to; i++) if (f(this.values[i], start + i) === false) return false;
  }

  override forEachInvertedInner(
    f: RopeSequenceCallback<T>,
    from: number,
    to: number,
    start: number,
  ) {
    for (let i = from - 1; i >= to; i--) if (f(this.values[i], start + i) === false) return false;
  }

  override leafAppend(other: Leaf<T>) {
    if (this.length + other.length <= GOOD_LEAF_SIZE)
      return new Leaf(this.values.concat(other.flatten()));
  }

  override leafPrepend(other: Leaf<T>) {
    if (this.length + other.length <= GOOD_LEAF_SIZE)
      return new Leaf(other.flatten().concat(this.values));
  }

  override set length(v: number) {
    this.length = v;
  }

  override get length() {
    return this.values.length;
  }

  get depth() {
    return 0;
  }
}

RopeSequence.empty = new Leaf([]);

class Append<T = any> extends RopeSequence<T> {
  left: Leaf<T>;
  right: Leaf<T>;

  depth: number;
  constructor(left: Leaf<T>, right: Leaf<T>) {
    super();
    this.left = left;
    this.right = right;
    this.length = left.length + right.length;
    this.depth = Math.max(left.depth, right.depth) + 1;
  }

  flatten() {
    return this.left.flatten().concat(this.right.flatten());
  }

  override getInner(i: number) {
    return i < this.left.length ? this.left.get(i) : this.right.get(i - this.left.length);
  }

  override forEachInner(f: RopeSequenceCallback<T>, from: number, to: number, start: number) {
    const leftLen = this.left.length;
    if (from < leftLen && this.left.forEachInner(f, from, Math.min(to, leftLen), start) === false)
      return false;
    if (
      to > leftLen &&
      this.right.forEachInner(
        f,
        Math.max(from - leftLen, 0),
        Math.min(this.length, to) - leftLen,
        start + leftLen,
      ) === false
    )
      return false;
  }

  override forEachInvertedInner(
    f: RopeSequenceCallback<T>,
    from: number,
    to: number,
    start: number,
  ) {
    const leftLen = this.left.length;
    if (
      from > leftLen &&
      this.right.forEachInvertedInner(
        f,
        from - leftLen,
        Math.max(to, leftLen) - leftLen,
        start + leftLen,
      ) === false
    )
      return false;
    if (
      to < leftLen &&
      this.left.forEachInvertedInner(f, Math.min(from, leftLen), to, start) === false
    )
      return false;
  }

  override sliceInner(from: number, to: number) {
    if (from === 0 && to === this.length) return this;
    const leftLen = this.left.length;
    if (to <= leftLen) return this.left.slice(from, to);
    if (from >= leftLen) return this.right.slice(from - leftLen, to - leftLen);
    return this.left.slice(from, leftLen).append(this.right.slice(0, to - leftLen));
  }

  override leafAppend(other: Leaf<T>) {
    const inner = this.right.leafAppend(other);
    if (inner) return new Append(this.left, inner);
  }

  override leafPrepend(other: Leaf<T>) {
    const inner = this.left.leafPrepend(other);
    if (inner) return new Append(inner, this.right);
  }

  override appendInner(other: Leaf<T>) {
    if (this.left.depth >= Math.max(this.right.depth, other.depth) + 1)
      return new Append(this.left, new Append(this.right, other));
    return new Append(this, other);
  }
}
