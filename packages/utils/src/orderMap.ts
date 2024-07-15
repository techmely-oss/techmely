type OrderMapContent<T = any> = string | T;
export type MapLike<T = any> = Record<string, T> | OrderedMap<T>;

/**
 * Persistent data structure representing an ordered mapping from strings to values, with some convenient update methods.
 * Idea is we put [key, value] is a pair position in array.
 * Mean it we push [1, 2, 3, 4] to the content --> the order map will transform to {1: 2, 3: 4}
 */
export class OrderedMap<T = any> {
  content: OrderMapContent<T>[];

  private constructor(content: OrderMapContent<T>[]) {
    this.content = content;
  }

  // Return a map with the given content. If null, create an empty
  // map. If given an ordered map, return that map itself. If given an
  // object, create a map from the object's properties.
  static from<T>(value: MapLike<T>): OrderedMap<T> {
    if (value instanceof OrderedMap) return value;
    const content: OrderMapContent<T>[] = [];
    if (value) for (const prop in value) content.push(prop, value[prop]);
    return new OrderedMap(content);
  }

  /**
   * the amount of keys in this map.
   */
  get size() {
    return this.content.length >> 1;
  }

  #find(key: OrderMapContent) {
    for (let i = 0; i < this.content.length; i += 2) if (this.content[i] === key) return i;
    return -1;
  }

  /**
   * Retrieve the value stored under `key`, or return undefined when no such key exists.
   */
  get(key: OrderMapContent) {
    const found = this.#find(key);
    return found === -1 ? undefined : this.content[found + 1];
  }

  /**
   * Create a new map by replacing the value of `key` with a new value,
   * or adding a binding to the end of the map. If `newKey` is given, the key of the binding will be replaced with that key.
   */
  update(key: string, value: T, newKey?: string): OrderedMap<T> {
    const self = newKey && newKey !== key ? this.remove(newKey) : this;
    const found = self.#find(key);
    const content = self.content.slice();
    if (found === -1) {
      content.push(newKey || key, value);
    } else {
      content[found + 1] = value;
      if (newKey) content[found] = newKey;
    }
    return new OrderedMap(content);
  }

  /**
   * Return a map with the given key removed, if it existed.
   */
  remove(key: OrderMapContent): OrderedMap<T> {
    const found = this.#find(key);
    if (found === -1) return this;
    const content = this.content.slice();
    content.splice(found, 2);
    return new OrderedMap(content);
  }

  /**
   * Add a new key to the start of the map.
   */
  addToStart(key: OrderMapContent, value: T): OrderedMap<T> {
    return new OrderedMap([key, value].concat(this.remove(key).content));
  }

  /**
   * Add a new key to the end of the map.
   */
  addToEnd(key: OrderMapContent, value: T): OrderedMap<T> {
    const content = this.remove(key).content.slice();
    content.push(key, value);
    return new OrderedMap(content);
  }

  /**
   * Add the given key/value before `place`. If `place` is not found, the new key is added to the end.
   */
  addBefore(place: string, key: OrderMapContent, value: T): OrderedMap<T> {
    const without = this.remove(key);
    const content = without.content.slice();
    const found = without.#find(place);
    content.splice(found === -1 ? content.length : found, 0, key, value);
    return new OrderedMap(content);
  }

  /**
   * Call the given function for each key/value pair in the map, in order
   */
  forEach(fn: (key: OrderMapContent, value: OrderMapContent) => any): void {
    for (let i = 0; i < this.content.length; i += 2) {
      fn(this.content[i], this.content[i + 1]);
    }
  }

  /**
   * Create a new map by prepending the keys in this map that don't appear in `map` before the keys in `map`
   */
  prepend(map: MapLike<T>): OrderedMap<T> {
    // biome-ignore lint/style/noParameterAssign: We need to mutate the map
    map = OrderedMap.from(map);
    if (!map.size) return this;
    return new OrderedMap(map.content.concat(this.subtract(map).content));
  }

  /**
   * Create a new map by appending the keys in this map that don't appear in `map` after the keys in `map`.
   */
  append(map: MapLike<T>): OrderedMap<T> {
    // biome-ignore lint/style/noParameterAssign: We need to mutate the map
    map = OrderedMap.from(map);
    if (!map.size) return this;
    return new OrderedMap(this.subtract(map).content.concat(map.content));
  }

  /**
   * Create a map containing all the keys in this map that don't appear in `map`
   */
  subtract(map: MapLike<T>): OrderedMap<T> {
    let instance = this as OrderedMap<T>;
    // biome-ignore lint/style/noParameterAssign: We need to mutate the map
    map = OrderedMap.from(map);
    for (let i = 0; i < map.content.length; i += 2) {
      instance = instance.remove(map.content[i]);
    }
    return instance;
  }

  /**
   * Turn ordered map into a plain object.
   */
  toObject(): Record<string, T> {
    const result = {};
    this.forEach((key, value) => {
      result[key] = value;
    });
    return result;
  }
}
