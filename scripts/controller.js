import { inputArray } from "./model.js";

function formElement() {
  const formElement = {
    overlayElem: document.querySelector('.overlay'),
    addBtn: document.querySelector('.add-button'),
    closeBtn: document.querySelector('.close-btn'),
    inputToggle: (show) => formElement.overlayElem.classList.toggle('hidden', show)
  };
  return formElement;
}

function inputFormController(object) {
  object.addBtn.addEventListener('click', () => object.inputToggle(false));
  object.closeBtn.addEventListener('click', () => object.inputToggle(true));
  object.overlayElem.addEventListener('click', e => e.target === object.overlayElem && object.inputToggle(true));
  document.addEventListener('keydown', e => e.key === 'Escape' && object.inputToggle(true));
}

function handleInputData (object) {
  const form = document.querySelector('#task-form');

  form.addEventListener('submit', e => {
    e.preventDefault();
    const taskData = new FormData(form);
    const taskObj = Object.fromEntries(taskData.entries());
    inputArray.push(taskObj);

    let itemHTML = '';

    inputArray.forEach((task) => {
      const item = `
        <li class="task-item">
          <div class="task-item-name">
            <h3 class="item-title">${task.title}</h3>
            <p>${task.subject} - ${task.due}</p>
          </div>
          <div class="task-item-button">
            <button class="edit-button">Edit</button><button class="done-button">Tandai selesai</button>
          </div>
        </li>
      `
      itemHTML = item;
    });

    document.querySelector('.task-item-container').insertAdjacentHTML('beforeend', itemHTML);

    // form.reset();
    // object.inputToggle(true);
    console.log(inputArray);
    console.log(itemHTML);
  });
}

export function controller() {
  const formElem = formElement();
  inputFormController(formElem);
  handleInputData(formElem);
}