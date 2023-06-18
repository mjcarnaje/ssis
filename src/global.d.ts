import {
  ICollege,
  ICourse,
  ICollegeWithCourses,
  IStudent,
  IStudentWithCollegeCourse,
} from "./types";

export interface IStudentApiClient {
  create: (student: IStudent) => Promise<IStudent>;
  get: (id: string) => Promise<IStudentWithCollegeCourse>;
  getAll: () => Promise<IStudent[]>;
  update: (student: IStudent) => Promise<IStudent>;
  delete: (id: string) => Promise<IStudent>;
  checkCanAnd: () => Promise<boolean>;
}

export interface ICollegeApiClient {
  create: (college: ICollege) => Promise<ICollege>;
  getAll: () => Promise<ICollege[]>;
  update: (college: ICollege) => Promise<ICollege>;
  delete: (id: string) => Promise<ICollege>;
  getAllCourses: () => Promise<ICourse[]>;
  getAllAndItsCourses: () => Promise<ICollegeWithCourses[]>;
}

export interface ICourseApiClient {
  create: (course: ICourse) => Promise<ICourse>;
  getAll: () => Promise<ICourse[]>;
  update: (course: ICourse) => Promise<ICourse>;
  delete: (id: string) => Promise<ICourse>;
}

declare global {
  interface Window {
    studentApiClient: IStudentApiClient;
    collegeApiClient: ICollegeApiClient;
    courseApiClient: ICourseApiClient;
  }
}
