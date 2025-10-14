export const bodyHTML = `
  <div class="body-container">

    <header class="header-container">
      <h1>Nugasin</h1>
      <button class="add-button">Tambah tugas</button>
    </header>

    <main class="main-container">

    </main>

  </div>
`

export const taskRowHTML = `
  <div class="task-row">
  </div>
`;

export const taskContainerName = ['Harus dikerjakan', 'Dekat tenggat', 'Lewat tenggat', 'Selesai'];

// Accumulator array
export let taskContainerHTML = [];

taskContainerName.forEach(nama => {
  const taskContainerTemp = `
    <section class="task-container">
      <h2>${nama}</h2>
      <ul class="task-item-container">
        <li class="task-item">
          <div class="task-item-name">
            <h3 id="item-title">tugas 1</h3>
            <p>Aljabar - Tenggat: 20 Oktober 2025</p>
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
  taskContainerHTML.push(taskContainerTemp);
})