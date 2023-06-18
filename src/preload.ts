import { contextBridge, ipcRenderer } from "electron";
import { CollegeEvent, CourseEvent, StudentEvent } from "./constant/events";
import { ICollege, IStudent, ICourse } from "./types";

contextBridge.exposeInMainWorld("studentApiClient", {
  create: (student: IStudent) => {
    return ipcRenderer.invoke(StudentEvent.AddStudent, student);
  },
  get: (id: string) => {
    return ipcRenderer.invoke(StudentEvent.GetStudent, id);
  },
  getAll: () => {
    return ipcRenderer.invoke(StudentEvent.GetStudents);
  },
  update: (student: IStudent) => {
    return ipcRenderer.invoke(StudentEvent.UpdateStudent, student);
  },
  delete: (id: string) => {
    return ipcRenderer.invoke(StudentEvent.DeleteStudent, id);
  },
  checkCanAnd: () => {
    return ipcRenderer.invoke(StudentEvent.CheckCanAdd);
  },
});

contextBridge.exposeInMainWorld("collegeApiClient", {
  create: (college: ICollege) => {
    return ipcRenderer.invoke(CollegeEvent.AddCollege, college);
  },
  getAll: () => {
    return ipcRenderer.invoke(CollegeEvent.GetColleges);
  },
  update: (college: ICollege) => {
    return ipcRenderer.invoke(CollegeEvent.UpdateCollege, college);
  },
  delete: (id: string) => {
    return ipcRenderer.invoke(CollegeEvent.DeleteCollege, id);
  },
  getAllAndItsCourses: () => {
    return ipcRenderer.invoke(CollegeEvent.GetCollegeWithCourses);
  },
});

contextBridge.exposeInMainWorld("courseApiClient", {
  create: (course: ICourse) => {
    return ipcRenderer.invoke(CourseEvent.AddCourse, course);
  },
  getAll: () => {
    return ipcRenderer.invoke(CourseEvent.GetCourses);
  },
  update: (course: ICourse) => {
    return ipcRenderer.invoke(CourseEvent.UpdateCourse, course);
  },
  delete: (id: string) => {
    return ipcRenderer.invoke(CourseEvent.DeleteCourse, id);
  },
});
