import path from "path";
import { fileURLToPath } from "url";
import type { AliasOptions } from "vite";
import { defineConfig } from "vitest/config";

const r = (p: string) => path.resolve(path.dirname(fileURLToPath(import.meta.url)), p);

export const alias: AliasOptions = {
  "@techmely/types": r("./packages/types/src/"),
  "@techmely/utils": r("./packages/utils/src/"),
  "@techmely/domain-driven": r("./packages/domain-driven/src/"),
};

export default defineConfig({
  resolve: {
    alias,
  },
  test: {
    globals: true,
    setupFiles: ["./packages/utils/vitest-setup.ts"],
    environment: "happy-dom",
    coverage: {
      reporter: ["lcovonly"],
    },
    include: ["packages/**/**/**/*.test.?(m)ts?(x)"],
    exclude: ["node_modules", "packages/**/node_modules", "packages/**/dist"],
  },
});
