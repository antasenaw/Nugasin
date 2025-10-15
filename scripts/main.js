// import { view } from './view.js';
// import { controller } from "./controller.js";

// view();
// controller();

export let inputArray = [];

const form = document.querySelector('.task-form');

form.addEventListener('submit', e => {
  e.preventDefault();
  const taskData = new FormData(form);
  const taskObj = Object.fromEntries(taskData.entries());
  inputArray.push(taskObj);
  let itemHTML = '';

  inputArray.forEach((task) => {
    const formattedDate = new Date(task.due).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });

    const item = `
      <li class="task-item general-style">
        <div class="task-item-info">
          <h3>${task.title}</h3>
          <p>${task.subject} - Deadline:  ${formattedDate}</p>
        </div>
        <div class="task-item-button">
          <button class="task-edit general-style">Edit</button><button class="task-delete general-style">Tandai selesai</button>
        </div>
      </li>
    `
    itemHTML = item;
  });

  document.querySelector('.task-item-container').insertAdjacentHTML('beforeend', itemHTML);

    // form.reset();
    // object.inputToggle(true);
    console.log(inputArray);
    // console.log(itemHTML);
});