const taskRow = `
  <div class="task-row">
  </div>
`;

const taskContainer = `
  <section class="task-container">
    <h2>Lewat tenggat</h2>
    <ul class="task-item-container">
      <li class="task-item">
        <div class="task-item-name">
          <h3 id="item-title">tugas 1</h3>
          <p>Aljabar - 20 Oktober 2025</p>
        </div>
        <div class="task-item-button">
          <button>Edit</button><button id="done-button">Tandai selesai</button>
        </div>
      </li>
      <li class="task-item">
        <div class="task-item-name">
          <h3 id="item-title">tugas 1</h3>
          <p>Aljabar - 20 Oktober 2025</p>
        </div>
        <div class="task-item-button">
          <button>Edit</button><button id="done-button">Tandai selesai</button>
        </div>
      </li>
      <li class="task-item">
        <div class="task-item-name">
          <h3 id="item-title">tugas 1</h3>
          <p>Aljabar - 20 Oktober 2025</p>
        </div>
        <div class="task-item-button">
          <button>Edit</button><button id="done-button">Tandai selesai</button>
        </div>
      </li>
    </ul>
  </section>
`

const taskContainerName = ['Harus dikerjakan, Dekat tenggat, Lewat tenggat, Selesai'];


  const mainElem = document.querySelector('.main-container');

  for (let i = 0; i < 2; i++) {
    mainElem.innerHTML += taskRow;
  }

  const taskRowElem = document.querySelectorAll('.task-row').forEach((taskRow) => {
    for (let i = 0; i < 2; i++) {
      taskRow.innerHTML += taskContainer;
    }
  });

  
