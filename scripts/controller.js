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

let isCd = false;

export function controller() {
  // const formElem = formElement();
  // inputFormController(formElem);
  renderTaskList();
  handleFormSubmit();
  // onDone();
}

function renderTaskList() {
  let itemHTML = '';
  let toDoCount = inputArray.length;
  const countDisplay = {
    doneCount: 0,
    nearDue: 0,
    pastDue: 0
  };

  inputArray.forEach(task => {

    if (task.done) {
      countDisplay.doneCount++;
      toDoCount--;
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
          <p>${task.subject} - Deadline:  ${formattedDate} ${task.done ? ' - Selesai' : ''}</p>
        </div>
        <div class="task-item-button">
          <button class="task-edit general-style">Edit</button><button class="task-done general-style">Tandai selesai</button>
        </div>
      </li>
    `
    itemHTML += item;
  });

  document.querySelector('.task-item-container').innerHTML = itemHTML;

  // form.reset();
  // object.inputToggle(true);
  console.log(inputArray);

  updateTaskCount(toDoCount);
  document.querySelector('.task-done-count').innerHTML = countDisplay.doneCount;

  const doneBtn = document.querySelectorAll('.task-done');
  onDone(doneBtn);
}

function handleFormSubmit() {
  
  const form = document.querySelector('.task-form');

  form.addEventListener('submit', e => {
      e.preventDefault();
      const taskData = new FormData(form);
      const taskObj = Object.fromEntries(taskData.entries());
      taskObj.done = false;
      // taskObj.nearDue = false;
      // taskObj.pastDue = false;
      inputArray.push(taskObj);
      renderTaskList();
  });
}

function updateTaskCount(total) {
  document.querySelector('.task-total').textContent = total;
}


function onDone(btn) {
  btn.forEach((button, i)  => {
    const index = i;
    button.addEventListener('click', () => {
      if (isCd) return;

      console.log(i);
      inputArray[i].done = true;
      renderTaskList();

      isCd = true;
      setTimeout(() => {
        isCd = false;
      }, 500);
    })
  })
}
