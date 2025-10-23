//DOM REFERENCES

const taskItemContainer = document.querySelector('.task-item-container');
const form = document.querySelector('.task-form');
const totalTaskElement = document.querySelector('.task-total');
const doneTaskElement = document.querySelector('.task-done-count');
const nearDueTaskElement = document.querySelector('.near-due');
const pastDueTaskElement = document.querySelector('.past-due');


//MODEL

const taskArray = [];

function calculateTaskCount() {
  const done = taskArray.filter(task => task.done).length;
  const nearDue = taskArray.filter(task => task.nearDue).length;
  const pastDue = taskArray.filter(task => task.pastDue).length;
  return {
    total: taskArray.length - done,
    done,
    nearDue,
    pastDue
  };
}

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
  taskArray.forEach((task, i) => {
    taskItemHTML += `
      <li class="task-item general-style" data-index="${i}">
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

function displayCounters() {
  const counters = calculateTaskCount();
  totalTaskElement.innerHTML = counters.total;
  doneTaskElement.innerHTML = counters.done;
}

function render() {
  displayArray();
  displayCounters();
}

//CONTROLLER

function insertTaskDataToArrayOnFormSubmit() {
  form.addEventListener('submit', e => {
    e.preventDefault();
    const taskData = new FormData(form);
    const taskObj = Object.fromEntries(taskData.entries());
    taskObj.done = false;
    taskObj.nearDue = false;
    taskObj.pastDue = false;
    taskArray.push(taskObj);
    console.log(taskArray);
    render();
  });  
}

taskItemContainer.addEventListener('click', e => {
  if (e.target.classList.contains('task-done')) {
    console.log('mmk');
    const index = e.target.closest('li').dataset.index;
    taskArray[index].done = !taskArray[index].done;
    render();
  }
})

//MAIN

render();
insertTaskDataToArrayOnFormSubmit();