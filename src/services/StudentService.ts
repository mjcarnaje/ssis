import {
  ICollege,
  ICourse,
  IStudent,
  IStudentWithCollegeCourse,
} from "../types";
import { saveImage } from "../utils/saveImage";
import { DataStorageService } from "./DataStorageService";

class StudentService {
  dsService: DataStorageService;

  constructor(dsService: DataStorageService) {
    this.dsService = dsService;
  }

  checkCanAddStudent = async (
    _: Electron.IpcMainInvokeEvent
  ): Promise<boolean> => {
    const colleges = this.dsService.getDbFileContent<ICollege>("colleges");
    const courses = this.dsService.getDbFileContent<ICourse>("courses");
    return colleges.length > 0 && courses.length > 0;
  };

  getStudents = async (_: Electron.IpcMainInvokeEvent): Promise<IStudent[]> => {
    console.log("GET: students test");
    console.log("TYpe" + typeof this.dsService);
    console.log("GET: students");
    return this.dsService.getDbFileContent<IStudent>("students");
  };

  getStudent = async (
    _: Electron.IpcMainInvokeEvent,
    id: string
  ): Promise<IStudentWithCollegeCourse> => {
    console.log(`GET: student ${id}`);
    const students = this.dsService.getDbFileContent<IStudent>("students");
    const student = students.find((student) => student.id === id);

    if (!student) {
      throw new Error(`Student with id ${id} not found`);
    }

    const colleges = this.dsService.getDbFileContent<ICollege>("colleges");
    const courses = this.dsService.getDbFileContent<ICourse>("courses");

    const college = colleges.find(
      (college) => college.id === student.collegeId
    );
    const course = courses.find((course) => course.id === student.courseId);

    if (!college) {
      throw new Error(`College with id ${student.collegeId} not found`);
    }

    if (!course) {
      throw new Error(`Course with id ${student.courseId} not found`);
    }

    return {
      ...student,
      college,
      course,
    };
  };

  addStudent = async (
    _: Electron.IpcMainInvokeEvent,
    student: IStudent
  ): Promise<IStudent> => {
    console.log(`POST: Add student ${student.studentId}`);

    const students = this.dsService.getDbFileContent<IStudent>("students");
    const existingStudent = students.find(
      (existingStudent) => existingStudent.studentId === student.studentId
    );

    if (existingStudent) {
      throw new Error(`Student with id ${student.studentId} already exists`);
    }

    this.dsService.createSubDirectoryStorage(student.id);
    await saveImage(student, null, "photo");
    this.dsService.appendDataToDbFile("students", student);

    return student;
  };

  updateStudent = async (
    _: Electron.IpcMainInvokeEvent,
    student: IStudent
  ): Promise<IStudent> => {
    console.log(`PUT: Update student ${student.studentId}`);

    const students = this.dsService.getDbFileContent<IStudent>("students");
    console.log({ students });
    const existingStudentIndex = students.findIndex(
      (existingStudent) => existingStudent.id === student.id
    );

    if (existingStudentIndex === -1) {
      throw new Error(`Student with id ${student.studentId} does not exist`);
    }

    const updatedStudents = [...students];

    await saveImage(student, students[existingStudentIndex], "photo");

    updatedStudents[existingStudentIndex] = student;

    this.dsService.updateDbFile("students", updatedStudents);

    return student;
  };

  deleteStudent = async (
    _: Electron.IpcMainInvokeEvent,
    id: string
  ): Promise<IStudent> => {
    console.log(`DELETE: Delete student ${id}`);

    const students = this.dsService.getDbFileContent<IStudent>("students");
    const existingStudent = students.find(
      (existingStudent) => existingStudent.id === id
    );

    if (!existingStudent) {
      throw new Error(`Student with id ${id} does not exist`);
    }

    const filteredStudents = students.filter(
      (existingStudent) => existingStudent.id !== id
    );

    this.dsService.updateDbFile("students", filteredStudents);

    await this.dsService.deleteSubDirectoryStorage(id);

    return existingStudent;
  };
}

export { StudentService };
