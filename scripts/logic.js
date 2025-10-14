function inputLogic() {
  const overlayElem = document.querySelector('.overlay');
  const addBtn = document.querySelector('.add-button');
  const closeBtn = document.querySelector('.close-btn');
  const inputToggle = (show) => overlayElem.classList.toggle('hidden', show);
  
  addBtn.addEventListener('click', () => inputToggle(false));
  closeBtn.addEventListener('click', () => inputToggle(true));
  overlayElem.addEventListener('click', e => e.target === overlayElem && inputToggle(true));
  document.addEventListener('keydown', e => e.key === 'Escape' && inputToggle(true));

  const form = document.querySelector('#task-form');

  form.addEventListener('submit', e => {
    let inputArray = [];

    e.preventDefault();
    const taskData = new FormData(form);
    const taskObj = Object.fromEntries(taskData.entries());
    inputArray.push(taskObj);

    let itemHTML = '';

    inputArray.forEach(task => {

      const item = `
        <li class="task-item">
          <div class="task-item-name">
            <h3 id="item-title">${task.title}</h3>
            <p>${task.subject} - ${task.due}</p>
          </div>
          <div class="task-item-button">
            <button>Edit</button><button id="done-button">Tandai selesai</button>
          </div>
        </li>
      `    
      itemHTML += item;
      console.log(itemHTML);
    });

    document.querySelector('.task-item-container').insertAdjacentHTML('beforeend', itemHTML);

    form.reset();
    inputToggle(true);
    console.log(inputArray);
  });
}

export function logic() {
  inputLogic();
}