import path from "node:path";
import { getDataPath } from "./getDataPath";

export async function findNearestFile<T>(
  fileName: string,
  directoryPath: string = path.resolve(),
): Promise<{ path: string; data: T }> {
  try {
    const data = await getDataPath<T>(directoryPath, fileName);
    return data;
  } catch (error) {
    const parentDirectoryPath = path.dirname(directoryPath);
    if (parentDirectoryPath === directoryPath) {
      throw new Error(`No ${fileName} files found`);
    }
    return findNearestFile(parentDirectoryPath, fileName);
  }
}
