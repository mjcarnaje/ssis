import "./index.css";
import { IStudent } from "./types";
import { genId } from "./utils/id";

function getElement<T extends HTMLElement = HTMLDivElement>(
  selector: string
): T {
  return document.querySelector(selector) as T;
}

const studentList = getElement<HTMLUListElement>("#student-list");
const addStudentButton = getElement<HTMLButtonElement>("#add-student");

const modal = getElement(".modal");
const modalTitle = getElement(".modal-card-title");
const modalClose = getElement(".modal-close");
const modalContent = getElement(".modal-card-body");
const modalFooter = getElement(".modal-card-foot");

const { studentApiClient } = window;

const states = {
  students: [] as IStudent[],
};

async function getAllStudents() {
  const students = await studentApiClient.getAll();
  console.log(students);
  states.students = students;
  renderStudents();
}

function showModal() {
  modal.classList.add("is-active");
}

function hideModal() {
  modal.classList.remove("is-active");
}

modalClose.addEventListener("click", hideModal);

async function onDeleteStudent(id: string) {
  await studentApiClient.delete(id);
  getAllStudents();
  hideModal();
}

function createStudentForm() {
  return `
    <div class="field">
      <label class="label">Photo</label>
      <div class="control">
        <figure class="image is-128x128">
          <img
            id="photo"
            class="is-rounded image is-128x128"
            style="object-fit: cover;"
            src="https://bulma.io/images/placeholders/128x128.png">
          </img>
        </figure>
        <input id="photo-input" class="is-hidden" type="file" accept="image/*" id="photoInput">
        <button class="button mt-2 is-info" id="uploadButton">Upload</button>
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
        <input class="input" type="text" placeholder="College ID" id="collegeId">
      </div>
    </div>
    <div class="field">
      <label class="label">Department ID</label>
      <div class="control">
        <input class="input" type="text" placeholder="Department ID" id="departmentId">
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
      <label class="label">Year</label>
      <div class="control">
        <div class="select">
          <select id="year">
            <option>1</option>
            <option>2</option>
            <option>3</option>
          </select>
        </div>
      </div>
    </div>
  `;
}

function getStudentFormValues(): IStudent {
  const { value: docId } = getElement<HTMLInputElement>("#docId");
  const { value: studentId } = getElement<HTMLInputElement>("#studentId");
  const { value: firstName } = getElement<HTMLInputElement>("#firstName");
  const { value: lastName } = getElement<HTMLInputElement>("#lastName");
  const { value: birthday } = getElement<HTMLInputElement>("#birthday");
  const { value: collegeId } = getElement<HTMLInputElement>("#collegeId");
  const { value: departmentId } = getElement<HTMLInputElement>("#departmentId");
  const { value: year } = getElement<HTMLInputElement>("#year");
  const { value: gender } = getElement<HTMLInputElement>(
    "input[name='gender']:checked"
  );
  const {
    files: [file],
  } = getElement<HTMLInputElement>("#photo-input");

  const photo = file?.path || getElement<HTMLInputElement>("#photo").src;

  const student: IStudent = {
    id: docId || genId(),
    studentId,
    firstName,
    lastName,
    birthday,
    collegeId,
    departmentId,
    photo,
    year,
    gender: gender as IStudent["gender"],
  };

  return student;
}

function setStudentFormValues(student: IStudent) {
  getElement<HTMLInputElement>("#docId").value = student.id;
  getElement<HTMLInputElement>("#studentId").value = student.studentId;
  getElement<HTMLInputElement>("#firstName").value = student.firstName;
  getElement<HTMLInputElement>("#lastName").value = student.lastName;
  getElement<HTMLInputElement>("#birthday").value = student.birthday;
  getElement<HTMLInputElement>("#collegeId").value = student.collegeId;
  getElement<HTMLInputElement>("#departmentId").value = student.departmentId;
  getElement<HTMLInputElement>("#year").value = student.year;
  const radioInputs = document.getElementsByName(
    "gender"
  ) as NodeListOf<HTMLInputElement>;
  for (let i = 0; i < radioInputs.length; i++) {
    if (radioInputs[i].value === student.gender) {
      radioInputs[i].checked = true;
      break;
    }
  }
  getElement<HTMLInputElement>("#photo").src = student.photo;
}

function addEventListeners() {
  const cancelButton = document.getElementById("cancelButton");
  cancelButton.addEventListener("click", hideModal);
}

function showDeleteModal(id: string, name: string) {
  modalTitle.textContent = "Delete student";
  modalTitle.className = "title is-4";

  modalContent.innerHTML = `
    <p class="is-size-5">
      Are you sure you want to delete student ${name}? This action cannot be undone.
    </p>
  `;

  modalFooter.innerHTML = `
    <div class="buttons is-right">
      <button class="button is-danger" id="deleteButton">Delete</button>
      <button class="button" id="cancelButton">Cancel</button>
    </div>
  `;

  const deleteButton = document.getElementById("deleteButton");
  deleteButton.addEventListener("click", () => onDeleteStudent(id));

  addEventListeners();
  showModal();
}

async function addStudent(student: IStudent) {
  await studentApiClient.create(student);
  getAllStudents();
  hideModal();
}

async function updateStudent(student: IStudent) {
  await studentApiClient.update(student);
  getAllStudents();
  hideModal();
}

async function deleteStudent(id: string) {
  await studentApiClient.delete(id);
  getAllStudents();
  hideModal();
}

function showAddStudentModal() {
  modalTitle.textContent = "Add student";
  modalTitle.className = "title is-4";

  modalContent.innerHTML = createStudentForm();

  modalFooter.innerHTML = `
    <div class="buttons is-right">
      <button class="button is-success" id="addButton">Add</button>
      <button class="button" id="cancelButton">Cancel</button>
    </div>
  `;

  const addButton = getElement<HTMLButtonElement>("#addButton");
  const uploadButton = getElement<HTMLButtonElement>("#uploadButton");
  const photoInput = getElement<HTMLInputElement>("#photo-input");

  uploadButton.addEventListener("click", () => {
    photoInput.click();
  });

  photoInput.addEventListener("change", onChangePhotoInput);

  addButton.addEventListener("click", async () => {
    const student = getStudentFormValues();
    await addStudent(student);
  });

  addEventListeners();
  showModal();
}

function onChangePhotoInput(e: Event) {
  // @ts-ignore
  const file = e.target["files"][0];
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => {
    const photo = reader.result as string;
    getElement<HTMLImageElement>("#photo").src = photo;
  };
}

function showEditStudentModal(student: IStudent) {
  modalTitle.textContent = "Edit student";
  modalTitle.className = "title is-4";

  modalContent.innerHTML = createStudentForm();

  modalFooter.innerHTML = `
    <div class="buttons is-right">
      <button class="button is-success" id="updateButton">Update</button>
      <button class="button" id="cancelButton">Cancel</button>
    </div>
  `;

  const uploadButton = getElement<HTMLButtonElement>("#uploadButton");

  setStudentFormValues(student);

  uploadButton.addEventListener("click", () => {
    photoInput.click();
  });

  const photoInput = getElement<HTMLInputElement>("#photo-input");
  photoInput.addEventListener("change", onChangePhotoInput);

  const editButton = getElement<HTMLButtonElement>("#updateButton");

  editButton.addEventListener("click", async () => {
    const student = getStudentFormValues();
    await updateStudent(student);
  });

  addEventListeners();

  showModal();
}

function renderStudents() {
  studentList.innerHTML = "";
  states.students.forEach((student) => {
    const studentElement = document.createElement("li");

    const img = document.createElement("img");
    img.src = student.photo;
    img.className = `is-rounded image is-64x64 mr-2`;
    img.style.objectFit = "cover";
    img.style.border = `1px solid #ccc`;
    img.style.borderRadius = `10%`;

    const studentIdElement = document.createElement("span");
    const deleteButtonElement = document.createElement("button");

    const name = `${student.firstName} ${student.lastName}`;

    studentIdElement.className = `is-size-4`;
    studentIdElement.innerText = `${name}`;
    studentElement.className = `box is-flex is-justify-content-space-between is-align-items-center`;
    deleteButtonElement.className = `button is-danger`;
    deleteButtonElement.innerText = `Delete`;

    const updateButtonElement = document.createElement("button");
    updateButtonElement.className = `button is-info`;
    updateButtonElement.innerText = `Update`;

    updateButtonElement.addEventListener("click", () => {
      showEditStudentModal(student);
    });

    deleteButtonElement.addEventListener("click", () =>
      showDeleteModal(student.id, name)
    );

    studentElement.appendChild(img);
    studentElement.appendChild(studentIdElement);
    studentElement.appendChild(updateButtonElement);
    studentElement.appendChild(deleteButtonElement);

    studentList.appendChild(studentElement);
  });
}

async function init() {
  await getAllStudents();
}

init();

addStudentButton.addEventListener("click", showAddStudentModal);
