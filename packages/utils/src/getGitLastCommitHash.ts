import { $ } from "execa";

export async function getLastGitCommitHash() {
  const commitHash = await $`git rev-parse --short HEAD`;
  return commitHash;
}
