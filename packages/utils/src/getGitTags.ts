import { $ } from "execa";

export async function getGitTags() {
  const tags = await $`git --no-pager tag -l --sort=creatordate`;
  return String(tags).split("\n");
}
