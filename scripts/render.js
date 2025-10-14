import { bodyHTML, taskRowHTML, taskContainerHTML, inputFormHTML } from "./components.js";

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

export function render () {
  renderBody();
  renderTaskRow();
  renderTaskContainer();
  document.querySelector('.task-row').insertAdjacentHTML("beforebegin", inputFormHTML);
}