import { type EnvObject, envShims } from "./env";

export interface Process extends Partial<Omit<typeof globalThis.process, "versions">> {
  env: EnvObject;
  versions: Record<string, string>;
}

const _process = (globalThis.process || Object.create(null)) as unknown as Process;

const processShims: Partial<Process> = {
  versions: {},
};

export const globProcess = new Proxy<Process>(_process, {
  get(target, prop: keyof Process) {
    if (prop === "env") {
      return envShims();
    }
    if (prop in target) {
      return target[prop];
    }
    if (prop in processShims) {
      return processShims[prop];
    }
  },
});
