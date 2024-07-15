const lazyImportCache = new Map();

/**
 * You can use this like this const importUaParser = createCachedImport('ua-parser-js', () => import('ua-parser-js'))
 */
export function createCachedImport<T>(name: string, imp: () => Promise<T>): () => T | Promise<T> {
  return () => {
    const cached = lazyImportCache.get(name);
    if (cached) return cached;

    const promise = imp().then((module) => {
      lazyImportCache.set(name, module);
      return module;
    });
    lazyImportCache.set(name, promise);
    return promise;
  };
}
