import { app, BrowserWindow, ipcMain } from "electron";
import { CollegeEvent, CourseEvent, StudentEvent } from "./constant/events";
import { CollegeService } from "./services/CollegeService";
import { CourseService } from "./services/CourseService";
import { DataStorageService } from "./services/DataStorageService";
import { StudentService } from "./services/StudentService";
import path from "path";

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
    icon: path.join(
      __dirname,
      "../assets/icons/Square44x44Logo.targetsize-256.png"
    ),
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
      webSecurity: false,
    },
  });

  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);
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
  const dsService = new DataStorageService();
  const sService = new StudentService(dsService);
  const cService = new CollegeService(dsService);
  const crService = new CourseService(dsService);

  dsService.createDbTextFiles();
  dsService.createStorageDirectory();
  ipcMain.handle(StudentEvent.CheckCanAdd, sService.checkCanAddStudent);
  ipcMain.handle(StudentEvent.GetStudents, sService.getStudents);
  ipcMain.handle(StudentEvent.GetStudent, sService.getStudent);
  ipcMain.handle(StudentEvent.AddStudent, sService.addStudent);
  ipcMain.handle(StudentEvent.UpdateStudent, sService.updateStudent);
  ipcMain.handle(StudentEvent.DeleteStudent, sService.deleteStudent);
  ipcMain.handle(CollegeEvent.GetColleges, cService.getColleges);
  ipcMain.handle(
    CollegeEvent.GetCollegeWithCourses,
    cService.getCollegesWithCourses
  );
  ipcMain.handle(CollegeEvent.GetCollegeCourses, cService.getCollegeCourses);
  ipcMain.handle(CollegeEvent.AddCollege, cService.addCollege);
  ipcMain.handle(CollegeEvent.UpdateCollege, cService.updateCollege);
  ipcMain.handle(CollegeEvent.DeleteCollege, cService.deleteCollege);
  ipcMain.handle(CourseEvent.GetCourses, crService.getCourses);
  ipcMain.handle(CourseEvent.AddCourse, crService.addCourse);
  ipcMain.handle(CourseEvent.UpdateCourse, crService.updateCourse);
  ipcMain.handle(CourseEvent.DeleteCourse, crService.deleteCourse);
});
