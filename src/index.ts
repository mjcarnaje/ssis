import { app, BrowserWindow, ipcMain } from "electron";
import fs from "fs";
import path from "path";
import { DbFileName, dbFileNames } from "./constant/db";
import { StudentEvent } from "./constant/events";
import { IStudent } from "./types";
import * as parser from "./utils/parser";

declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
  app.quit();
}

const createWindow = (): void => {
  const mainWindow = new BrowserWindow({
    height: 600,
    width: 800,
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
      webSecurity: false,
    },
  });

  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  mainWindow.webContents.openDevTools();
};

app.on("ready", createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

app.whenReady().then(() => {
  logDir();
  createDbTextFiles();
  createStorageDirectory();
  ipcMain.handle(StudentEvent.AddStudent, onAddStudent);
  ipcMain.handle(StudentEvent.GetStudents, onGetStudents);
  ipcMain.handle(StudentEvent.DeleteStudent, onDeleteStudent);
  ipcMain.handle(StudentEvent.UpdateStudent, onUpdateStudent);
});

function logDir() {
  console.log(`App path: ${app.getPath("userData")}`);
}

function createDbTextFiles() {
  console.log("Creating DB text files");

  const fileNames = Object.values(dbFileNames);
  const dbDirectory = path.join(app.getPath("userData"), "db");

  console.log(`DB directory: ${dbDirectory}`);

  if (!fs.existsSync(dbDirectory)) {
    fs.mkdirSync(dbDirectory);
  }

  fileNames.forEach((fileName) => {
    const filePath = path.join(dbDirectory, fileName);
    createDbFile(filePath);
  });

  console.log("Finished creating DB text files");
}

function createStorageDirectory() {
  console.log("Creating storage directory");

  const storageDirectory = path.join(app.getPath("userData"), "storage");

  console.log(`Storage directory: ${storageDirectory}`);

  if (!fs.existsSync(storageDirectory)) {
    fs.mkdirSync(storageDirectory);
  }

  console.log("Finished creating storage directory");
}

function createSubDirectoryStorage(subDirectory: string) {
  console.log(`Creating subdirectory ${subDirectory}`);

  const storageDirectory = path.join(app.getPath("userData"), "storage");

  const subDirectoryPath = path.join(storageDirectory, subDirectory);

  if (!fs.existsSync(subDirectoryPath)) {
    fs.mkdirSync(subDirectoryPath);
  }

  console.log(`Finished creating subdirectory ${subDirectory}`);
}

function deleteSubDirectoryStorage(subDirectory: string) {
  console.log(`Deleting subdirectory ${subDirectory}`);

  const storageDirectory = path.join(app.getPath("userData"), "storage");
  const subDirectoryPath = path.join(storageDirectory, subDirectory);

  if (fs.existsSync(subDirectoryPath)) {
    fs.rmdirSync(subDirectoryPath);
  }

  console.log(`Finished deleting subdirectory ${subDirectory}`);
}

function createDbFile(filePath: string) {
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, "");
  }
}

function getDbFilePath(fileName: DbFileName): string {
  const dbDirectory = path.join(app.getPath("userData"), "db");
  const filePath = path.join(dbDirectory, dbFileNames[fileName]);
  return filePath;
}

function getDbFileContent<T>(fileName: DbFileName): T[] {
  const filePath = getDbFilePath(fileName);
  const fileContent: string = fs.readFileSync(filePath, "utf-8");
  const split = fileContent.split("\n");
  const data = split
    .filter((line) => line !== "")
    .map((line) => parser.decode<T>(line));
  console.log(`Data Length: ${data.length}`);
  return data;
}

function appendStudentToDbFile(student: IStudent) {
  const encoded = parser.endcode(student);
  const filePath = getDbFilePath("students");
  fs.appendFileSync(filePath, `${encoded}\n`);
}

function updateDbFile(students: IStudent[]) {
  const filePath = getDbFilePath("students");
  fs.writeFileSync(filePath, "");

  students.forEach((student) => {
    appendStudentToDbFile(student);
  });
}

function saveStudentImage(student: IStudent): Promise<IStudent> {
  return new Promise((resolve, reject) => {
    if (student.photo) {
      const storageDirectory = path.join(app.getPath("userData"), "storage");
      const subDirectoryPath = path.join(storageDirectory, student.id);
      const photoPath = path.join(subDirectoryPath, "photo.jpg");

      fs.copyFile(student.photo, photoPath, (err) => {
        if (err) reject(err);
        student.photo = photoPath;
        resolve(student);
      });
    } else {
      resolve(student);
    }
  });
}

async function onAddStudent(_: Electron.IpcMainInvokeEvent, student: IStudent) {
  console.log(`POST: Add student ${student.studentId}`);

  const students = getDbFileContent<IStudent>("students");
  const existingStudent = students.find(
    (existingStudent) => existingStudent.studentId === student.studentId
  );

  if (existingStudent) {
    throw new Error(`Student with id ${student.studentId} already exists`);
  }

  createSubDirectoryStorage(student.id);
  await saveStudentImage(student);
  appendStudentToDbFile(student);

  return student;
}

function onDeleteStudent(_: Electron.IpcMainInvokeEvent, id: string): IStudent {
  console.log(`DELETE: Delete student ${id}`);

  const students = getDbFileContent<IStudent>("students");
  const existingStudent = students.find(
    (existingStudent) => existingStudent.id === id
  );

  if (!existingStudent) {
    throw new Error(`Student with id ${id} does not exist`);
  }

  const filteredStudents = students.filter(
    (existingStudent) => existingStudent.id !== id
  );

  updateDbFile(filteredStudents);

  deleteSubDirectoryStorage(id);

  return existingStudent;
}

function onUpdateStudent(
  _: Electron.IpcMainInvokeEvent,
  student: IStudent
): IStudent {
  console.log(`PUT: Update student ${student.studentId}`);

  const students = getDbFileContent<IStudent>("students");
  console.log({ students });
  const existingStudentIndex = students.findIndex(
    (existingStudent) => existingStudent.id === student.id
  );

  if (existingStudentIndex === -1) {
    throw new Error(`Student with id ${student.studentId} does not exist`);
  }

  const updatedStudents = [...students];
  updatedStudents[existingStudentIndex] = student;

  updateDbFile(updatedStudents);

  return student;
}

function onGetStudents(_: Electron.IpcMainInvokeEvent): IStudent[] {
  console.log("GET: students");
  return getDbFileContent<IStudent>("students");
}
