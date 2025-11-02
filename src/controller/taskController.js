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

export function getTask (req, res) {
  res.json(taskArray);
}

export function addTask (req, res) {
  const body = req.body;
  taskArray.unshift(body);
  res.status(201).json(body);
}

export function editTask (req, res) {
  const body = req.body;
  const id = Number(req.params.id);
  const index = taskArray.findIndex(t => t.id === id);
  taskArray[index] = body;
  res.sendStatus(201);
}

export function deleteTask (req, res) {
  const id = Number(req.params.id);
  const index = taskArray.findIndex(t => t.id === id);
  taskArray.splice(index, 1);
  res.sendStatus(201);
}