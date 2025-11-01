import express from "express";
import routes from "./routes/taskRoutes.js"

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static('public'));
app.use('/api/task', routes);

app.listen(port, () => console.log(`Example app listening on port ${port}!`));