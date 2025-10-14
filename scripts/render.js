import { bodyHTML, taskRowHTML, taskContainerHTML, inputFormHTML } from "./components.js";
import { inputArray } from "./main.js";

function renderBody() {
  document.querySelector('body').insertAdjacentHTML("beforeend", bodyHTML);
}

function renderTaskRow() {
  const mainElem = document.querySelector('.main-container');
  for (let i = 0; i < 2; i++) {
    mainElem.insertAdjacentHTML("beforeend", taskRowHTML) ;
  }
}

function renderTaskContainer() {
  document.querySelectorAll('.task-row').forEach((taskRow, rowIndex) => {
    const start = rowIndex * 2;
    const end = start + 2;
    const containers = taskContainerHTML.slice(start, end);
    containers.forEach(html => {
      taskRow.insertAdjacentHTML("beforeend", html);
    });
  });
}

// input pop up
function renderInputForm () {

  document.querySelector('.task-row').insertAdjacentHTML("beforebegin", inputFormHTML);

  const overlayElem = document.querySelector('.overlay');
  const addBtn = document.querySelector('.add-button');
  const closeBtn = document.querySelector('.close-btn');
  const inputToggle = (show) => overlayElem.classList.toggle('hidden', show);

  addBtn.addEventListener('click', () => inputToggle(false));
  closeBtn.addEventListener('click', () => inputToggle(true));
  overlayElem.addEventListener('click', e => e.target === overlayElem && inputToggle(true));
  document.addEventListener('keydown', e => e.key === 'Escape' && inputToggle(true));

  // get input
  const form = document.querySelector('#task-form');

  form.addEventListener('submit', e => {
    e.preventDefault();
    const taskData = new FormData(form);
    const taskObj = Object.fromEntries(taskData.entries());
    inputArray.push(taskObj);
    form.reset();
    inputToggle(true);
    console.log(inputArray);
  });
}

export function render () {
  renderBody();
  renderTaskRow();
  renderTaskContainer();
  renderInputForm();
}