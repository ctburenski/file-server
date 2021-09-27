import fs from "fs";
import FileType from "file-type";
import fsPromises from "fs/promises";
import path from "path";

const { createHash } = await import("crypto");

export class userDirManager {
  // #fileHashes;
  constructor(dir) {
    this.dir = dir;
    this.files = [];
    this.fileHashes = new Set();
  }

  async init() {
    const files = fs.readdirSync(this.dir, "utf8");
    for (const file of files) {
      this.files.push({
        fileName: file,
        fileDate: fs.statSync(path.join(this.dir, file)).mtimeMs,
        fileType: this.#validateFileExt(file),
        fileMime: (await FileType.fromFile(path.join(this.dir, file))).mime,
      });
      this.fileHashes.add(file.split("-", 1)[0]);
    }
    this.files.sort((a, b) => b.fileDate - a.fileDate);
  }

  async createFile(unsafeName, unsafeBuffer) {
    const name = this.#validateFileName(unsafeName);
    const { ext, mime } = await this.#validateFileContent(unsafeBuffer);

    if (name && ext && this.#validateFileExt(name)) {
      await fsPromises.writeFile(path.join(this.dir, name), unsafeBuffer);
      let now = new Date();
      this.files.unshift({
        fileName: name,
        fileDate: now.valueOf(),
        fileType: this.#validateFileExt(name),
        fileMime: mime,
      });
      return true;
    } else {
      console.error("Couldn't create file", name, ext, mime);
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
      .replaceAll(/(jpeg$)|(jpg$)|(jpe$)/g, "jpg")
      .replaceAll(/[' '_]/g, "-")
      .replaceAll(/[^a-zA-Z0-9-\.]/g, "");

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

  #validateFileExt(name) {
    if (["mp4", "mov", "mp3"].find((ext) => name.endsWith(`.${ext}`))) {
      return "video";
    } else if (["png", "gif", "jpg"].find((ext) => name.endsWith(`.${ext}`))) {
      return "image";
    } else {
      return null;
    }
  }

  async #validateFileContent(buffer) {
    const result = await FileType.fromBuffer(buffer);
    return result || { ext: null, mime: null };
  }
}
