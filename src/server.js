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
  console.log(taskArray);
});

app.post('/api/task', (req, res) => {
  let body = req.body;
  taskArray = body;
  res.sendStatus(200);
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`));