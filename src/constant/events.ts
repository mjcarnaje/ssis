export enum StudentEvent {
  AddStudent = "ADD_STUDENT",
  DeleteStudent = "DELETE_STUDENT",
  UpdateStudent = "UPDATE_STUDENT",
  GetStudents = "GET_STUDENTS",
  GetStudent = "GET_STUDENT",
  CheckCanAdd = "CHECK_CAN_ADD",
}

export enum CollegeEvent {
  AddCollege = "ADD_COLLEGE",
  DeleteCollege = "DELETE_COLLEGE",
  UpdateCollege = "UPDATE_COLLEGE",
  GetColleges = "GET_COLLEGES",
  GetCollegeCourses = "GET_COLLEGE_COURSES",
  GetCollegeWithCourses = "GET_COLLEGES_AND_ITS_COURSES",
}

export enum CourseEvent {
  AddCourse = "ADD_COURSE",
  DeleteCourse = "DELETE_COURSE",
  UpdateCourse = "UPDATE_COURSE",
  GetCourses = "GET_COURSES",
}
