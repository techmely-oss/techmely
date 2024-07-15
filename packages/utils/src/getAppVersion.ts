import { findLastIndex } from "./findLastIndex";
import { getGitTags } from "./getGitTags";

export async function getAppVersion(pkgName: string) {
  const tags = await getGitTags();
  const tag = findLastIndex(tags, (tag) => tag.startsWith(pkgName));
  if (tag === -1) {
    throw new Error("Your app(s) doesnt have any tag");
  }
  const version = tags[tag].split("@")[1];

  return version;
}
