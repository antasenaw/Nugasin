import express from "express";
import routes from "./routes/taskRoutes.js"
import { connectDB } from "./config/db.js";

connectDB();

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static('public'));
app.use('/api/tasks', routes);

app.listen(port, () => console.log(`App listening on port http://localhost:${port}!`));