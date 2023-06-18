import { ICollege, ICourse, IStudent } from "../types";
import { saveImage } from "../utils/saveImage";
import { DataStorageService } from "./DataStorageService";

class CollegeService {
  dsService: DataStorageService;

  constructor(dsService: DataStorageService) {
    this.dsService = dsService;
  }

  getColleges = async (_: Electron.IpcMainInvokeEvent): Promise<ICollege[]> => {
    console.log("GET: colleges");
    return this.dsService.getDbFileContent<ICollege>("colleges");
  };

  getCollegeCourses = async (
    _: Electron.IpcMainInvokeEvent,
    collegeId: string
  ): Promise<ICourse[]> => {
    console.log(`GET: college courses ${collegeId}`);
    const courses = this.dsService.getDbFileContent<ICourse>("courses");
    return courses.filter((course) => course.collegeId === collegeId);
  };

  getCollegesWithCourses = async (
    _: Electron.IpcMainInvokeEvent
  ): Promise<ICollege[]> => {
    console.log("GET: colleges and its courses");
    const colleges = this.dsService.getDbFileContent<ICollege>("colleges");
    const courses = this.dsService.getDbFileContent<ICourse>("courses");

    return colleges.map((college) => ({
      ...college,
      courses: courses.filter((course) => course.collegeId === college.id),
    }));
  };

  addCollege = async (_: Electron.IpcMainInvokeEvent, college: ICollege) => {
    console.log(`POST: Add college ${college.name}`);

    const colleges = this.dsService.getDbFileContent<ICollege>("colleges");
    const existingCollege = colleges.find(
      (existingCollege) => existingCollege.name === college.name
    );

    if (existingCollege) {
      throw new Error(`College with name ${college.name} already exists`);
    }

    this.dsService.createSubDirectoryStorage(college.id);
    await saveImage(college, null, "logo");
    this.dsService.appendDataToDbFile("colleges", college);

    return college;
  };

  updateCollege = async (
    _: Electron.IpcMainInvokeEvent,
    college: ICollege
  ): Promise<ICollege> => {
    console.log(`PUT: Update college ${college.name}`);

    const colleges = this.dsService.getDbFileContent<ICollege>("colleges");
    const existingCollegeIndex = colleges.findIndex(
      (existingCollege) => existingCollege.id === college.id
    );

    if (existingCollegeIndex === -1) {
      throw new Error(`College with id ${college.id} does not exist`);
    }

    await saveImage(college, colleges[existingCollegeIndex], "logo");

    const updatedColleges = [...colleges];
    updatedColleges[existingCollegeIndex] = college;

    this.dsService.updateDbFile("colleges", updatedColleges);

    return college;
  };

  deleteCollege = async (
    _: Electron.IpcMainInvokeEvent,
    id: string
  ): Promise<ICollege> => {
    console.log(`DELETE: Delete college ${id}`);

    const colleges = this.dsService.getDbFileContent<ICollege>("colleges");
    const existingCollege = colleges.find((college) => college.id === id);

    if (!existingCollege) {
      throw new Error(`College with ID ${id} does not exist`);
    }

    const courses = this.dsService.getDbFileContent<ICourse>("courses");
    const hasCourses = courses.some((course) => course.collegeId === id);

    if (hasCourses) {
      throw new Error(
        `Cannot delete college ${existingCollege.name}. It has associated courses.`
      );
    }

    const students = this.dsService.getDbFileContent<IStudent>("students");
    const hasStudents = students.some((student) => student.collegeId === id);

    if (hasStudents) {
      throw new Error(
        `Cannot delete college ${existingCollege.name}. It has associated students.`
      );
    }

    const filteredColleges = colleges.filter((college) => college.id !== id);

    this.dsService.updateDbFile("colleges", filteredColleges);
    await this.dsService.deleteSubDirectoryStorage(id);

    return existingCollege;
  };
}

export { CollegeService };
