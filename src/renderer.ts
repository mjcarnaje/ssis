import "./index.css";
import {
  ICollege,
  ICollegeWithCourses,
  ICourse,
  IStudent,
  IStudentWithCollegeCourse,
} from "./types";
import { genId } from "./utils/id";

function getElement<T extends HTMLElement = HTMLDivElement>(
  selector: string
): T {
  return document.querySelector(selector) as T;
}

function getYears(from: number, to: number): number[] {
  const years: number[] = [];
  for (let i = from; i <= to; i++) {
    years.push(i);
  }
  return years;
}

function getEmptyKeys(obj: Record<string, any>): [boolean, string[]] {
  const emptyKeys: string[] = [];

  Object.entries(obj).forEach(([key, value]) => {
    if (value === null || value === undefined || value === "") {
      emptyKeys.push(key);
    }
  });

  return [emptyKeys.length !== 0, emptyKeys];
}

function getInputValue(selector: string) {
  return getElement<HTMLInputElement>(selector)?.value;
}

function setInputElementValue(selector: string, value: string) {
  const inputElement = getElement<HTMLInputElement>(selector);
  if (inputElement) {
    inputElement.value = value;
  }
}

const studentList = getElement<HTMLUListElement>("#student-list");
const addStudentButton = getElement<HTMLButtonElement>("#add-student");
const collegeList = getElement<HTMLUListElement>("#college-list");
const addCollegeButton = getElement<HTMLButtonElement>("#add-college");

const modal = getElement(".modal");
const modalTitle = getElement(".modal-card-title");
const modalClose = getElement(".modal-close");
const modalContent = getElement(".modal-card-body");
const modalFooter = getElement(".modal-card-foot");

const { studentApiClient, collegeApiClient, courseApiClient } = window;

const states = {
  students: [] as IStudent[],
  colleges: [] as ICollegeWithCourses[],
  canAddStudent: false,
};

function showModal() {
  modal.classList.add("is-active");
}

function hideModal() {
  modal.classList.remove("is-active");
}

modalClose.addEventListener("click", hideModal);

async function getStudents() {
  try {
    const students = await studentApiClient.getAll();
    states.students = students;
    renderStudents();
  } catch (err) {
    console.error(err);
    showErrorModal(formatError(err));
  }
}

async function getColleges() {
  try {
    const colleges = await collegeApiClient.getAllAndItsCourses();
    states.colleges = colleges;
    renderColleges();
  } catch (err) {
    console.error(err);
    showErrorModal(formatError(err));
  }
}

async function onAddStudent(student: IStudent) {
  try {
    await studentApiClient.create(student);
    getStudents();
    hideModal();
  } catch (err) {
    console.error(err);
    showErrorModal(formatError(err));
  }
}

async function onUpdateStudent(student: IStudent) {
  try {
    await studentApiClient.update(student);
    getStudents();
    hideModal();
  } catch (err) {
    console.error(err);
    showErrorModal(formatError(err));
  }
}

async function onDeleteStudent(id: string) {
  try {
    await studentApiClient.delete(id);
    getStudents();
    hideModal();
  } catch (err) {
    console.error(err);
    showErrorModal(formatError(err));
  }
}

async function onAddCollege(college: ICollege) {
  try {
    await collegeApiClient.create(college);
    await getColleges();
    hideModal();
  } catch (err) {
    console.error(err);
    showErrorModal(formatError(err));
  }
}

async function onUpdateCollege(college: ICollege) {
  try {
    await collegeApiClient.update(college);
    await getColleges();
    hideModal();
  } catch (err) {
    console.error(err);
    showErrorModal(formatError(err));
  }
}

async function onDeleteCollege(id: string) {
  try {
    await collegeApiClient.delete(id);
    await getColleges();
    hideModal();
  } catch (err) {
    console.error(err);
    showErrorModal(formatError(err));
  }
}

async function onAddCourse(course: ICourse) {
  try {
    await courseApiClient.create(course);
    await getColleges();
    hideModal();
  } catch (err) {
    console.error(err);
    showErrorModal(formatError(err));
  }
}

async function onUpdateCourse(course: ICourse) {
  try {
    await courseApiClient.update(course);
    await getColleges();
    hideModal();
  } catch (err) {
    console.error(err);
    showErrorModal(formatError(err));
  }
}

async function onDeleteCourse(id: string) {
  try {
    await courseApiClient.delete(id);
    await getColleges();
    hideModal();
  } catch (err) {
    console.error(err);
    showErrorModal(formatError(err));
  }
}

function formatError(err: any) {
  return err.message?.split(":")?.[2]?.trim() || "Something went wrong";
}

function showErrorModal(message: string) {
  initModal({
    title: "Error",
    content: message,
    onSubmit: () => {
      hideModal();
    },
    submitText: "Close",
    submitType: "danger",
    showCancel: false,
  });
  showModal();
}

function createStudentForm() {
  return `
    <div class="field">
      <label class="label">Photo</label>
      <div class="control">
        <figure class="image is-128x128 has-background-grey-lighter is-clipped is-rounded" style="border: 1px solid #dbdbdb;">
          <img
            id="photo"
            class="is-hidden"
            style="object-fit: cover;"
          </img>
        </figure>
        <button class="button mt-4 is-info" id="uploadButton">Upload Photo</button>
        <input id="photo-input" class="is-hidden" type="file" accept="image/*" id="photoInput">
      </div>
    </div>

    <div class="field">
      <label class="label">Student ID</label>
      <div class="control">
        <input class="input" type="text" placeholder="Student ID" id="studentId">
        <input hidden type="text" id="docId">
      </div>
    </div>
    <div class="field">
      <label class="label">First Name</label>
      <div class="control">
        <input class="input" type="text" placeholder="First Name" id="firstName">
      </div>
    </div>
    <div class="field">
      <label class="label">Last Name</label>
      <div class="control">
        <input class="input" type="text" placeholder="Last Name" id="lastName">
      </div>
    </div>
    <div class="field">
      <label class="label">Birthday</label>
      <div class="control">
        <input class="input" type="date" placeholder="Birthday" id="birthday">
      </div>
    </div>
    <div class="field">
      <label class="label">College ID</label>
      <div class="control">
        <div class="select is-fullwidth">
          <select id="collegeId">
          </select>
        </div>
      </div>
    </div>
    <div class="field">
      <label class="label">Course ID</label>
      <div class="control">
        <div class="select is-fullwidth">
          <select id="courseId">
          </select>
        </div>
      </div>
    </div>
    <div class="field">
      <label class="label">
        Gender
      </label>
      <div class="control">
        <label class="radio">
          <input type="radio" name="gender" value="Male">
          Male
        </label>
        <label class="radio">
          <input type="radio" name="gender" value="Female">
          Female
        </label>
        <label class="radio">
          <input type="radio" name="gender" value="Secret">
          Secret
        </label>
      </div>
    </div>

    <div class="field">
      <label class="label">Year Started</label>
      <div class="control">
        <div class="select is-fullwidth">
          <select id="year">
          </select>
        </div>
      </div>
    </div>
  `;
}

function createEmptySelect(text: string): HTMLOptionElement {
  const option = document.createElement("option");
  option.value = "";
  option.innerText = text;
  return option;
}

function setCoursesToSelect(courses: ICourse[]) {
  const courseSelect = getElement<HTMLSelectElement>("#courseId");

  courseSelect.innerHTML = "";
  courseSelect.appendChild(createEmptySelect("Select a course"));
  courses.forEach((course) => {
    const option = document.createElement("option");
    option.value = course.id;
    option.innerText = course.name;

    courseSelect.appendChild(option);
  });
}

function setCollegesToSelect(colleges: ICollege[]) {
  const collegeSelect = getElement<HTMLSelectElement>("#collegeId");
  collegeSelect.innerHTML = "";
  collegeSelect.appendChild(createEmptySelect("Select a college"));
  colleges.forEach((college) => {
    const option = document.createElement("option");
    option.value = college.id;
    option.innerText = college.name;

    collegeSelect.appendChild(option);
  });
  setCoursesToSelect([]);

  collegeSelect.addEventListener("change", async () => {
    const collegeId = collegeSelect.value;
    const courses = states.colleges.find(
      (college) => college.id === collegeId
    ).courses;
    setCoursesToSelect(courses);
  });
}

function setYearsToSelect() {
  const yearSelect = getElement<HTMLSelectElement>("#year");
  yearSelect.innerHTML = "";
  yearSelect.appendChild(createEmptySelect("Select a year"));

  const years = getYears(1900, new Date().getFullYear()).reverse();
  years.forEach((year) => {
    const option = document.createElement("option");
    option.value = year.toString();
    option.innerText = year.toString();

    yearSelect.appendChild(option);
  });
}

function getStudentFormValues(): IStudent {
  const docId = getInputValue("#docId");
  const studentId = getInputValue("#studentId");
  const firstName = getInputValue("#firstName");
  const lastName = getInputValue("#lastName");
  const birthday = getInputValue("#birthday");
  const collegeId = getInputValue("#collegeId");
  const courseId = getInputValue("#courseId");
  const year = getInputValue("#year");
  const gender = getInputValue("input[name='gender']:checked");

  const {
    files: [file],
  } = getElement<HTMLInputElement>("#photo-input");
  const photo = file?.path || getElement<HTMLInputElement>("#photo")?.src;

  const student: IStudent = {
    id: docId || genId(),
    studentId,
    firstName,
    lastName,
    birthday,
    collegeId,
    courseId,
    photo,
    year,
    gender: gender as IStudent["gender"],
  };

  return student;
}

function setStudentFormValues(student: IStudent) {
  setInputElementValue("#docId", student.id);
  setInputElementValue("#studentId", student.studentId);
  setInputElementValue("#firstName", student.firstName);
  setInputElementValue("#lastName", student.lastName);
  setInputElementValue("#birthday", student.birthday);
  setInputElementValue("#collegeId", student.collegeId);
  setInputElementValue("#courseId", student.courseId);
  setInputElementValue("#year", student.year);

  const genderInputElement = getElement<HTMLInputElement>(
    `input[name="gender"][value="${student.gender}"]`
  );
  if (genderInputElement) {
    genderInputElement.checked = true;
  }

  const photoElement = getElement<HTMLInputElement>("#photo");
  if (photoElement) {
    photoElement.src = student.photo;
  }
}

function createCollegeForm() {
  return `
    <input hidden type="text" id="docId">

    <div class="field">
      <label class="label">Logo</label>
      <div class="control">
        <figure class="image is-128x128 has-background-grey-lighter is-clipped is-full-rounded">
          <img
            id="photo"
            class="is-hidden"
            style="object-fit: cover;"
          </img>
        </figure>
        <button class="button mt-4 is-info" id="uploadButton">Upload Logo</button>
        <input id="photo-input" class="is-hidden" type="file" accept="image/*" id="photoInput">
      </div>
    </div>

    <div class="field">
      <label class="label">Name</label>
      <div class="control">
        <input class="input" type="text" placeholder="Name" id="collegeName">
      </div>
    </div>

    <div class="field">
      <label class="label">
        Abbreviation
      </label>
      <div class="control">
        <input class="input" type="text" placeholder="College Abbreviation" id="collegeAbbr">
      </div>
    </div>
  `;
}

function getCollegeFormValues(): ICollege {
  const docId = getInputValue("#docId");
  const collegeName = getInputValue("#collegeName");
  const collegeAbbr = getInputValue("#collegeAbbr");

  const {
    files: [file],
  } = getElement<HTMLInputElement>("#photo-input");
  const logo = file?.path || getElement<HTMLInputElement>("#photo").src;

  const college: ICollege = {
    id: docId || genId(),
    name: collegeName,
    abbreviation: collegeAbbr,
    logo,
  };

  return college;
}

function setCollegeFormValues(college: ICollege) {
  setInputElementValue("#docId", college.id);
  setInputElementValue("#collegeName", college.name);
  setInputElementValue("#collegeAbbr", college.abbreviation);

  const logoElement = getElement<HTMLInputElement>("#photo");
  if (logoElement) {
    logoElement.src = college.logo;
  }
}

function createCourseForm() {
  return `
    <input hidden type="text" id="docId">
    
    <div class="field">
      <label class="label">Name</label>
      <div class="control">
        <input class="input" type="text" placeholder="Name" id="courseName">
      </div>
    </div>
    
    <div class="field">
      <label class="label">
        Abbreviation
      </label>
      <div class="control">
        <input class="input" type="text" placeholder="Course Abbreviation" id="courseAbbr">
      </div>
    </div>

    <div class="field">
      <label class="label">
        Description
      </label>
      <div class="control">
        <input class="input" type="text" placeholder="Description" id="courseDescription">
      </div>
    </div>
  `;
}

function getCourseFormValues(collegeId: string): ICourse {
  const docId = getInputValue("#docId");
  const courseName = getInputValue("#courseName");
  const courseAbbr = getInputValue("#courseAbbr");
  const courseDescription = getInputValue("#courseDescription");

  const course: ICourse = {
    id: docId || genId(),
    name: courseName,
    abbreviation: courseAbbr,
    description: courseDescription,
    collegeId,
  };

  return course;
}

function setCourseFormValues(course: ICourse) {
  setInputElementValue("#docId", course.id);
  setInputElementValue("#courseName", course.name);
  setInputElementValue("#courseAbbr", course.abbreviation);
  setInputElementValue("#courseDescription", course.description);
}

function onChangePhotoInput(e: Event) {
  // @ts-ignore
  const file = e.target["files"][0];
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => {
    const photo = reader.result as string;
    const photoElement = getElement<HTMLImageElement>("#photo");
    photoElement.src = photo;
    photoElement.classList.remove("is-hidden");
  };
}

function initModal({
  title,
  content,
  submitText,
  submitType,
  showCancel,
  onSubmit,
}: {
  title: string;
  content: string;
  submitText: string;
  submitType: "success" | "danger" | "primary" | "info";
  showCancel?: boolean;
  onSubmit: () => void | Promise<void>;
}) {
  modalTitle.textContent = title;
  modalTitle.className = "title is-3";

  modalContent.innerHTML = content;

  modalFooter.innerHTML = `
    <div class="buttons is-flex is-justify-content-end">
      <button id="submitButton" class="button is-${submitType}">${submitText}</button>
      ${
        showCancel
          ? `<button id="cancelButton" class="button">Cancel</button>`
          : ""
      }
    </div>
  `;

  const submitButton = getElement<HTMLButtonElement>("#submitButton");
  submitButton.addEventListener("click", onSubmit);

  if (showCancel) {
    const cancelButton = getElement<HTMLButtonElement>("#cancelButton");
    cancelButton.addEventListener("click", hideModal);
  }
}

function addPhotoUploadEventListeners() {
  const photoInput = getElement<HTMLInputElement>("#photo-input");
  const photoElement = getElement<HTMLImageElement>("#photo");
  photoInput.addEventListener("change", onChangePhotoInput);
  const uploadButton = getElement<HTMLButtonElement>("#uploadButton");
  uploadButton.addEventListener("click", () => {
    photoInput.click();
  });
  photoElement.classList.remove("is-hidden");
}

async function showAddStudentModal() {
  const canAddStudent = await studentApiClient.checkCanAnd();

  if (!canAddStudent) {
    initModal({
      title: "Add student",
      content: `
      <article class="message is-warning">
        <div class="message-header">
          <p>
           You can't add a student yet.
          </p>
        </div>
        <div class="message-body">
         You must have atleast one valid college where it has at least one course.
        </div>
      </article>`,
      onSubmit: () => {
        if (states.colleges.length === 0) {
          showAddCollegeModal();
        } else {
          hideModal();
        }
      },
      submitText: states.colleges.length === 0 ? "Add college" : "Okay!",
      submitType: "success",
    });

    showModal();
    return;
  }

  initModal({
    title: "Add student",
    content: createStudentForm(),
    submitText: "Save student",
    submitType: "success",
    onSubmit: async () => {
      const student = getStudentFormValues();
      const [hasEmpty, emptyKeys] = getEmptyKeys(student);
      if (hasEmpty) {
        showErrorModal(
          `Please fill in the following fields: ${emptyKeys.join(", ")}`
        );
        return;
      }
      await onAddStudent(student);
    },
  });

  addPhotoUploadEventListeners();
  setCollegesToSelect(states.colleges);
  setYearsToSelect();

  showModal();
}

function showEditStudentModal(student: IStudent) {
  initModal({
    title: "Edit student",
    content: createStudentForm(),
    submitText: "Save student",
    submitType: "success",
    onSubmit: async () => {
      const student = getStudentFormValues();
      const [hasEmpty, emptyKeys] = getEmptyKeys(student);
      if (hasEmpty) {
        showErrorModal(
          `Please fill in the following fields: ${emptyKeys.join(", ")}`
        );
        return;
      }
      await onUpdateStudent(student);
    },
  });

  addPhotoUploadEventListeners();
  setCollegesToSelect(states.colleges);
  setYearsToSelect();

  setStudentFormValues(student);

  showModal();
}

function showDeleteStudentModal(id: string, name: string) {
  initModal({
    title: "Delete student",
    content: `
    <p class="is-size-5">
      Are you sure you want to delete student ${name}? This action cannot be undone.
    </p>
  `,
    submitText: "Delete student",
    submitType: "danger",
    onSubmit: async () => {
      await onDeleteStudent(id);
    },
  });

  showModal();
}

function showAddCollegeModal() {
  initModal({
    title: "Add college",
    content: createCollegeForm(),
    submitText: "Save college",
    submitType: "success",
    onSubmit: async () => {
      const college = getCollegeFormValues();
      const [hasEmpty, emptyKeys] = getEmptyKeys(college);
      if (hasEmpty) {
        showErrorModal(
          `Please fill in the following fields: ${emptyKeys.join(", ")}`
        );
        return;
      }
      await onAddCollege(college);
    },
  });

  addPhotoUploadEventListeners();

  showModal();
}

function showEditCollegeModal(college: ICollege) {
  initModal({
    title: "Edit college",
    content: createCollegeForm(),
    submitText: "Save college",
    submitType: "success",
    onSubmit: async () => {
      const college = getCollegeFormValues();
      const [hasEmpty, emptyKeys] = getEmptyKeys(college);
      if (hasEmpty) {
        showErrorModal(
          `Please fill in the following fields: ${emptyKeys.join(", ")}`
        );
        return;
      }
      await onUpdateCollege(college);
    },
  });

  addPhotoUploadEventListeners();

  setCollegeFormValues(college);

  showModal();
}

function showDeleteCollegeModal(id: string, name: string) {
  initModal({
    title: "Delete college",
    content: `
    <p class="is-size-5">
      Are you sure you want to delete college ${name}? This action cannot be undone.
    </p>
  `,
    submitText: "Delete college",
    submitType: "danger",
    onSubmit: async () => {
      await onDeleteCollege(id);
    },
  });

  showModal();
}

function showAddCourseModal(collegeId: string) {
  initModal({
    title: "Add course",
    content: createCourseForm(),
    submitText: "Save course",
    submitType: "success",
    onSubmit: async () => {
      const course = getCourseFormValues(collegeId);
      const [hasEmpty, emptyKeys] = getEmptyKeys(course);
      if (hasEmpty) {
        showErrorModal(
          `Please fill in the following fields: ${emptyKeys.join(", ")}`
        );
        return;
      }
      await onAddCourse(course);
    },
  });

  showModal();
}

function showEditCourseModal(course: ICourse) {
  initModal({
    title: "Edit course",
    content: createCourseForm(),
    submitText: "Save course",
    submitType: "success",
    onSubmit: async () => {
      const _course = getCourseFormValues(course.collegeId);
      const [hasEmpty, emptyKeys] = getEmptyKeys(_course);
      if (hasEmpty) {
        showErrorModal(
          `Please fill in the following fields: ${emptyKeys.join(", ")}`
        );
        return;
      }
      await onUpdateCourse(_course);
    },
  });

  setCourseFormValues(course);

  showModal();
}

function showDeleteCourseModal(id: string, name: string) {
  initModal({
    title: "Delete course",
    content: `
    <p class="is-size-5">
      Are you sure you want to delete course ${name}? This action cannot be undone.
    </p>
  `,
    submitText: "Delete course",
    submitType: "danger",
    onSubmit: async () => {
      await onDeleteCourse(id);
    },
  });

  showModal();
}

function showStudentInfoModal(student: IStudentWithCollegeCourse) {
  const fullName = `${student.firstName} ${student.lastName}`;

  initModal({
    title: "Student info",
    content: `
    <div class="card is-shadowless">
      <div class="card-content">
        <div class="is-flex is-align-items-center is-justify-content-center mb-5">
          <img
            class="image is-128x128 is-rounded "
            style="object-fit: cover; border: 1px solid #ccc;"
            src="${student.photo}"
          />
        </div>
        <p class="title has-text-centered">${fullName}</p>
        <p class="subtitle has-text-centered">${student.studentId}</p>
        <div class="content is-small">
          <p class="subtitle is-6">
            Student ID:
            <span class="tag is-info is-light is-large ml-2">
              ${student.studentId}
            </span>
          </p>
          <p class="subtitle is-6">
            First name:
            <span class="tag is-info is-light is-large ml-2">
              ${student.firstName}
            </span>
          </p>
          <p class="subtitle is-6">
            Last name:
            <span class="tag is-info is-light is-large ml-2">
              ${student.lastName}
            </span>
          </p>
          <p class="subtitle is-6">
            Birthday:
            <span class="tag is-info is-light is-large ml-2">
              ${student.birthday}
            </span>
          </p>
          <p class="subtitle is-6">
            Gender:
            <span class="tag is-info is-light is-large ml-2">
              ${student.gender}
            </span>
          </p>
          <p class="subtitle is-6">
            Year Started:
            <span class="tag is-info is-light is-large ml-2">
              ${student.year}
            </span>
          </p>
          <p class="subtitle is-6">
            College:
            <span class="tag is-info is-light is-large ml-2">
              <img
                class="image is-24x24 mr-1 is-full-rounded"
                src="${student.college.logo}"
              />
              ${student.college.name}
            </span>
          </p>
          <p class="subtitle is-6">
            Course:
            <span class="tag is-info is-light is-large ml-2">
              
              ${student.course.name}
            </span>
          </p>
        </div>
      </div>
    </div>
    `,
    submitText: "Okay!",
    submitType: "primary",
    showCancel: false,
    onSubmit: () => {
      hideModal();
    },
  });

  showModal();
}

function createStudentTemplate(student: IStudent) {
  const fullName = `${student.firstName} ${student.lastName}`;

  const template = `
  <div class="card">
    <div class="card-content">
      <div class="is-flex is-align-items-center is-justify-content-center mb-5">
        <img class="image is-128x128 is-rounded " style="object-fit: cover; border: 1px solid #ccc;" src="${student.photo}" />
      </div>
      <p class="title has-text-centered">
        ${fullName}
      </p>
      <p class="subtitle has-text-centered">
        ${student.studentId}
      </p>
      <div class="content is-small">
        <button class="button is-info is-light is-fullwidth mt-5">
          Show more info
        </button>
      </div>     
    </div>
    <footer class="card-footer buttons are-medium">
       <div class="card-footer-item is-flex is-justify-content-center">
        <button class="button is-primary is-light">
          Update
        </button>
      </div>
      <div class="card-footer-item is-flex is-justify-content-center">
        <button class="button is-danger is-light">
          Delete
        </button>
      </div>
    </footer>
  </div>
    `;

  return template;
}

function renderStudents() {
  if (states.students.length === 0) {
    studentList.innerHTML = `
      <div class="is-flex box is-justify-content-center is-align-items-center">
        <h1 class="is-size-3">No Students found</h1>
      </div>
    `;
    return;
  }

  studentList.innerHTML = "";
  studentList.classList.add(
    "is-flex",
    "is-flex-wrap-wrap",
    "is-justify-content-center"
  );

  states.students.forEach((student) => {
    const studentElement = document.createElement("li");
    studentElement.style.cssText =
      "flex: 1 1 320px; margin: 5px; max-width: 320px;";
    studentElement.innerHTML = createStudentTemplate(student);

    const updateButton = studentElement.querySelector(".is-primary");
    updateButton.addEventListener("click", () => {
      showEditStudentModal(student);
    });

    const deleteButton = studentElement.querySelector(".is-danger");
    deleteButton.addEventListener("click", () => {
      showDeleteStudentModal(student.id, student.firstName);
    });

    const showMoreButton = studentElement.querySelector(".is-info");
    showMoreButton.addEventListener("click", async () => {
      const studentWithCollegeAndCourse = await studentApiClient.get(
        student.id
      );
      showStudentInfoModal(studentWithCollegeAndCourse);
    });

    studentList.appendChild(studentElement);
  });
}

function createCollegeTemplate(college: ICollege, courses: ICourse[]) {
  const { name, abbreviation, logo } = college;

  const courseItems = courses
    .map((course) => {
      const { id, name, abbreviation, description } = course;

      return `
      <li class="box py-2 px-5 my-2 is-rounded">
        <div class="is-flex is-justify-content-space-between">
          <div class="is-flex is-flex-direction-column">
            <h4 class="is-size-4 bold">${name}
            <span class="is-size-5 has-text-grey-light ml-2">${abbreviation}</span>
          </h4>
          <p class="is-size-6">${description}</p>
        </div>
        <div class="is-flex is-align-items-center">
          <button id="update-${id}" class="button is-info mr-2">Update</button>
          <button id="delete-${id}" class="button is-danger">Delete</button>
        </div>
        </div>
      </li>`;
    })
    .join("");

  const template = `
    <div class="card p-5 my-5 rounded">
      <div class="is-flex is-align-items-center is-justify-content-space-between">
        <div class="is-flex is-align-items-center is-justify-content-center">
          <div class="is-flex is-align-items-center is-justify-content-center mr-5">
            <img class="image is-128x128 is-full-rounded " style="object-fit: cover; border: 1px solid #ccc;" src="${logo}" />
          </div>
          <div class="is-flex is-flex-direction-column">
            <h2 class="is-size-3 has-text-weight-bold">${name}</h2>
            <p class="is-size-4 has-text-weight-bold has-text-grey-light">${abbreviation}</p>
          </div>
        </div>
        <div class="is-flex is-justify-content-flex-end">
          <button class="button is-info">Update</button>
          <button class="button is-danger ml-2">Delete</button>
        </div>
      </div>
      <hr class="my-5" />
      <div class="mt-5">
        <h3 class="is-size-4 has-text-weight-bold">Courses</h3>
        <ul class="is-flex is-flex-direction-column">
          ${courseItems}
        </ul>
        <button class="button is-primary mt-5">Add course</button>
      </div>
    </div>`;

  return template;
}

function renderColleges() {
  if (states.colleges.length === 0) {
    collegeList.innerHTML = `
      <div class="is-flex box is-justify-content-center is-align-items-center">
        <h1 class="is-size-3">No colleges found</h1>
      </div>
    `;
    return;
  }

  collegeList.innerHTML = "";

  states.colleges.forEach((college) => {
    const collegeElement = document.createElement("li");
    collegeElement.innerHTML = createCollegeTemplate(college, college.courses);

    const updateButton = collegeElement.querySelector(".button.is-info");
    updateButton.addEventListener("click", () => {
      showEditCollegeModal(college);
    });

    const deleteButton = collegeElement.querySelector(".button.is-danger");
    deleteButton.addEventListener("click", () => {
      showDeleteCollegeModal(college.id, college.name);
    });

    const courseUpdateButtons = collegeElement.querySelectorAll(
      "button[id^='update-']"
    );
    courseUpdateButtons.forEach((btn) => {
      const id = btn.id.split("-")[1];
      const course = college.courses.find((course) => course.id === id);
      btn.addEventListener("click", () => {
        showEditCourseModal(course);
      });
    });

    const courseDeleteButtons = collegeElement.querySelectorAll(
      "button[id^='delete-']"
    );
    courseDeleteButtons.forEach((btn) => {
      const id = btn.id.split("-")[1];
      const course = college.courses.find((course) => course.id === id);
      btn.addEventListener("click", () => {
        showDeleteCourseModal(course.id, course.name);
      });
    });

    const addCourseButton = collegeElement.querySelector(".button.is-primary");
    addCourseButton.addEventListener("click", () => {
      showAddCourseModal(college.id);
    });

    collegeList.appendChild(collegeElement);
  });
}

async function initalized() {
  await getStudents();
  await getColleges();
  addStudentButton.addEventListener("click", showAddStudentModal);
  addCollegeButton.addEventListener("click", showAddCollegeModal);
}

initalized();
