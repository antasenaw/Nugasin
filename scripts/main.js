//DOM REFERENCES AND FLAGS

let isEditing = false;
let taskIndex;

const now = new Date();

const taskItemContainer = document.querySelector('.task-item-container');

const form = document.querySelector('.task-form');
const titleInput = document.querySelector('input[name="title"]');
const inputFormHeader = document.querySelector('.task-input h2');
const inputFormButton = document.querySelector('.form-fieldset button');

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
    due: "2025-10-25T23:59",
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
  
  taskArray.forEach(task => {
    const due = new Date(task.due);
    const diffDays = Math.ceil((due - now) / (1000 * 60 * 60 * 24));

    // Reset and recalculate
    task.pastDue = diffDays <= 0 && !task.done;
    task.nearDue = diffDays <= 2 && !task.done;
  });
}

function getDataFromForm() {
  const taskData = new FormData(form);
  const taskObj = Object.fromEntries(taskData.entries());
  if (!isEditing) {
    taskObj.done = false;
    taskObj.nearDue = false;
    taskObj.pastDue = false;
  }
  return taskObj;
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

function inputFormHeaderIsEditingToggle(isEditing) {
  inputFormHeader.textContent = isEditing ? 'Edit tugas' : 'Tambah tugas'
  inputFormButton.textContent = isEditing ? 'Edit tugas' : 'Tambah tugas'
}

function render() {
  updateTaskStatuses();
  displayArray();
  displayCounters();
}

//CONTROLLER

  form.addEventListener('submit', e => {
    e.preventDefault();
    const taskObj = getDataFromForm();
    
    if (isEditing) {
      taskArray[taskIndex] = {...taskArray[taskIndex], ...taskObj};
      isEditing = false;
      inputFormHeaderIsEditingToggle(false);
    } else {
      taskArray.push(taskObj);
    }
    render();
    form.reset();
  });

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
  } else if (e.target.classList.contains('task-edit')) {
    titleInput.focus();
    isEditing = true;
    taskIndex = index;
    inputFormHeaderIsEditingToggle(true);

    form.title.value = taskArray[index].title;
    form.subject.value = taskArray[index].subject;
    form.due.value = taskArray[index].due;
    form.details.value = taskArray[index].details;
  } else if (taskLi) {
    displayTaskDetailsPopUp(task);
    overlayToggle();
  }
});

overlay.addEventListener('click',  e => {
  if (e.target.classList.contains('popup-close-btn') || e.target === overlay) {
    overlay.innerHTML = '';
    overlayToggle();
  }
});

//MAIN

render();