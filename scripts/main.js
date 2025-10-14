import { render } from './render.js';

render();

export let inputArray = [];

let itemHTML = '';

inputArray.forEach(task => {
  const item = `
    <li class="task-item">
      <div class="task-item-name">
        <h3 id="item-title">${task.title}</h3>
        <p>${task.subject} - ${task.due}</p>
      </div>
      <div class="task-item-button">
        <button>Edit</button><button id="done-button">Tandai selesai</button>
      </div>
    </li>
  `
  itemHTML += item;
  console.log(itemHTML);
  document.querySelector('.task-item-container').insertAdjacentHTML('beforeend', itemHTML);
})

