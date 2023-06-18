export const dbFileNames = {
  students: "students.txt",
  colleges: "colleges.txt",
  courses: "courses.txt",
};

export type DbFileName = keyof typeof dbFileNames;
