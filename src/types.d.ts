export interface IStudent {
  id: string;
  studentId: string;
  firstName: string;
  lastName: string;
  gender: "Male" | "Female" | "Other";
  birthday: string;
  photo: string;
  collegeId: string;
  courseId: string;
  year: string;
}

export interface ICollege {
  id: string;
  name: string;
  abbreviation: string;
  logo: string;
}

export interface ICourse {
  id: string;
  name: string;
  abbreviation: string;
  description: string;
  collegeId: string;
}

export interface ICollegeWithCourses extends ICollege {
  courses: ICourse[];
}

export interface IStudentWithCollegeCourse extends IStudent {
  college: ICollege;
  course: ICourse;
}
