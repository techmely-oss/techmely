import { getGitTags } from "./getGitTags";

export async function getLastGitTag(delta = 0) {
  const tags = await getGitTags();
  return tags[tags.length + delta - 1];
}
