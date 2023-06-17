import { IStudent } from "./types";

export interface IStudentApiClient {
  create: (student: IStudent) => Promise<IStudent>;
  getAll: () => Promise<IStudent[]>;
  update: (student: IStudent) => Promise<IStudent>;
  delete: (id: string) => Promise<IStudent>;
}

declare global {
  interface Window {
    studentApiClient: IStudentApiClient;
  }
}
