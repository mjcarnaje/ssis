import { contextBridge, ipcRenderer } from "electron";
import { StudentEvent } from "./constant/events";
import { IStudent } from "./types";

contextBridge.exposeInMainWorld("studentApiClient", {
  create: (student: IStudent) => {
    return ipcRenderer.invoke(StudentEvent.AddStudent, student);
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
});
