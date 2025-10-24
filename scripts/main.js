//DOM REFERENCES

const taskItemContainer = document.querySelector('.task-item-container');
const form = document.querySelector('.task-form');
const totalTaskElement = document.querySelector('.task-total');
const doneTaskElement = document.querySelector('.task-done-count');
const nearDueTaskElement = document.querySelector('.near-due');
const pastDueTaskElement = document.querySelector('.past-due');
const overlay = document.querySelector('.overlay');


//MODEL

const taskArray = [
  {
    details: "Tulis di kertas selembar dan makan dengan hayam",
    due: "2025-10-30T23:59",
    subject: "Aljabar",
    title: "Tugas 2"
  },
  {
    details: "Ketik di LibreOffice dan makan dengan kambing",
    due: "2025-10-24T23:59",
    subject: "Kalkulus",
    title: "Tugas 3"
  },
  {
    details: "Ketik di LibreOffice dan makan dengan sapi",
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
  const formattedDate = date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
  const formattedTime = date.toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit'
  });
  return `${formattedDate}, ${formattedTime}`;
}

function getTaskStatus(task) {
  const now = new Date();
  const due = new Date(task.due);
  const isLate = task.done && due < now;
  
  if (isLate) return 'Selesai terlambat';
  if (task.done) return 'Selesai';
  if (task.pastDue) return 'Belum dikerjakan (Lewat deadline!)';
  if (task.nearDue) return 'Belum dikerjakan (Dekat deadline!)';
  return 'Belum dikerjakan';
}

function displayArray() {
  let taskItemHTML = '';
  taskArray.forEach((task, i) => {
    taskItemHTML += `
      <li class="task-item general-style" data-index="${i}">
        <div class="task-item-info">
          <h3>${task.title}</h3>
          <p>${task.subject} - Deadline:  ${formatDate(task.due)} - ${getTaskStatus(task)}</p>
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

function displayTaskDetailsPopUp(task) {
  overlay.innerHTML = `
    <div class="detail-popup general-style">
      <div class="detail-header">
        <h2>${task.title}</h2><button class="popup-close-btn general-style">Tutup</button>
      </div>
      <div class="detail-info">
        <p>Subjek: ${task.subject}</p>
        <p>Deadline: ${formatDate(task.due)}</p>
        <p>Status: ${getTaskStatus(task)}</p>
      </div>
      <div class="detail-desc">
        <p>Detail: </p>
        <p>${task.details}</p>
      </div>
    </div>
  `
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

function overlayToggle() {
  overlay.classList.toggle('hidden');
}

taskItemContainer.addEventListener('click', e => {
  const taskLi = e.target.closest('li'); 
  if (!taskLi) return;
  const index = taskLi.dataset.index;
  const task = taskArray[index];

  if (e.target.classList.contains('task-done')) {
    task.done = !task.done;
    render();
  } else if (taskLi) {
    displayTaskDetailsPopUp(task);
    overlayToggle();
  }
});

overlay.addEventListener('click',  e => {
  if (e.target.classList.contains('popup-close-btn') || e.target === overlay) {
    overlayToggle();
    overlay.innerHTML = '';
  }
});

//MAIN

render();
insertTaskDataToArrayOnFormSubmit();