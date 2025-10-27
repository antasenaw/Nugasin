//DOM REFERENCES AND FLAGS

let isEditing = false;
let taskIndex;
let filterState = 'all';

const mainFilterBtn = document.querySelector('.main-filter-btn');
const filterBtnArr = document.querySelectorAll('.filter-btn');
const taskItemContainer = document.querySelector('.task-item-container');

const form = document.querySelector('.task-form');
const titleInput = document.querySelector('input[name="title"]');
const inputFormHeader = document.querySelector('.task-input h2');
const inputFormButton = document.querySelector('.form-fieldset button');
const cancelEditBtn = document.querySelector('.cancel-edit-btn');

const totalTaskElement = document.querySelector('.task-total');
const doneTaskElement = document.querySelector('.task-done-count');
const nearDueTaskElement = document.querySelector('.near-due');
const pastDueTaskElement = document.querySelector('.past-due');

const overlay = document.querySelector('.overlay');


//MODEL

const taskArray = [
  {
    details: "Ketik di LibreOffice dan makan dengan sapi",
    due: "2025-10-20T23:59",
    subject: "PBO",
    title: "Tugas 3"
  },
  {
    details: "Ketik di LibreOffice dan makan dengan kambing",
    due: "2025-10-27T23:59",
    subject: "Kalkulus",
    title: "Tugas 2"
  },
  {
    details: "Tulis di kertas selembar dan makan dengan hayam",
    due: "2025-10-30T23:59",
    subject: "Aljabar",
    title: "Tugas 1"
  }
];

let filteredArray;

function updateFilteredArray() {
  switch (filterState) {
  case 'done':
    filteredArray = taskArray.filter(t => t.done);
    break;
  case 'past-due':
    filteredArray = taskArray.filter(t => t.pastDue && !t.done);
    break;
  case 'near-due':
    filteredArray = taskArray.filter(t => t.nearDue && !t.pastDue && !t.done);
    break;
  case 'undone':
    filteredArray = taskArray.filter(t => !t.done);
    break;
  default:
    filteredArray = taskArray;
    break;
  }
}

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

    task.pastDue = diffDays <= 0 && !task.done;
    task.nearDue = diffDays <= 2 && !task.done;
  });
}

function getDataFromForm() {
  const taskData = new FormData(form);
  const taskObj = Object.fromEntries(taskData.entries());
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
  filteredArray.forEach((task, i) => {
    taskItemHTML += `
      <li class="task-item general-style" data-index="${i}">
        <div class="task-item-info">
          <h3>${task.title} - <em>${getTaskStatus(task)}</em></h3>
          <p>${task.subject} - Deadline:  ${formatDate(task.due)}</p>
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
        <h2>${task.title} - <em>${getTaskStatus(task)}</em></h2>
        <button class="popup-close-btn general-style">Tutup</button>
      </div>
      <div class="detail-info">
        <p>Subjek: ${task.subject}</p>
        <p>Deadline: ${formatDate(task.due)}</p>
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


function cancelEditBtnToggle(toggle) {
  cancelEditBtn.classList.toggle('hidden', toggle);
}

function overlayToggle() {
  overlay.classList.toggle('hidden');
}

function filterBtnsToggle(btn, state) {
  btn.classList.toggle('hidden', state);
}

function render() {
  updateTaskStatuses();
  updateFilteredArray();
  displayArray();
  displayCounters();
}

//CONTROLLER

form.addEventListener('submit', e => {
  e.preventDefault();
  const taskObj = getDataFromForm();
  
  if (isEditing) {
    taskArray[taskIndex] = {...taskArray[taskIndex], ...taskObj};
    // filteredArray[taskIndex] = {...filteredArray[taskIndex], ...taskObj};
    isEditing = false;
    inputFormHeaderIsEditingToggle(false);
    cancelEditBtnToggle(true);
  } else {
    taskArray.unshift(taskObj);
    // filteredArray.push(taskObj);
  }
  render();
  console.log(taskArray);
  // form.reset();
});

cancelEditBtn.addEventListener('click', e => {
    isEditing = false;
    inputFormHeaderIsEditingToggle(false);
    cancelEditBtnToggle(true);
    form.reset();
});

taskItemContainer.addEventListener('click', e => {
  const taskLi = e.target.closest('li'); 
  if (!taskLi) return;
  const index = taskLi.dataset.index;
  const task = filteredArray[index];
  const originalIndex = taskArray.indexOf(task);
  const originalTask = taskArray[originalIndex];
  if (originalIndex === -1) return;

  if (e.target.classList.contains('task-done')) {
    originalTask.done = !originalTask.done;
    render();
  } else if (e.target.classList.contains('task-edit')) {
    titleInput.focus();
    isEditing = true;
    taskIndex = originalIndex;
    inputFormHeaderIsEditingToggle(true);

    form.title.value = originalTask.title;
    form.subject.value = originalTask.subject;
    form.due.value = originalTask.due;
    form.details.value = originalTask.details;

    cancelEditBtnToggle(false);
  } else if (taskLi) {
    displayTaskDetailsPopUp(originalTask);
    overlayToggle();
  }
});

overlay.addEventListener('click',  e => {
  if (e.target.classList.contains('popup-close-btn') || e.target === overlay) {
    overlay.innerHTML = '';
    overlayToggle();
  }
});

mainFilterBtn.addEventListener('click', () => {
  filterBtnsToggle(mainFilterBtn, true);
  filterBtnArr.forEach(btn => {
    filterBtnsToggle(btn, false);
  })
});

filterBtnArr.forEach(btn => {
  btn.addEventListener('click', () => {
    filterState = btn.dataset.filter;
    mainFilterBtn.innerHTML = `Filter: ${btn.innerHTML}`;
    render();
    console.log(filteredArray);
    filterBtnArr.forEach(btn => {
      filterBtnsToggle(btn, true);
    });
    filterBtnsToggle(mainFilterBtn, false);
  });
})

//MAIN

render();