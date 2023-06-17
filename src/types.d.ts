export interface IStudent {
  id: string;
  studentId: string;
  firstName: string;
  lastName: string;
  gender: "Male" | "Female" | "Other";
  birthday: string;
  photo: string;
  collegeId: string;
  departmentId: string;
  year: string;
}
