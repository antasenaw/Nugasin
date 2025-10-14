import { render } from './render.js';

render();

// input pop up
const overlayElem = document.querySelector('.overlay');
const addBtn = document.querySelector('.add-button');
const closeBtn = document.querySelector('.close-btn');

const inputToggle = (show) => overlayElem.classList.toggle('hidden', show);

addBtn.addEventListener('click', () => inputToggle(false));
closeBtn.addEventListener('click', () => inputToggle(true));
overlayElem.addEventListener('click', e => e.target === overlayElem && inputToggle(true));
document.addEventListener('keydown', e => e.key === 'Escape' && inputToggle(true));

// get input
const submitBtn = document.querySelector('.submit-task-btn');
const form = document.querySelector('#task-form');
// const title = document.querySelector('#title');
// const subject = document.querySelector('#subject');
// const due = document.querySelector('#due');
// const details = document.querySelector('#details');

// console.log(form);

submitBtn.addEventListener('click', () => {
  const taskData = new FormData(form);
  const taskObj = Object.fromEntries(taskData.entries());
  console.log(taskObj);
});
