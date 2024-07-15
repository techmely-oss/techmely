import type { Options } from "tsup";

const now = new Date();

export const TECHMELY_BANNER = (packageName: string) => `
/*!
 * ${packageName}
 * Copyright(c) 2021-${now.getFullYear()} Techmely <techmely.creation@gmail.com>
 * MIT Licensed
 */
`;

type BuildOptions = {
  externalDeps?: string[];
  tsupOptions?: Partial<Options>;
  packageName?: string;
};

export function getTsupOptions(pkg?: any, buildOptions?: BuildOptions): Options {
  let external = [
    ...Object.keys(pkg?.peerDependencies ?? {}),
    ...Object.keys(pkg?.devDependencies ?? {}),
  ];
  if (buildOptions?.externalDeps) {
    external = [...external, ...buildOptions.externalDeps];
  }

  const options: Options = {
    entryPoints: ["src/index.ts"],
    format: ["cjs", "esm"],
    external,
    clean: true,
    ignoreWatch: ["**/{node_modules}/**", "dist", "src/**/*.test.ts"],
    banner: {
      js: TECHMELY_BANNER(buildOptions?.packageName || pkg?.name || "open-sources"),
    },
    ...buildOptions?.tsupOptions,
  };
  return options;
}
