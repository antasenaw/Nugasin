//DOM REFERENCES

const taskItemContainer = document.querySelector('.task-item-container');
const form = document.querySelector('.task-form');

//MODEL

const taskArray = [];

//VIEW

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
}

function getTaskStatus(task) {
  if (task.done && task.pastDue) return ' - Selesai terlambat';
  if (task.done) return ' - Selesai';
  if (task.nearDue) return ' - Belum dikerjakan (Dekat deadline!)';
  if (task.pastDue) return ' - Belum dikerjakan (Lewat deadline!)';
  return ' - Belum dikerjakan';
}

function displayArray() {
  let taskItemHTML = '';
  taskArray.forEach(task => {
    taskItemHTML += `
      <li class="task-item general-style">
        <div class="task-item-info">
          <h3>${task.title}</h3>
          <p>${task.subject} - Deadline:  ${formatDate(task.due)} ${getTaskStatus(task)}</p>
        </div>
        <div class="task-item-button">
          <button class="task-edit general-style">Edit</button>
          <button class="task-done general-style">${task.done ? 'Batal' : 'Tandai selesai'}</button>
        </div>
      </li>
    `
  });
  taskItemContainer.innerHTML = taskItemHTML;
}

//CONTROLLER

function insertTaskDataToArrayOnFormSubmit(params) {
  form.addEventListener('submit', e => {
    e.preventDefault();
    const taskData = new FormData(form);
    const taskObj = Object.fromEntries(taskData.entries());
    taskObj.done = false;
    taskObj.nearDue = false;
    taskObj.pastDue = false;
    taskArray.push(taskObj);
    console.log(taskArray);
    displayArray();
  });  
}

//MAIN

displayArray();
insertTaskDataToArrayOnFormSubmit();