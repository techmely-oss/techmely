import { defineConfig } from "tsup";
import pkg from "./package.json";
import { getTsupOptions } from "./src/config";

const universalOptions = getTsupOptions(pkg, {
  tsupOptions: {
    format: ["esm"],
    entry: [
      "src/index.ts",
      "src/id.ts",
      "src/copyDir.ts",
      "src/emptyDir.ts",
      "src/findNearestFile.ts",
      "src/getDataPath.ts",
      "src/isFileReadable.ts",
      "src/isStream/index.ts",
      "src/readFile/index.ts",
      "src/getAppVersion.ts",
      "src/getCurrentGitBranch.ts",
      "src/getGitLastCommitHash.ts",
      "src/getGitTags.ts",
      "src/getLastGitTags.ts",
      "src/mergeStreams.ts",
      "src/writeFile.ts",
    ],
    tsconfig: "tsconfig.build.json",
  },
});

export default defineConfig([universalOptions]);
