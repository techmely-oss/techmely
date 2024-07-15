import { $ } from "execa";

export async function getCurrentGitBranch() {
  return await $`git rev-parse --abbrev-ref HEAD`;
}
