import fs from "node:fs";

export function readFile(filePath: string): Promise<string> {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, "utf8", (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
}
