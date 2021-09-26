import fs from "fs";
import fsPromises from "fs/promises";
import path from "path";

const { createHash } = await import("crypto");

export class userDirManager {
  #fileHashes;
  constructor(dir) {
    this.dir = dir;
    this.files = [];
    this.fileHashes = new Set();

    const files = fs.readdirSync(dir, "utf8");
    for (const file of files) {
      this.files.push(file);
      this.fileHashes.add(file.split("-", 1)[0]);
    }
  }

  async createFile(unsafeName, unsafeBuffer) {
    const name = this.#validateFileName(unsafeName);
    const type = this.#validateFileType(unsafeBuffer);

    if (name && type) {
      const fileName = `${name}`;
      await fsPromises.writeFile(path.join(this.dir, fileName), unsafeBuffer);
      this.files.push(fileName);
      return true;
    } else {
      return false;
    }
  }

  /**
   * Creates a url and unix safe filename
   * @param {string} unsafeName
   * @returns
   */
  #validateFileName(unsafeName) {
    const safeName = unsafeName
      .replace(/[' ']/, "-")
      .replace(/[^a-zA-Z0-9-\.]/, "");

    let hashString = createHash("md5").update(safeName).digest("hex");
    for (let i = 0; !hashString in this.fileHashes; i++) {
      hashString = createHash("md5")
        .update(safeName)
        .update(i.toString("16"))
        .digest("hex");
    }
    this.fileHashes.add(hashString);

    return `${hashString}-${safeName}`;
  }

  #validateFileType(buffer) {
    return true;
  }
}
