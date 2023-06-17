export const dbFileNames = {
  students: "students.txt",
  colleges: "colleges.txt",
  departments: "departments.txt",
};

export type DbFileName = keyof typeof dbFileNames;
