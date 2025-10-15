// // import { bodyHTML, taskRowHTML, taskContainerHTML, inputFormHTML } from "./components.js";

// const components = {

//   bodyHTML: `
//     <div class="body-container">

//       <header class="header-container">
//         <h1>Nugasin</h1>
//         <button class="add-button">Tambah tugas</button>
//       </header>

//       <main class="main-container">

//       </main>

//     </div>
//   `,
//   taskRowHTML: `
//     <div class="task-row">
//     </div>
//   `,
//   taskContainerName:
//     ['Harus dikerjakan', 'Dekat tenggat', 'Lewat tenggat', 'Selesai'],
//   taskContainerHTML:
//     [],
//   inputFormHTML: `
//     <div class="overlay hidden">
//       <div class="add-task-container">
//           <div class="add-task-header">
//             <h2>Tambah tugas</h2>
//             <button class="close-btn">Tutup</button>
//           </div>
//         <form id="task-form">
//           <fieldset class="form-fieldset">
//             <label for="title">Judul tugas</label>
//             <input type="text" id="title" name="title" required>
//             <label for="subject">Subjek tugas</label>
//             <input type="text" id="subject" name="subject" required>
//             <label for="due">Tenggat</label>
//             <input type="datetime-local" id="due" name="due" required>
//             <label for="details">Detail tugas</label>
//             <textarea id="details" name="details" required rows="1"></textarea>
//             <button type="submit" class="submit-task-btn">Tambah tugas</button>
//           </fieldset>
//         </form>
//       </div>
//     </div>
//   `,
//   taskContainer() {
//     this.taskContainerName.forEach(nama => {
//       const taskContainerTemp = `
//         <section class="task-container">
//           <h2>${nama}</h2>
//           <ul class="task-item-container">
//             <li class="task-item">
//               <div class="task-item-name">
//                 <h3 class="item-title">tugas 1</h3>
//                 <p>Aljabar - Tenggat: 20 Oktober 2025</p>
//               </div>
//               <div class="task-item-button">
//                 <button>Edit</button><button class="done-button">Tandai selesai</button>
//               </div>
//             </li>
//             <li class="task-item">
//               <div class="task-item-name">
//                 <h3 class="item-title">tugas 1</h3>
//                 <p>Aljabar - 20 Oktober 2025</p>
//               </div>
//               <div class="task-item-button">
//                 <button>Edit</button><button class="done-button">Tandai selesai</button>
//               </div>
//             </li>
//           </ul>
//         </section>
//     `
//       this.taskContainerHTML.push(taskContainerTemp);
//     })
//   }
// }

// components.taskContainer();

// function renderBody() {
//   document.querySelector('body').insertAdjacentHTML("beforeend", components.bodyHTML);
// }

// function renderTaskRow() {
//   const mainElem = document.querySelector('.main-container');
//   for (let i = 0; i < 2; i++) {
//     mainElem.insertAdjacentHTML("beforeend", components.taskRowHTML) ;
//   }
// }

// function renderTaskContainer() {
//   document.querySelectorAll('.task-row').forEach((taskRow, rowIndex) => {
//     const start = rowIndex * 2;
//     const end = start + 2;
//     const containers = components.taskContainerHTML.slice(start, end);
//     containers.forEach(html => {
//       taskRow.insertAdjacentHTML("beforeend", html);
//     });
//   });
// }

// function renderInputForm() {
//   document.querySelector('.task-row').insertAdjacentHTML("beforebegin", components.inputFormHTML);
// }

// export function view () {
//   renderBody();
//   renderTaskRow();
//   renderTaskContainer();
//   renderInputForm();
// }