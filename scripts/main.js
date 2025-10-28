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
    id: createId(),
    details: "Ketik di LibreOffice dan makan dengan sapi",
    due: "2025-10-20T23:59",
    subject: "PBO",
    title: "Tugas 3"
  },
  {
    id: createId(),
    details: "Ketik di LibreOffice dan makan dengan kambing",
    due: "2025-10-28T23:59",
    subject: "Kalkulus",
    title: "Tugas 2"
  },
  {
    id: createId(),
    details: "Tulis di kertas selembar dan makan dengan hayam",
    due: "2025-10-30T23:59",
    subject: "Aljabar",
    title: "Tugas 1"
  }
];

function getFilteredArray() {
  switch (filterState) {
  case 'done': return taskArray.filter(t => t.done);
  case 'past-due': return taskArray.filter(t => t.pastDue && !t.done);
  case 'near-due': return taskArray.filter(t => t.nearDue && !t.pastDue && !t.done);
  case 'undone': return taskArray.filter(t => !t.done);
  default: return taskArray;
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

function createId() {
  return Date.now() + Math.floor(Math.random() * 1000);
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
  const filteredArray = getFilteredArray();
  let taskItemHTML = '';
  if (filteredArray.length === 0) {
    taskItemHTML = '<p style="text-align: center;">Sepertinya tidak ada apa-apa disini<p>';
  } else {
    filteredArray.forEach((task) => {
    taskItemHTML += `
      <li class="task-item general-style" data-id="${task.id}">
        <div class="task-item-info">
          <h3>${task.title} - <em>${getTaskStatus(task)}</em></h3>
          <p>${task.subject} - Deadline:  ${formatDate(task.due)}</p>
        </div>
        <div class="task-item-button">
          <button class="task-edit general-style">Edit</button>
          <button class="task-done general-style">${task.done ? 'Batal' : 'Tandai selesai'}</button>
          <button class="task-delete">×</button>
        </div>
      </li>
    `
    });
  }
  taskItemContainer.innerHTML = taskItemHTML;
}

function displayCounters() {
  const counters = calculateTaskCount();
  totalTaskElement.innerHTML = counters.total;
  doneTaskElement.innerHTML = counters.done;
  doneTaskElement.previousElementSibling.innerHTML = `Selesai (${Math.round(counters.done/taskArray.length * 100)}%)`;
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
  displayArray();
  displayCounters();
  console.log(taskArray);
}

//CONTROLLER

form.addEventListener('submit', e => {
  e.preventDefault();
  const taskObj = isEditing ? {...getDataFromForm()} : {id: createId(), ...getDataFromForm()};
  
  if (isEditing) {
    taskArray[taskIndex] = {...taskArray[taskIndex], ...taskObj};
    isEditing = false;
    inputFormHeaderIsEditingToggle(false);
    cancelEditBtnToggle(true);
  } else {
    taskArray.unshift(taskObj);
  }
  render();
  form.reset();
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
  const id = Number(taskLi.dataset.id);
  const index = taskArray.findIndex(t => t.id === id);
  const task = taskArray[index];

  if (e.target.classList.contains('task-done')) {
    task.done = !task.done;
    render();
  } else if (e.target.classList.contains('task-edit')) {
    titleInput.focus();
    isEditing = true;
    taskIndex = index;
    inputFormHeaderIsEditingToggle(true);

    form.title.value = task.title;
    form.subject.value = task.subject;
    form.due.value = task.due;
    form.details.value = task.details;

    cancelEditBtnToggle(false);
  } else if (e.target.classList.contains('task-delete')) {
    taskArray.splice(index, 1);
    render();
  } else if(taskLi) {
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
    filterBtnArr.forEach(btn => {
      filterBtnsToggle(btn, true);
    });
    filterBtnsToggle(mainFilterBtn, false);
  });
})

//MAIN

render();
