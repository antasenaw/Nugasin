//DOM REFERENCES

const taskItemContainer = document.querySelector('.task-item-container');
const form = document.querySelector('.task-form');
const totalTaskElement = document.querySelector('.task-total');
const doneTaskElement = document.querySelector('.task-done-count');
const nearDueTaskElement = document.querySelector('.near-due');
const pastDueTaskElement = document.querySelector('.past-due');


//MODEL

const taskArray = [
  {
    details: "Tulis di kertas selembar dan ewe ewe kan dengan hayam",
    due: "2025-10-30T23:59",
    subject: "Aljabar",
    title: "Tugas 2"
  },
  {
    details: "Ketik di LibreOffice dan ewe ewe kan dengan kambing",
    due: "2025-10-24T23:59",
    subject: "Kalkulus",
    title: "Tugas 3"
  },
  {
    details: "Ketik di LibreOffice dan ewe ewe kan dengan kambing",
    due: "2025-10-20T23:59",
    subject: "PBO",
    title: "Tugas 1"
  }
];

function calculateTaskCount() {
  const now = new Date();
  let done = 0, nearDue = 0, pastDue = 0;

  taskArray.forEach(task => {
    const due = new Date(task.due);
    const diffDays = Math.ceil((due - now) / (1000 * 60 * 60 * 24));

    if (task.done) done++;
    else if (diffDays <= 0) pastDue++;
    else if (diffDays <= 2) nearDue++;
  });

  return {
    total: taskArray.length - done,
    done,
    nearDue,
    pastDue
  };
}

function updateTaskStatuses() {
  const now = new Date();
  taskArray.forEach(task => {
    const due = new Date(task.due);
    const diffDays = Math.ceil((due - now) / (1000 * 60 * 60 * 24));

    // Reset and recalculate
    task.pastDue = diffDays <= 0 && !task.done;
    task.nearDue = diffDays <= 2 && !task.done;
  });
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
  const now = new Date();
  const due = new Date(task.due);
  const isLate = task.done && due < now;
  
  if (isLate) return ' - Selesai terlambat';
  if (task.done) return ' - Selesai';
  if (task.pastDue) return ' - Belum dikerjakan (Lewat deadline!)';
  if (task.nearDue) return ' - Belum dikerjakan (Dekat deadline!)';
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
  nearDueTaskElement.innerHTML = counters.nearDue;
  pastDueTaskElement.innerHTML = counters.pastDue;
}

function render() {
  updateTaskStatuses();
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