import { ICourse, IStudent } from "../types";
import { DataStorageService } from "./DataStorageService";

class CourseService {
  dsService: DataStorageService;

  constructor(dsService: DataStorageService) {
    this.dsService = dsService;
  }

  getCourses = async (_: Electron.IpcMainInvokeEvent): Promise<ICourse[]> => {
    console.log("GET: courses");
    return this.dsService.getDbFileContent<ICourse>("courses");
  };

  addCourse = async (_: Electron.IpcMainInvokeEvent, course: ICourse) => {
    console.log(`POST: Add course ${course.name}`);

    const courses = this.dsService.getDbFileContent<ICourse>("courses");
    const existingCourse = courses.find(
      (existingCourse) => existingCourse.name === course.name
    );

    if (existingCourse) {
      throw new Error(`Course with name ${course.name} already exists`);
    }

    this.dsService.appendDataToDbFile("courses", course);

    return course;
  };

  updateCourse = async (
    _: Electron.IpcMainInvokeEvent,
    course: ICourse
  ): Promise<ICourse> => {
    console.log(`PUT: Update course ${course.name}`);

    const courses = this.dsService.getDbFileContent<ICourse>("courses");
    const existingCourseIndex = courses.findIndex(
      (existingCourse) => existingCourse.id === course.id
    );

    if (existingCourseIndex === -1) {
      throw new Error(`Course with id ${course.id} does not exist`);
    }

    const updatedCourses = [...courses];
    updatedCourses[existingCourseIndex] = course;

    this.dsService.updateDbFile("courses", updatedCourses);

    return course;
  };

  deleteCourse = async (
    _: Electron.IpcMainInvokeEvent,
    id: string
  ): Promise<ICourse> => {
    console.log(`DELETE: Delete course ${id}`);

    const courses = this.dsService.getDbFileContent<ICourse>("courses");
    const existingCourse = courses.find((course) => course.id === id);

    if (!existingCourse) {
      throw new Error(`Course with ID ${id} does not exist`);
    }

    const students = this.dsService.getDbFileContent<IStudent>("students");
    const hasStudents = students.some((student) => student.courseId === id);

    if (hasStudents) {
      throw new Error(
        `Cannot delete course ${existingCourse.name} because it has students associated with it`
      );
    }

    const filteredCourses = courses.filter((course) => course.id !== id);

    this.dsService.updateDbFile("courses", filteredCourses);

    return existingCourse;
  };
}

export { CourseService };
