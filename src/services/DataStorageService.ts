import { app } from "electron";
import fs from "fs";
import { rm } from "node:fs/promises";
import path from "path";
import { DbFileName, dbFileNames } from "../constant/db";
import * as parser from "../utils/parser";

class DataStorageService {
  test() {
    console.log("test");
  }

  createDbTextFiles() {
    console.log("Creating DB text files");

    const fileNames = Object.values(dbFileNames);
    const dbDirectory = path.join(app.getPath("userData"), "db");

    console.log(`DB directory: ${dbDirectory}`);

    if (!fs.existsSync(dbDirectory)) {
      fs.mkdirSync(dbDirectory);
    }

    fileNames.forEach((fileName) => {
      const filePath = path.join(dbDirectory, fileName);
      this.createDbFile(filePath);
    });

    console.log("Finished creating DB text files");
  }

  createStorageDirectory() {
    console.log("Creating storage directory");

    const storageDirectory = path.join(app.getPath("userData"), "storage");

    console.log(`Storage directory: ${storageDirectory}`);

    if (!fs.existsSync(storageDirectory)) {
      fs.mkdirSync(storageDirectory);
    }

    console.log("Finished creating storage directory");
  }

  createSubDirectoryStorage(subDirectory: string) {
    console.log(`Creating subdirectory ${subDirectory}`);

    const storageDirectory = path.join(app.getPath("userData"), "storage");

    const subDirectoryPath = path.join(storageDirectory, subDirectory);

    if (!fs.existsSync(subDirectoryPath)) {
      fs.mkdirSync(subDirectoryPath);
    }

    console.log(`Finished creating subdirectory ${subDirectory}`);
  }

  async deleteSubDirectoryStorage(subDirectory: string) {
    console.log(`Deleting subdirectory ${subDirectory}`);

    const storageDirectory = path.join(app.getPath("userData"), "storage");
    const subDirectoryPath = path.join(storageDirectory, subDirectory);

    if (fs.existsSync(subDirectoryPath)) {
      await rm(subDirectoryPath, { recursive: true });
    }

    console.log(`Finished deleting subdirectory ${subDirectory}`);
  }

  createDbFile(filePath: string) {
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, "");
    }
  }

  getDbFilePath(fileName: DbFileName) {
    const dbDirectory = path.join(app.getPath("userData"), "db");
    const filePath = path.join(dbDirectory, dbFileNames[fileName]);
    return filePath;
  }

  getDbFileContent<T>(fileName: DbFileName): T[] {
    const filePath = this.getDbFilePath(fileName);
    const fileContent = fs.readFileSync(filePath, "utf-8");
    const split = fileContent.split("\n");
    const data = split
      .filter((line) => line !== "")
      .map((line) => parser.decode<T>(line));
    return data;
  }

  appendDataToDbFile<T>(fileName: DbFileName, data: T) {
    const encoded = parser.encode(data);
    const filePath = this.getDbFilePath(fileName);
    fs.appendFileSync(filePath, `${encoded}\n`);
  }

  updateDbFile<T>(fileName: DbFileName, data: T[]) {
    const filePath = this.getDbFilePath(fileName);
    fs.writeFileSync(filePath, "");

    data.forEach((data) => {
      this.appendDataToDbFile(fileName, data);
    });
  }
}

export { DataStorageService };
