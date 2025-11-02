//DOM REFERENCES AND FLAGS

let taskId;
let isEditing = false;
let filterState = 'all';

const mainFilterBtn = document.querySelector('.main-filter-btn');
const filterBtnArr = document.querySelectorAll('.filter-btn');
const taskItemContainer = document.querySelector('.task-item-container');
const navbarBtn = document.querySelector('.navbar-btn');
const navbar = document.querySelectorAll('.navbar');

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

const STORAGE_KEY = 'task_list';
const DEFAULT_TASK_DATA = [];

function getTasksFromStorage() {
  const tasksString = localStorage.getItem(STORAGE_KEY);
  if (!tasksString) {
    return [];
  }
  try {
    return JSON.parse(tasksString);
  } catch (error) {
    console.error("Error parsing tasks from localStorage:", error);
    return [];
  }
}

function saveTasksToStorage(tasks) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function getFilteredArray() {
  const taskArray = getTasksFromStorage();
  switch (filterState) {
  case 'done': return taskArray.filter(t => t.done);
  case 'past-due': return taskArray.filter(t => t.pastDue && !t.done);
  case 'near-due': return taskArray.filter(t => t.nearDue && !t.pastDue && !t.done);
  case 'undone': return taskArray.filter(t => !t.done);
  default: return taskArray;
  }
}

function calculateTaskCount() {
  const taskArray = getTasksFromStorage();
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
    all: taskArray.length,
    done,
    nearDue,
    pastDue
  };
}

function updateTaskStatuses() {
  const taskArray = getTasksFromStorage(); 
  const now = new Date();
  let needsSave = false;

  taskArray.forEach(task => {
    const due = new Date(task.due);
    const diffDays = Math.ceil((due - now) / (1000 * 60 * 60 * 24));

    const newPastDue = diffDays <= 0 && !task.done;
    const newNearDue = diffDays <= 2 && !task.done;

    if (task.pastDue !== newPastDue || task.nearDue !== newNearDue) {
        task.pastDue = newPastDue;
        task.nearDue = newNearDue;
        needsSave = true;
    }
  });

  if (needsSave) {
      saveTasksToStorage(taskArray);
  }
}

function getDataFromForm() {
  const taskData = new FormData(form);
  const taskObj = Object.fromEntries(taskData.entries());
  return taskObj;
}

function createId() {
  return Date.now() + Math.floor(Math.random() * 1000);
}

function getTaskFromId(id) {
  const taskArray = getTasksFromStorage();
  const task = taskArray.find(t => t.id === id);
  return task;
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
          <button class="task-btns-handler-${task.id} task-btns-handler general-style">⋮</button>
          <div class="task-btns-${task.id} task-btns hidden">
            <button class="task-delete button-general general-style">Hapus</button>
            <button class="task-edit button-general general-style">Edit</button>
            <button class="task-done general-style button-general">${task.done ? 'Batal' : 'Tandai selesai'}</button>
          </div>
        </div>
      </li>
    `
    });
  }
  taskItemContainer.innerHTML = taskItemHTML;
}

function displayCounters() {
  const counters = calculateTaskCount();
  const percentage = (counters.all > 0) ? Math.round((counters.done / counters.all) * 100) : 0;
  
  totalTaskElement.innerHTML = counters.total;
  doneTaskElement.innerHTML = counters.done;
  doneTaskElement.previousElementSibling.innerHTML = `Selesai (${percentage}%)`;
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

function displayDeleteConfirmationPopUp(task) {
  overlay.innerHTML = `
    <div class="delete-popup general-style">
      <h2>Apa anda yakin ingin menghapus ${task.title}?</h2>
      <div>
        <button class="conf-delete-btn general-style button-general">Ya</button>
        <button class="cancel-delete-btn general-style button-general">Tidak</button>
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

function cancelEdit() {
  isEditing = false;
  inputFormHeaderIsEditingToggle(false);
  cancelEditBtnToggle(true);
  form.reset();
}

async function render() {
  form.reset();
  updateTaskStatuses();
  displayArray();
  displayCounters();
}

//CONTROLLER

form.addEventListener('submit', async e => {
  e.preventDefault();
  
  const taskArray = getTasksFromStorage();
  const taskObj = getDataFromForm();
  
  if (isEditing) {
    const index = taskArray.findIndex(t => t.id === taskId);
    if (index > -1) {
        taskArray[index] = {...taskArray[index], ...taskObj}; 
    }
    cancelEdit();
  } else {
    const newTask = {
        id: createId(), 
        ...taskObj,
        done: false 
    };
    taskArray.unshift(newTask);
  }

  saveTasksToStorage(taskArray);

  render();
  form.reset();
});

cancelEditBtn.addEventListener('click', e => {
  cancelEdit();
});

function toggleTaskButtons (id, taskBtnsHidden, taskBtnsHandlerHidden) {
    document.querySelector(`.task-btns-${id}`).classList.toggle('hidden', taskBtnsHidden);
    document.querySelector(`.task-btns-${id}`).classList.toggle('task-btns-flex', !taskBtnsHidden);
    document.querySelector(`.task-btns-handler-${id}`).classList.toggle('hidden', taskBtnsHandlerHidden);
}

function toggleGlobalTaskButtons() {
  document.querySelectorAll(`.task-btns`).forEach(btn => btn.classList.toggle('hidden', true));
  document.querySelectorAll(`.task-btns`).forEach(btn => btn.classList.toggle('task-btns-flex', false));
  document.querySelectorAll(`.task-btns-handler`).forEach(handler => handler.classList.toggle('hidden', false));
}

async function handleDoneTaskBtn(task, id) {
  const taskArray = getTasksFromStorage();
  const index = taskArray.findIndex(t => t.id === id);

  if (index > -1) {
      taskArray[index].done = !taskArray[index].done;
      saveTasksToStorage(taskArray);
  }

  cancelEdit();
  render();
}

function handleEditTaskBtn(task, id) {
  titleInput.focus();
  isEditing = true;
  taskId = id;
  inputFormHeaderIsEditingToggle(true);

  form.title.value = task.title;
  form.subject.value = task.subject;
  form.due.value = task.due;
  form.details.value = task.details;

  cancelEditBtnToggle(false);
  toggleTaskButtons(id, true, false);
}

function handleDeleteTaskBtn(task, id) {
  displayDeleteConfirmationPopUp(task);
  overlayToggle();
  taskId = id; 
  toggleTaskButtons(id, true, false);
  cancelEdit();
}

taskItemContainer.addEventListener('click', async e => {
  const taskLi = e.target.closest('li'); 
  if (!taskLi) return;
  const id = Number(taskLi.dataset.id);
  taskId = id;
  const task = getTaskFromId(id);

  if (e.target.classList.contains('task-done')) {
    handleDoneTaskBtn(task, id);
  } else if (e.target.classList.contains('task-edit')) {
    handleEditTaskBtn(task, id);
  } else if (e.target.classList.contains('task-delete')) {
    handleDeleteTaskBtn(task, id);
  } else if (e.target.classList.contains(`task-btns-handler-${id}`)) {
    toggleGlobalTaskButtons();
    toggleTaskButtons(id, false, true);
  } else if(taskLi) {
    displayTaskDetailsPopUp(task);
    overlayToggle();
  }
});

overlay.addEventListener('click', async e => {
  if (e.target.classList.contains('conf-delete-btn')) {
    let taskArray = getTasksFromStorage();
    taskArray = taskArray.filter(t => t.id !== taskId);
    saveTasksToStorage(taskArray);

    render();
    overlay.innerHTML = '';
    overlayToggle();
  } else if (e.target.classList.contains('popup-close-btn') || e.target.classList.contains('cancel-delete-btn') || e.target === overlay) {
    overlay.innerHTML = '';
    overlayToggle();
  }
});

mainFilterBtn.addEventListener('click', () => {
  filterBtnsToggle(mainFilterBtn, true);
  filterBtnArr.forEach(btn => {
    filterBtnsToggle(btn, false);
  });
});

filterBtnArr.forEach(btn => {
  btn.addEventListener('click', async () => {
    filterState = btn.dataset.filter;
    mainFilterBtn.innerHTML = `Filter: ${btn.innerHTML}`;
    cancelEdit();
    render();
    filterBtnArr.forEach(btn => {
      filterBtnsToggle(btn, true);
    });
    filterBtnsToggle(mainFilterBtn, false);
  });
});

document.addEventListener('click', e => {
  if (!e.target.classList.contains('task-btns-handler')) {
    toggleGlobalTaskButtons();
  } 
  if (e.target !== mainFilterBtn) {
    filterBtnArr.forEach(btn => {
      filterBtnsToggle(btn, true);
    });
    filterBtnsToggle(mainFilterBtn, false);
  }
});

navbarBtn.addEventListener('click', () => {
  filterBtnsToggle(navbarBtn, true);
  navbar.forEach(b => {
    filterBtnsToggle(b, false);
  })
});

navbar.forEach(b => {
  b.addEventListener('click', () => {
  navbar.forEach(b => {
    filterBtnsToggle(b, true);
  });
  filterBtnsToggle(navbarBtn, false);
  });
});



//MAIN

render();