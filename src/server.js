const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static('public'));

let taskArray = [
  {
    id: 3,
    details: "Ketik di LibreOffice dan makan dengan sapi",
    due: "2025-10-20T23:59",
    subject: "PBO",
    title: "Tugas 3"
  },
  {
    id: 2,
    details: "Ketik di LibreOffice dan makan dengan kambing",
    due: "2025-11-01T23:59",
    subject: "Kalkulus",
    title: "Tugas 2"
  },
  {
    id: 1,
    details: "Tulis di kertas selembar dan makan dengan hayam",
    due: "2025-11-05T23:59",
    subject: "Aljabar",
    title: "Tugas 1"
  }
];

app.get('/api/task', (req, res) => {
  res.json(taskArray);
});

app.post('/api/task', (req, res) => {
  const body = req.body;
  taskArray.unshift(body);
  res.sendStatus(201);
})

app.put('/api/task/:id', (req, res) => {
  const body = req.body;
  const id = Number(req.params.id);
  const index = taskArray.findIndex(t => t.id === id);
  taskArray[index] = body;
  res.sendStatus(201);
});

app.delete('/api/task/:id', (req, res) => {
  const id = Number(req.params.id);
  const index = taskArray.findIndex(t => t.id === id);
  taskArray.splice(index, 1);
  res.sendStatus(201);
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));