const _envShim = Object.create(null);

export type EnvObject = Record<string, string | undefined>;

const _getEnv = (useShim?: boolean) =>
  globalThis.process?.env || // Node.js/Bun
  (import.meta as unknown as { env: EnvObject }).env || // Vite env
  ((globalThis as any).Deno?.env.toObject() as EnvObject) || // Deno env
  (globalThis as unknown as { __env__: EnvObject }).__env__ || // Custom env
  (useShim ? _envShim : globalThis);

export function envShims() {
  return new Proxy<EnvObject>(_envShim, {
    get(_, prop) {
      const env = _getEnv();
      return env[prop as any] ?? _envShim[prop];
    },
    has(_, prop) {
      const env = _getEnv();
      return prop in env || prop in _envShim;
    },
    set(_, prop, value) {
      const env = _getEnv(true);
      env[prop as any] = value;
      return true;
    },
    deleteProperty(_, prop) {
      if (!prop) {
        return false;
      }
      const env = _getEnv(true);
      delete env[prop as any];
      return true;
    },
    ownKeys() {
      const env = _getEnv();
      return Object.keys(env);
    },
  });
}
