import fs from "node:fs";

/**
 * @description Use instead of fs.existsSync(filename)
 * if we don't have read permission on a directory, existsSync() still
 * works and will result in massively slow subsequent checks (which are
 * unnecessary in the first place)
 * @param {string} filename
 * @returns {boolean}
 */
export function isFileReadable(filename: string): boolean {
  try {
    fs.accessSync(filename, fs.constants.R_OK);
    return true;
  } catch {
    return false;
  }
}
