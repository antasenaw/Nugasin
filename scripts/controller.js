import { inputArray } from "./model.js";

// function formElement() {
//   const formElement = {
//     overlayElem: document.querySelector('.overlay'),
//     addBtn: document.querySelector('.add-button'),
//     closeBtn: document.querySelector('.close-btn'),
//     inputToggle: (show) => formElement.overlayElem.classList.toggle('hidden', show)
//   };
//   return formElement;
// }

// function inputFormController(object) {
//   object.addBtn.addEventListener('click', () => object.inputToggle(false));
//   object.closeBtn.addEventListener('click', () => object.inputToggle(true));
//   object.overlayElem.addEventListener('click', e => e.target === object.overlayElem && object.inputToggle(true));
//   document.addEventListener('keydown', e => e.key === 'Escape' && object.inputToggle(true));
// }

// function handleInputData (object) {
//   const form = document.querySelector('#task-form');

//   form.addEventListener('submit', e => {
//     e.preventDefault();
//     const taskData = new FormData(form);
//     const taskObj = Object.fromEntries(taskData.entries());
//     inputArray.push(taskObj);

//     let itemHTML = '';

//     inputArray.forEach((task) => {
//       const item = `
//         <li class="task-item">
//           <div class="task-item-name">
//             <h3 class="item-title">${task.title}</h3>
//             <p>${task.subject} - ${task.due}</p>
//           </div>
//           <div class="task-item-button">
//             <button class="edit-button">Edit</button><button class="done-button">Tandai selesai</button>
//           </div>
//         </li>
//       `
//       itemHTML = item;
//     });

//     document.querySelector('.task-item-container').insertAdjacentHTML('beforeend', itemHTML);

//     // form.reset();
//     // object.inputToggle(true);
//     console.log(inputArray);
//     console.log(itemHTML);
//   });
// }

export function controller() {
  renderTaskList();
  handleFormSubmit();
}

function renderTaskList() {
  let itemHTML = '';
  const countDisplay = {
    doneCount: 0,
    nearDue: 0,
    pastDue: 0,
    toDoCount: inputArray.length
  };

  inputArray.forEach(task => {

    const dueDate = new Date(task.due);
    const today = new Date();
    const diffTime = dueDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays <= 2 && diffDays >= 0) {
      task.nearDue = true;
      countDisplay.nearDue++;
    } else if (diffDays < 0) {
      task.pastDue = true;
      countDisplay.pastDue++;
    }
    
    if (task.done) {
      countDisplay.doneCount++;
      countDisplay.toDoCount--;
      if (task.nearDue) {
        countDisplay.nearDue--;
      } else if (task.pastDue) {
        countDisplay.pastDue--;
      }
    }

    const formattedDate = new Date(task.due).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });

    const item = `
      <li class="task-item general-style">
        <div class="task-item-info">
          <h3>${task.title}</h3>
          <p>${task.subject} - Deadline:  ${formattedDate} ${(task.done && task.pastDue) ? ' - Selesai terlambat' : task.done ? ' - Selesai' : task.nearDue ? ' - Belum dikerjakan (Dekat deadline!)' : task.pastDue ? ' - Belum dikerjakan (Lewat deadline!)' : ' - Belum dikerjakan'}</p>
        </div>
        <div class="task-item-button">
          <button class="task-edit general-style">Edit</button><button class="task-done general-style">${task.done ? 'Batal' : 'Tandai selesai'}</button>
        </div>
      </li>
    `
    itemHTML += item;
  });

  document.querySelector('.task-item-container').innerHTML = itemHTML;

  // object.inputToggle(true);
  // console.log(inputArray);

  document.querySelector('.task-total').textContent = countDisplay.toDoCount;
  document.querySelector('.task-done-count').innerHTML = countDisplay.doneCount;
  document.querySelector('.near-due').innerHTML = countDisplay.nearDue;
  document.querySelector('.past-due').innerHTML = countDisplay.pastDue;

  controlTask();
}

function handleFormSubmit() {
  
  // closePopUpListener();
  const form = document.querySelector('.task-form');

  form.addEventListener('submit', e => {
      e.preventDefault();
      const taskData = new FormData(form);
      const taskObj = Object.fromEntries(taskData.entries());
      taskObj.done = false;
      taskObj.nearDue = false;
      taskObj.pastDue = false;
      inputArray.push(taskObj);
      renderTaskList();
      form.reset();
  });
}

function markTaskAsDone(btn) {
  let isCd = false;

  btn.forEach((button, i)  => {
    button.addEventListener('click', () => {
      if (isCd) return;

      inputArray[i].done = !inputArray[i].done;
      renderTaskList();

      isCd = true;
      setTimeout(() => {
        isCd = false;
      }, 500);
    });
  });
}



function controlTask() {
  const doneBtn = document.querySelectorAll('.task-done');
  markTaskAsDone(doneBtn);
}